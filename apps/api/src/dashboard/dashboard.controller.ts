import { Controller, Get, Param, UseGuards } from '@nestjs/common';

import { DashboardService } from './dashboard.service';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

import { CurrentUser } from '../auth/decorators/current-user.decorator';

import { type AuthUser } from '../auth/types/auth-user.type';

@Controller('organizations/:organizationId/dashboard')
@UseGuards(JwtAuthGuard)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('summary')
  getSummary(
    @Param('organizationId')
    organizationId: string,

    @CurrentUser()
    user: AuthUser,
  ) {
    return this.dashboardService.getOrganizationSummary(
      organizationId,
      user.userId,
    );
  }
}
