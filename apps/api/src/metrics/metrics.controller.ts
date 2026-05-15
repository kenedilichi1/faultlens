import { Controller, Get, Query } from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { MetricsService } from './metrics.service';
import { LogVolumeDto } from './dto/log-volume.dto';

@ApiTags('Metrics')
@Controller('metrics')
export class MetricsController {
  constructor(private readonly metricsService: MetricsService) {}

  @Get('overview')
  async getOverview() {
    return this.metricsService.getOverview();
  }

  @Get('services')
  async getServiceMetrics() {
    return this.metricsService.getServiceMetrics();
  }

  @Get('incidents/trending')
  async getTrendingIncidents() {
    return this.metricsService.getTrendingIncidents();
  }

  @Get('log-volume')
  async getLogVolume(@Query() query: LogVolumeDto) {
    return this.metricsService.getLogVolume(
      query.interval || 'hour',
      query.from,
      query.to,
    );
  }
}
