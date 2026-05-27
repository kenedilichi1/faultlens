import { Controller, Get, Query } from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { MetricsService } from './metrics.service';

@ApiTags('Metrics')
@Controller('metrics')
export class MetricsController {
  constructor(private readonly metricsService: MetricsService) {}

  @Get('overview')
  async overview() {
    const organizationId = 'REPLACE_WITH_REAL_ORG_ID';

    const [logVolume, incidentCount, errorRate] = await Promise.all([
      this.metricsService.getLogVolume(organizationId),

      this.metricsService.getIncidentFrequency(organizationId),

      this.metricsService.getRecentErrorRate(organizationId),
    ]);

    return {
      logVolume,
      incidentCount,
      errorRate,
    };
  }
}
