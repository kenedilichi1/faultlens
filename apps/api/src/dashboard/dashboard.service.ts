import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { OrganizationsService } from 'src/organizations/organizations.service';

@Injectable()
export class DashboardService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly organizationsService: OrganizationsService,
  ) {}

  // async getSummary() {
  //   const now = new Date();

  //   const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000);

  //   const [
  //     totalLogs,
  //     errorLogs,
  //     recentIncidents,
  //     topServices,
  //     recentErrors,
  //     severityBreakdown,
  //   ] = await Promise.all([
  //     this.prisma.log.count(),

  //     this.prisma.log.count({
  //       where: {
  //         level: 'ERROR',
  //         timestamp: {
  //           gte: last24Hours,
  //         },
  //       },
  //     }),

  //     this.prisma.incident.findMany({
  //       orderBy: {
  //         lastSeen: 'desc',
  //       },

  //       take: 5,
  //     }),

  //     this.prisma.log.groupBy({
  //       by: ['serviceName'],

  //       _count: {
  //         id: true,
  //       },

  //       orderBy: {
  //         _count: {
  //           id: 'desc',
  //         },
  //       },

  //       take: 5,
  //     }),

  //     this.prisma.log.findMany({
  //       where: {
  //         level: 'ERROR',
  //       },

  //       orderBy: {
  //         timestamp: 'desc',
  //       },

  //       take: 10,
  //     }),

  //     this.prisma.incident.groupBy({
  //       by: ['severity'],

  //       _count: {
  //         id: true,
  //       },
  //     }),
  //   ]);

  //   const healthScore = this.calculateHealthScore(errorLogs, totalLogs);

  //   return {
  //     totalLogs,
  //     errorLogs,
  //     recentIncidents,
  //     topServices,
  //     recentErrors,
  //     healthScore,
  //     severityBreakdown,
  //   };
  // }

  async getOrganizationSummary(organizationId: string, userId: string) {
    await this.organizationsService.verifyMembership(organizationId, userId);

    const projects = await this.prisma.project.findMany({
      where: {
        organizationId,
      },

      select: {
        id: true,
      },
    });

    const projectIds = projects.map((p) => p.id);

    const [totalLogs, totalIncidents, criticalIncidents] = await Promise.all([
      this.prisma.log.count({
        where: {
          projectId: {
            in: projectIds,
          },
        },
      }),

      this.prisma.incident.count({
        where: {
          projectId: {
            in: projectIds,
          },
        },
      }),

      this.prisma.incident.count({
        where: {
          projectId: {
            in: projectIds,
          },

          severity: 'CRITICAL',
        },
      }),
    ]);

    return {
      totalLogs,
      totalIncidents,
      criticalIncidents,
      projectCount: projects.length,
    };
  }

  private calculateHealthScore(errorLogs: number, totalLogs: number) {
    if (totalLogs === 0) {
      return 100;
    }

    const errorRate = (errorLogs / totalLogs) * 100;

    return Math.max(0, Math.round(100 - errorRate));
  }
}
