import { Injectable } from '@nestjs/common';
import {
  DiscountType,
  Period,
  Prisma,
  SubscriptionTier,
} from '@prisma/client';
import { PrismaRepository } from '@gitroom/nestjs-libraries/database/prisma/prisma.service';

export interface AdminUserFilters {
  page?: number;
  limit?: number;
  search?: string;
  tier?: string;
  admin?: string;
}

export interface AdminErrorFilters {
  page?: number;
  limit?: number;
  search?: string;
  platform?: string;
}

export interface AdminReviewFilters {
  page?: number;
  limit?: number;
  rating?: number;
}

@Injectable()
export class AdminRepository {
  constructor(
    private readonly _user: PrismaRepository<'user'>,
    private readonly _organization: PrismaRepository<'organization'>,
    private readonly _userOrganization: PrismaRepository<'userOrganization'>,
    private readonly _subscription: PrismaRepository<'subscription'>,
    private readonly _integration: PrismaRepository<'integration'>,
    private readonly _post: PrismaRepository<'post'>,
    private readonly _autoPost: PrismaRepository<'autoPost'>,
    private readonly _errors: PrismaRepository<'errors'>,
    private readonly _discount: PrismaRepository<'discount'>,
    private readonly _review: PrismaRepository<'review'>,
    private readonly _adminPricing: PrismaRepository<'adminPricing'>,
    private readonly _credits: PrismaRepository<'credits'>
  ) {}

  countUsers() {
    return this._user.model.user.count();
  }

  countOrganizations() {
    return this._organization.model.organization.count();
  }

  countActiveSubscriptions() {
    return this._subscription.model.subscription.count({
      where: {
        deletedAt: null,
      },
    });
  }

  countPosts() {
    return this._post.model.post.count({
      where: {
        deletedAt: null,
      },
    });
  }

  countPostsSince(from: Date) {
    return this._post.model.post.count({
      where: {
        deletedAt: null,
        createdAt: {
          gte: from,
        },
      },
    });
  }

  countErrors() {
    return this._errors.model.errors.count();
  }

  countErrorsSince(from: Date) {
    return this._errors.model.errors.count({
      where: {
        createdAt: {
          gte: from,
        },
      },
    });
  }

  countActiveAutoPosts() {
    return this._autoPost.model.autoPost.count({
      where: {
        deletedAt: null,
        active: true,
      },
    });
  }

  countActiveDiscounts(now = new Date()) {
    return this._discount.model.discount.count({
      where: {
        active: true,
        OR: [{ expiresAt: null }, { expiresAt: { gt: now } }],
      },
    });
  }

  getActiveSubscriptions() {
    return this._subscription.model.subscription.findMany({
      where: {
        deletedAt: null,
      },
      include: {
        organization: {
          include: {
            users: {
              where: {
                disabled: false,
              },
              take: 5,
              include: {
                user: {
                  select: {
                    id: true,
                    email: true,
                    name: true,
                    lastName: true,
                    isSuperAdmin: true,
                  },
                },
              },
            },
            _count: {
              select: {
                Integration: true,
                post: true,
                errors: true,
                users: true,
              },
            },
          },
        },
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });
  }

  groupSubscriptionsByTier() {
    return this._subscription.model.subscription.groupBy({
      by: ['subscriptionTier'],
      where: {
        deletedAt: null,
      },
      _count: {
        id: true,
      },
    });
  }

  groupPlatforms(limit = 20) {
    return this._integration.model.integration.groupBy({
      by: ['providerIdentifier'],
      where: {
        deletedAt: null,
      },
      _count: {
        id: true,
      },
      orderBy: {
        _count: {
          id: 'desc',
        },
      },
      take: limit,
    });
  }

  groupPostStates() {
    return this._post.model.post.groupBy({
      by: ['state'],
      where: {
        deletedAt: null,
      },
      _count: {
        id: true,
      },
    });
  }

  groupAutoPostStatus() {
    return this._autoPost.model.autoPost.groupBy({
      by: ['active'],
      where: {
        deletedAt: null,
      },
      _count: {
        id: true,
      },
    });
  }

  getUsersCreatedSince(from: Date) {
    return this._user.model.user.findMany({
      where: {
        createdAt: {
          gte: from,
        },
      },
      select: {
        id: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });
  }

  getPostsCreatedSince(from: Date) {
    return this._post.model.post.findMany({
      where: {
        deletedAt: null,
        createdAt: {
          gte: from,
        },
      },
      select: {
        id: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });
  }

  getErrorsCreatedSince(from: Date) {
    return this._errors.model.errors.findMany({
      where: {
        createdAt: {
          gte: from,
        },
      },
      select: {
        id: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });
  }

  groupCreditsSince(from: Date) {
    return this._credits.model.credits.groupBy({
      by: ['type'],
      where: {
        createdAt: {
          gte: from,
        },
      },
      _sum: {
        credits: true,
      },
      _count: {
        id: true,
      },
    });
  }

  async listUsers(filters: AdminUserFilters) {
    const page = Math.max(Number(filters.page) || 1, 1);
    const limit = Math.min(Math.max(Number(filters.limit) || 25, 5), 100);
    const where = this.buildUserWhere(filters);

    const [items, total] = await Promise.all([
      this._user.model.user.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          organizations: {
            include: {
              organization: {
                include: {
                  subscription: true,
                  _count: {
                    select: {
                      Integration: true,
                      post: true,
                      errors: true,
                    },
                  },
                },
              },
            },
          },
        },
      }),
      this._user.model.user.count({ where }),
    ]);

    return {
      items,
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    };
  }

  getUser(id: string) {
    return this._user.model.user.findUnique({
      where: {
        id,
      },
      include: {
        organizations: {
          include: {
            organization: {
              include: {
                subscription: true,
                reviews: {
                  take: 5,
                  orderBy: {
                    createdAt: 'desc',
                  },
                },
                _count: {
                  select: {
                    Integration: true,
                    post: true,
                    errors: true,
                    autoPost: true,
                    users: true,
                  },
                },
              },
            },
          },
        },
        _count: {
          select: {
            comments: true,
            reviews: true,
          },
        },
      },
    });
  }

  getUserByEmail(email: string) {
    return this._user.model.user.findFirst({
      where: {
        email,
      },
    });
  }

  getPrimaryOrganizationForUser(userId: string, organizationId?: string) {
    return this._userOrganization.model.userOrganization.findFirst({
      where: {
        userId,
        disabled: false,
        ...(organizationId ? { organizationId } : {}),
      },
      include: {
        organization: {
          include: {
            subscription: true,
          },
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    });
  }

  updateUserAdmin(id: string, isSuperAdmin: boolean) {
    return this._user.model.user.update({
      where: {
        id,
      },
      data: {
        isSuperAdmin,
      },
    });
  }

  upsertSubscription(
    organizationId: string,
    tier: SubscriptionTier,
    period: Period,
    totalChannels: number
  ) {
    return this._subscription.model.subscription.upsert({
      where: {
        organizationId,
      },
      update: {
        subscriptionTier: tier,
        period,
        totalChannels,
        deletedAt: null,
        isLifetime: false,
      },
      create: {
        organizationId,
        subscriptionTier: tier,
        period,
        totalChannels,
        identifier: `admin-${organizationId}-${Date.now()}`,
        isLifetime: false,
      },
    });
  }

  deleteSubscription(organizationId: string) {
    return this._subscription.model.subscription.updateMany({
      where: {
        organizationId,
        deletedAt: null,
      },
      data: {
        deletedAt: new Date(),
      },
    });
  }

  clearOrganizationTrial(organizationId: string) {
    return this._organization.model.organization.update({
      where: {
        id: organizationId,
      },
      data: {
        allowTrial: false,
        isTrailing: false,
      },
    });
  }

  getPricingOverrides() {
    return this._adminPricing.model.adminPricing.findMany({
      orderBy: {
        tier: 'asc',
      },
    });
  }

  upsertPricing(data: {
    tier: SubscriptionTier;
    monthPrice: number;
    yearPrice: number;
    totalChannels?: number | null;
    features?: string | null;
  }) {
    return this._adminPricing.model.adminPricing.upsert({
      where: {
        tier: data.tier,
      },
      update: {
        monthPrice: data.monthPrice,
        yearPrice: data.yearPrice,
        totalChannels: data.totalChannels,
        features: data.features,
      },
      create: {
        tier: data.tier,
        monthPrice: data.monthPrice,
        yearPrice: data.yearPrice,
        totalChannels: data.totalChannels,
        features: data.features,
      },
    });
  }

  getDiscounts() {
    return this._discount.model.discount.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  getDiscount(id: string) {
    return this._discount.model.discount.findUnique({
      where: {
        id,
      },
    });
  }

  createDiscount(data: {
    code: string;
    type: DiscountType;
    value: number;
    maxUses?: number | null;
    expiresAt?: Date | null;
    active?: boolean;
  }) {
    return this._discount.model.discount.create({
      data,
    });
  }

  updateDiscount(
    id: string,
    data: Partial<{
      code: string;
      type: DiscountType;
      value: number;
      maxUses: number | null;
      expiresAt: Date | null;
      active: boolean;
    }>
  ) {
    return this._discount.model.discount.update({
      where: {
        id,
      },
      data,
    });
  }

  deleteDiscount(id: string) {
    return this._discount.model.discount.delete({
      where: {
        id,
      },
    });
  }

  async listErrors(filters: AdminErrorFilters) {
    const page = Math.max(Number(filters.page) || 1, 1);
    const limit = Math.min(Math.max(Number(filters.limit) || 25, 5), 100);
    const where: Prisma.ErrorsWhereInput = {
      ...(filters.platform ? { platform: filters.platform } : {}),
      ...(filters.search
        ? {
            OR: [
              {
                message: {
                  contains: filters.search,
                  mode: 'insensitive',
                },
              },
              {
                platform: {
                  contains: filters.search,
                  mode: 'insensitive',
                },
              },
              {
                organization: {
                  name: {
                    contains: filters.search,
                    mode: 'insensitive',
                  },
                },
              },
            ],
          }
        : {}),
    };

    const [items, total, grouped] = await Promise.all([
      this._errors.model.errors.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        include: {
          organization: {
            select: {
              id: true,
              name: true,
            },
          },
          post: {
            select: {
              id: true,
              state: true,
              publishDate: true,
              integration: {
                select: {
                  id: true,
                  name: true,
                  providerIdentifier: true,
                },
              },
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
      this._errors.model.errors.count({ where }),
      this._errors.model.errors.groupBy({
        by: ['organizationId', 'platform'],
        where,
        _count: {
          id: true,
        },
        orderBy: {
          _count: {
            id: 'desc',
          },
        },
        take: 50,
      }),
    ]);

    return {
      items,
      total,
      grouped,
      page,
      limit,
      pages: Math.ceil(total / limit),
    };
  }

  recentErrors(limit = 8) {
    return this._errors.model.errors.findMany({
      take: limit,
      include: {
        organization: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async listReviews(filters: AdminReviewFilters) {
    const page = Math.max(Number(filters.page) || 1, 1);
    const limit = Math.min(Math.max(Number(filters.limit) || 25, 5), 100);
    const where: Prisma.ReviewWhereInput = {
      ...(filters.rating ? { rating: filters.rating } : {}),
    };

    const [items, total, aggregate] = await Promise.all([
      this._review.model.review.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        include: {
          user: {
            select: {
              id: true,
              email: true,
              name: true,
              lastName: true,
            },
          },
          organization: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
      this._review.model.review.count({ where }),
      this._review.model.review.aggregate({
        _avg: {
          rating: true,
        },
        _count: {
          id: true,
        },
      }),
    ]);

    return {
      items,
      total,
      aggregate,
      page,
      limit,
      pages: Math.ceil(total / limit),
    };
  }

  recentReviews(limit = 8) {
    return this._review.model.review.findMany({
      take: limit,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            lastName: true,
          },
        },
        organization: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  reviewAggregate() {
    return this._review.model.review.aggregate({
      _avg: {
        rating: true,
      },
      _count: {
        id: true,
      },
    });
  }

  getBroadcastUsers(params: { tier?: string; email?: string }) {
    const tier = params.tier;
    return this._user.model.user.findMany({
      where: {
        activated: true,
        email: {
          contains: '@',
        },
        ...(params.email
          ? {
              email: {
                equals: params.email,
                mode: 'insensitive',
              },
            }
          : {}),
        ...(tier && tier !== 'ALL'
          ? {
              organizations: {
                some: {
                  organization: {
                    ...(tier === 'FREE'
                      ? {
                          subscription: {
                            is: null,
                          },
                        }
                      : {
                          subscription: {
                            is: {
                              subscriptionTier: tier as SubscriptionTier,
                              deletedAt: null,
                            },
                          },
                        }),
                  },
                },
              },
            }
          : {}),
      },
      select: {
        id: true,
        email: true,
        name: true,
        lastName: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  private buildUserWhere(filters: AdminUserFilters): Prisma.UserWhereInput {
    const and: Prisma.UserWhereInput[] = [];

    if (filters.search) {
      and.push({
        OR: [
          {
            email: {
              contains: filters.search,
              mode: 'insensitive',
            },
          },
          {
            name: {
              contains: filters.search,
              mode: 'insensitive',
            },
          },
          {
            lastName: {
              contains: filters.search,
              mode: 'insensitive',
            },
          },
        ],
      });
    }

    if (filters.admin === 'true' || filters.admin === 'false') {
      and.push({
        isSuperAdmin: filters.admin === 'true',
      });
    }

    if (filters.tier && filters.tier !== 'ALL') {
      and.push({
        organizations: {
          some: {
            organization: {
              ...(filters.tier === 'FREE'
                ? {
                    subscription: {
                      is: null,
                    },
                  }
                : {
                    subscription: {
                      is: {
                        subscriptionTier: filters.tier as SubscriptionTier,
                        deletedAt: null,
                      },
                    },
                  }),
            },
          },
        },
      });
    }

    return and.length ? { AND: and } : {};
  }
}
