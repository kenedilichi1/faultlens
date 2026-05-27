import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { RealtimeGateway } from 'src/realtime/realtime.gateway';
import { determineSeverity, generateSeverityMessage } from './utils/severity';

@Injectable()
export class AnomaliesService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly realtimeGateway: RealtimeGateway,
  ) {}

  public async detectErrorSpike(organizationId: string) {
    const now = new Date();

    const lastFiveMinutes = new Date(now.getTime() - 5 * 60 * 1000);

    const previousFiveMinutes = new Date(now.getTime() - 10 * 60 * 1000);

    const currentErrorCount = await this.prismaService.log.count({
      where: {
        organizationId,
        level: 'ERROR',
        createdAt: {
          gte: lastFiveMinutes,
        },
      },
    });

    const previousErrorCount = await this.prismaService.log.count({
      where: {
        organizationId,
        level: 'ERROR',
        createdAt: {
          gte: previousFiveMinutes,
          lt: lastFiveMinutes,
        },
      },
    });

    if (previousErrorCount === 0) {
      return {
        anomaly: false,
        reason: 'No historical  baseline',
      };
    }

    const increase =
      ((currentErrorCount - previousErrorCount) / previousErrorCount) * 100;

    const isSpike = increase >= 100;

    let createdAnomaly = null;

    const severity = determineSeverity(increase);

    if (isSpike) {
      createdAnomaly = await this.prismaService.anomaly.create({
        data: {
          type: 'ERROR_SPIKE',

          severity,

          message: generateSeverityMessage(severity),

          currentValue: currentErrorCount,

          previousValue: previousErrorCount,

          increasePercentage: Number(increase.toFixed(2)),

          organizationId,
        },
      });

      this.realtimeGateway.emitAnomalyDetected(createdAnomaly);
    }

    return {
      anomaly: isSpike,

      anomalyRecord: createdAnomaly,

      currentErrors: currentErrorCount,

      previousErrors: previousErrorCount,

      increasePercentage: Number(increase.toFixed(2)),

      detectedAt: new Date().toISOString(),
    };
  }

  async findAll(organizationId: string) {
    return this.prismaService.anomaly.findMany({
      where: {
        organizationId,
      },

      orderBy: {
        detectedAt: 'desc',
      },

      take: 50,
    });
  }

  async acknowledge(anomalyId: string, userId: string) {
    return this.prismaService.anomaly.update({
      where: {
        id: anomalyId,
      },

      data: {
        status: 'ACKNOWLEDGED',

        acknowledgedAt: new Date(),

        acknowledgedById: userId,
      },
    });
  }

  async resolve(anomalyId: string, userId: string) {
    return this.prismaService.anomaly.update({
      where: {
        id: anomalyId,
      },

      data: {
        status: 'RESOLVED',

        resolvedAt: new Date(),

        resolvedById: userId,
      },
    });
  }
}
