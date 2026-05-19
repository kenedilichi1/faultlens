import { Controller, Get, Param } from '@nestjs/common';

import { IncidentsService } from './incidents.service';

@Controller('incidents')
export class IncidentsController {
  constructor(private readonly incidentsService: IncidentsService) {}

  @Get()
  async findAll() {
    return this.incidentsService.findAll();
  }

  @Get(':id/logs')
  async getIncidentLogs(@Param('id') id: string) {
    return this.incidentsService.getIncidentLogs(id);
  }
}
