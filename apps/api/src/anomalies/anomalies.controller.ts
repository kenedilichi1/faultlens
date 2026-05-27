import { Controller, Get, Param, Patch } from '@nestjs/common';

import { AnomaliesService } from './anomalies.service';

@Controller('anomalies')
export class AnomaliesController {
  constructor(private readonly anomaliesService: AnomaliesService) {}

  @Get('error-spikes')
  detectErrorSpike() {
    const organizationId = 'REPLACE_WITH_REAL_ORG_ID';

    return this.anomaliesService.detectErrorSpike(organizationId);
  }

  @Get()
  findAll() {
    const organizationId = 'REPLACE_WITH_REAL_ORG_ID';

    return this.anomaliesService.findAll(organizationId);
  }

  @Patch(':id/acknowledge')
  acknowledge(@Param('id') id: string) {
    const userId = 'TEMP_USER_ID';

    return this.anomaliesService.acknowledge(id, userId);
  }

  @Patch(':id/resolve')
  resolve(@Param('id') id: string) {
    const userId = 'TEMP_USER_ID';

    return this.anomaliesService.resolve(id, userId);
  }
}
