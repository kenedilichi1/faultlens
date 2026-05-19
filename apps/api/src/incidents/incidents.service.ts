import { Injectable } from '@nestjs/common';
import { Severity } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class IncidentsService {
  constructor(private readonly prisma: PrismaService) {}

  async processIncident(fingerprint: string, message: string, level: string) {
    const existingIncident = await this.prisma.incident.findUnique({
      where: {
        fingerprint,
      },
    });

    const severity = this.mapSeverity(level);

    if (existingIncident) {
      return this.prisma.incident.update({
        where: {
          id: existingIncident.id,
        },
        data: {
          lastSeen: new Date(),
          occurrenceCount: {
            increment: 1,
          },
        },
      });
    }

    return this.prisma.incident.create({
      data: {
        fingerprint,
        title: message,
        severity,
        firstSeen: new Date(),
        lastSeen: new Date(),
      },
    });
  }

  async findAll() {
    return this.prisma.incident.findMany({
      orderBy: {
        lastSeen: 'desc',
      },
    });
  }

  async getIncidentLogs(id: string) {
    return this.prisma.log.findMany({
      where: {
        incidentId: id,
      },

      orderBy: {
        timestamp: 'desc',
      },

      take: 50,
    });
  }

  private mapSeverity(level: string): Severity {
    switch (level) {
      case 'ERROR':
        return Severity.HIGH;

      case 'WARN':
        return Severity.MEDIUM;

      default:
        return Severity.LOW;
    }
  }
}
