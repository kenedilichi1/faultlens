import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MetricsService {
  constructor(private readonly prisma: PrismaService) {}

  async getOverview() {
    const [totalLogs, errorLogs, warnLogs, activeIncidents, totalServices] =
      await Promise.all([
        this.prisma.log.count(),

        this.prisma.log.count({
          where: {
            level: 'ERROR',
          },
        }),

        this.prisma.log.count({
          where: {
            level: 'WARN',
          },
        }),

        this.prisma.incident.count(),

        this.prisma.log.groupBy({
          by: ['serviceName'],
        }),
      ]);

    return {
      totalLogs,
      errorLogs,
      warnLogs,
      activeIncidents,
      totalServices: totalServices.length,
    };
  }

  async getServiceMetrics(organizationId) {
    return this.prisma.log.groupBy({
      by: ['serviceName'],

      where: {
        level: 'ERROR',
        organizationId,
      },

      _count: {
        id: true,
      },

      orderBy: {
        _count: {
          id: 'desc',
        },
      },

      take: 10,
    });
  }

  async getTrendingIncidents(projectId: string) {
    return this.prisma.incident.findMany({
      where: { projectId },
      orderBy: {
        occurrenceCount: 'desc',
      },

      take: 10,
    });
  }

  async getLogVolume(organizationId: string) {
    const logs = await this.prisma.log.groupBy({
      by: ['level'],

      where: {
        organizationId,
      },

      _count: true,
    });

    return logs;
  }

  async getIncidentFrequency(organizationId: string) {
    return this.prisma.incident.count({
      where: {
        project: {
          organizationId,
        },
      },
    });
  }

  async getRecentErrorRate(organizationId: string) {
    const lastHour = new Date(Date.now() - 60 * 60 * 1000);

    const totalLogs = await this.prisma.log.count({
      where: {
        organizationId,

        createdAt: {
          gte: lastHour,
        },
      },
    });

    const errorLogs = await this.prisma.log.count({
      where: {
        organizationId,

        level: 'ERROR',

        createdAt: {
          gte: lastHour,
        },
      },
    });

    if (totalLogs === 0) {
      return 0;
    }

    return Number(((errorLogs / totalLogs) * 100).toFixed(2));
  }
}
