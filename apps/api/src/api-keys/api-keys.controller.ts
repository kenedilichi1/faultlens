import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

import { CurrentUser } from '../auth/decorators/current-user.decorator';

import { type AuthUser } from '../auth/types/auth-user.type';

import { ApiKeysService } from './api-keys.service';

import { CreateApiKeyDto } from './dto/create-api-key.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('API Keys')
@Controller('projects/:projectId/api-keys')
@UseGuards(JwtAuthGuard)
export class ApiKeysController {
  constructor(private readonly apiKeysService: ApiKeysService) {}

  @Post()
  create(
    @Param('projectId')
    projectId: string,

    @Body()
    dto: CreateApiKeyDto,

    @CurrentUser()
    user: AuthUser,
  ) {
    return this.apiKeysService.create(projectId, user.userId, dto.name);
  }
}
