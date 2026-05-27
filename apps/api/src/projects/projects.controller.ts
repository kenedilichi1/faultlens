import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

import { CurrentUser } from '../auth/decorators/current-user.decorator';

import { type AuthUser } from '../auth/types/auth-user.type';

import { ProjectsService } from './projects.service';

import { CreateProjectDto } from './dto/create-project.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Projects')
@Controller('organizations/:organizationId/projects')
@UseGuards(JwtAuthGuard)
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  create(
    @Param('organizationId')
    organizationId: string,

    @Body()
    dto: CreateProjectDto,

    @CurrentUser()
    user: AuthUser,
  ) {
    return this.projectsService.create(organizationId, user.userId, dto.name);
  }

  @Get()
  findAll(
    @Param('organizationId')
    organizationId: string,

    @CurrentUser()
    user: AuthUser,
  ) {
    return this.projectsService.findByOrganization(organizationId, user.userId);
  }
}
