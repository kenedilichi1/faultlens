import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

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

  async getServiceMetrics() {
    return this.prisma.log.groupBy({
      by: ['serviceName'],

      where: {
        level: 'ERROR',
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

  async getTrendingIncidents() {
    return this.prisma.incident.findMany({
      orderBy: {
        occurrenceCount: 'desc',
      },

      take: 10,
    });
  }

  async getLogVolume(
    interval: 'minute' | 'hour' | 'day',
    from?: string,
    to?: string,
  ) {
    return this.prisma.$queryRaw<{ bucket: Date; count: number }[]>(Prisma.sql`
  SELECT
    DATE_TRUNC(${Prisma.raw(`'${interval}'`)}, "timestamp") as bucket,
    COUNT(*)::int as count
  FROM "Log"
  WHERE "timestamp"
    BETWEEN ${from ? new Date(from) : new Date(0)}
    AND ${to ? new Date(to) : new Date()}
  GROUP BY bucket
  ORDER BY bucket ASC
`);
  }
}
