import { ForbiddenException, Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

import { randomBytes } from 'node:crypto';

@Injectable()
export class ApiKeysService {
  constructor(private readonly prisma: PrismaService) {}

  async create(projectId: string, userId: string, name: string) {
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },

      include: {
        organization: {
          include: {
            memberships: true,
          },
        },
      },
    });

    if (!project) {
      throw new ForbiddenException('Project not found');
    }

    const membership = project.organization.memberships.find(
      (m) => m.userId === userId,
    );

    if (!membership) {
      throw new ForbiddenException('Access denied');
    }

    const generatedKey = `flsk_${randomBytes(24).toString('hex')}`;

    return this.prisma.apiKey.create({
      data: {
        name,
        key: generatedKey,
        projectId,
      },
    });
  }

  async validate(key: string) {
    return this.prisma.apiKey.findUnique({
      where: { key },

      include: {
        project: true,
      },
    });
  }
}
