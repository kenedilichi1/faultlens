import { Body, Controller, Post, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

import { CurrentUser } from '../auth/decorators/current-user.decorator';

import { type AuthUser } from '../auth/types/auth-user.type';

import { OrganizationsService } from './organizations.service';

import { CreateOrganizationDto } from './dto/create-organization.dto';

@Controller('organizations')
export class OrganizationsController {
  constructor(private readonly organizationsService: OrganizationsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @Body()
    dto: CreateOrganizationDto,

    @CurrentUser()
    user: AuthUser,
  ) {
    return this.organizationsService.create(dto.name, user.userId);
  }
}
