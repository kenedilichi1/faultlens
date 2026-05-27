import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

import { InjectQueue } from '@nestjs/bullmq';

import { Queue } from 'bullmq';

@Injectable()
export class HealthService {
  constructor(
    private readonly prismaService: PrismaService,
    @InjectQueue('log-processing') private readonly logQueue: Queue,
  ) {}

  async checkHealth() {
    const startedAt = Date.now();

    const database = await this.checkDatabase();

    const queue = await this.checkQueue();

    const duration = Date.now() - startedAt;

    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      responseTime: `${duration}ms`,
      service: {
        database,
        queue,
      },
    };
  }

  private async checkDatabase() {
    try {
      await this.prismaService.$queryRaw`SELECT 1`;

      return {
        status: 'connected',
      };
    } catch {
      return {
        status: 'disconnected',
      };
    }
  }

  private async checkQueue() {
    try {
      const jobCounts = await this.logQueue.getJobCounts();
      return {
        status: 'connected',
        jobs: jobCounts,
      };
    } catch {
      return {
        status: 'disconnected',
      };
    }
  }
}
