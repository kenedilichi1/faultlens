import { Injectable, ForbiddenException } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProjectsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(organizationId: string, userId: string, name: string) {
    const membership = await this.prisma.membership.findFirst({
      where: {
        organizationId,
        userId,
      },
    });

    if (!membership) {
      throw new ForbiddenException('Not a member of this organization');
    }

    return this.prisma.project.create({
      data: {
        name,
        organizationId,
      },
    });
  }

  async findByOrganization(organizationId: string, userId: string) {
    const membership = await this.prisma.membership.findFirst({
      where: {
        organizationId,
        userId,
      },
    });

    if (!membership) {
      throw new ForbiddenException('Access denied');
    }

    return this.prisma.project.findMany({
      where: {
        organizationId,
      },

      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}
