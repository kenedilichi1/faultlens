import { Controller, Get } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';

import { Queue } from 'bullmq';
import { ApiTags } from '@nestjs/swagger';

@Controller('queue')
export class QueueController {
  constructor(
    @InjectQueue('log-processing')
    private readonly logQueue: Queue,
  ) {}

  @ApiTags('queue')
  @Get('failed')
  async getFailedJobs() {
    const jobs = await this.logQueue.getFailed();

    return jobs.map((job) => ({
      id: job.id,
      data: job.data,
      failedReason: job.failedReason,
      attemptsMade: job.attemptsMade,
    }));
  }
}
