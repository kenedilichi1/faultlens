import { ForbiddenException, Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class OrganizationsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(name: string, userId: string) {
    return this.prisma.organization.create({
      data: {
        name,

        ownerId: userId,

        memberships: {
          create: {
            userId,
            role: 'OWNER',
          },
        },
      },

      include: {
        memberships: true,
      },
    });
  }

  async verifyMembership(organizationId: string, userId: string) {
    const membership = await this.prisma.membership.findFirst({
      where: {
        organizationId,
        userId,
      },
    });

    if (!membership) {
      throw new ForbiddenException('Access denied');
    }

    return membership;
  }
}
