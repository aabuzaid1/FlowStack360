import { HttpException, Injectable } from '@nestjs/common';
import { DiscountType, Period, SubscriptionTier } from '@prisma/client';
import { AdminRepository } from '@gitroom/nestjs-libraries/database/prisma/admin/admin.repository';
import { pricing } from '@gitroom/nestjs-libraries/database/prisma/subscriptions/pricing';
import { EmailService } from '@gitroom/nestjs-libraries/services/email.service';
import { SubscriptionService } from '@gitroom/nestjs-libraries/database/prisma/subscriptions/subscription.service';

const PRIMARY_ADMIN_EMAIL = 'abdelrahmanabuzaid311@gmail.com';
const PAID_TIERS = ['STANDARD', 'PRO', 'TEAM', 'ULTIMATE'] as const;
const ALL_TIERS = ['FREE', ...PAID_TIERS] as const;

type PaidTier = (typeof PAID_TIERS)[number];
type AnyTier = (typeof ALL_TIERS)[number];

@Injectable()
export class AdminService {
  constructor(
    private readonly _adminRepository: AdminRepository,
    private readonly _emailService: EmailService,
    private readonly _subscriptionService: SubscriptionService
  ) {}

  async getDashboard() {
    const last30 = this.daysAgo(30);
    const [
      totalUsers,
      totalOrganizations,
      totalSubscriptions,
      totalPosts,
      totalErrors,
      recentErrorsCount,
      activeAutoPosts,
      activeDiscounts,
      subscriptions,
      subscriptionDistribution,
      platformDistribution,
      postStates,
      autoPostStatus,
      recentErrors,
      recentReviews,
      reviewAggregate,
      signups,
    ] = await Promise.all([
      this._adminRepository.countUsers(),
      this._adminRepository.countOrganizations(),
      this._adminRepository.countActiveSubscriptions(),
      this._adminRepository.countPosts(),
      this._adminRepository.countErrors(),
      this._adminRepository.countErrorsSince(last30),
      this._adminRepository.countActiveAutoPosts(),
      this._adminRepository.countActiveDiscounts(),
      this._adminRepository.getActiveSubscriptions(),
      this._adminRepository.groupSubscriptionsByTier(),
      this._adminRepository.groupPlatforms(12),
      this._adminRepository.groupPostStates(),
      this._adminRepository.groupAutoPostStatus(),
      this._adminRepository.recentErrors(8),
      this._adminRepository.recentReviews(8),
      this._adminRepository.reviewAggregate(),
      this._adminRepository.getUsersCreatedSince(last30),
    ]);

    const pricingLookup = await this.getPricingLookup();
    const monthlyRecurringRevenue = this.roundCurrency(
      subscriptions.reduce((total, subscription) => {
        const plan = pricingLookup[subscription.subscriptionTier];
        if (!plan) {
          return total;
        }
        return (
          total +
          (subscription.period === 'YEARLY'
            ? plan.yearPrice / 12
            : plan.monthPrice)
        );
      }, 0)
    );

    return {
      metrics: {
        totalUsers,
        totalOrganizations,
        activeSubscriptions: totalSubscriptions,
        totalPosts,
        activeAutomations: activeAutoPosts,
        totalErrors,
        recentErrors: recentErrorsCount,
        activeDiscounts,
        averageRating: this.roundRating(reviewAggregate._avg.rating || 0),
        totalReviews: reviewAggregate._count.id,
      },
      revenue: {
        monthlyRecurringRevenue,
        annualizedRevenue: this.roundCurrency(monthlyRecurringRevenue * 12),
      },
      subscriptionDistribution: subscriptionDistribution.map((item) => ({
        tier: item.subscriptionTier,
        count: item._count.id,
      })),
      platformDistribution: platformDistribution.map((item) => ({
        platform: item.providerIdentifier || 'unknown',
        count: item._count.id,
      })),
      postStates: postStates.map((item) => ({
        state: item.state,
        count: item._count.id,
      })),
      autoPostStatus: autoPostStatus.map((item) => ({
        active: item.active,
        count: item._count.id,
      })),
      signupSeries: this.buildDailySeries(signups, 30),
      recentErrors,
      recentReviews,
      primaryAdminEmail: PRIMARY_ADMIN_EMAIL,
    };
  }

  async listUsers(query: {
    page?: string;
    limit?: string;
    search?: string;
    tier?: string;
    admin?: string;
  }) {
    const users = await this._adminRepository.listUsers({
      page: Number(query.page) || 1,
      limit: Number(query.limit) || 25,
      search: query.search?.trim(),
      tier: query.tier,
      admin: query.admin,
    });

    return {
      ...users,
      items: users.items.map((user) => ({
        ...user,
        primaryOrganization: user.organizations[0]?.organization || null,
        tier: this.getUserTier(user.organizations),
      })),
    };
  }

  async getUser(id: string) {
    const user = await this._adminRepository.getUser(id);
    if (!user) {
      throw new HttpException('User not found', 404);
    }

    return {
      ...user,
      tier: this.getUserTier(user.organizations),
    };
  }

  async changeUserSubscription(
    id: string,
    body: {
      organizationId?: string;
      tier?: string;
      period?: string;
      totalChannels?: number;
    }
  ) {
    const tier = this.normalizeTier(body.tier, true);
    const userOrg = await this._adminRepository.getPrimaryOrganizationForUser(
      id,
      body.organizationId
    );

    if (!userOrg) {
      throw new HttpException('User organization not found', 404);
    }

    const plan = await this.getPricingForTier(tier);
    const totalChannels = Number(body.totalChannels) || plan.totalChannels || 0;

    await this._subscriptionService.modifySubscriptionByOrg(
      userOrg.organizationId,
      totalChannels,
      tier
    );

    if (tier === 'FREE') {
      await this._adminRepository.deleteSubscription(userOrg.organizationId);
      return {
        updated: true,
        tier,
        organizationId: userOrg.organizationId,
      };
    }

    const period = this.normalizePeriod(body.period);
    await this._adminRepository.upsertSubscription(
      userOrg.organizationId,
      tier,
      period,
      totalChannels
    );
    await this._adminRepository.clearOrganizationTrial(userOrg.organizationId);

    return {
      updated: true,
      tier,
      period,
      totalChannels,
      organizationId: userOrg.organizationId,
    };
  }

  async toggleAdmin(id: string, body: { isSuperAdmin?: boolean }) {
    const user = await this._adminRepository.getUser(id);
    if (!user) {
      throw new HttpException('User not found', 404);
    }

    if (
      user.email.toLowerCase() === PRIMARY_ADMIN_EMAIL &&
      user.isSuperAdmin &&
      body.isSuperAdmin === false
    ) {
      throw new HttpException('Primary admin cannot be demoted', 400);
    }

    const isSuperAdmin =
      typeof body.isSuperAdmin === 'boolean'
        ? body.isSuperAdmin
        : !user.isSuperAdmin;

    return this._adminRepository.updateUserAdmin(id, isSuperAdmin);
  }

  async sendUserEmail(
    id: string,
    body: { subject?: string; html?: string; replyTo?: string }
  ) {
    const user = await this._adminRepository.getUser(id);
    if (!user) {
      throw new HttpException('User not found', 404);
    }

    await this.sendEmailToUsers(
      [{ email: user.email }],
      body.subject,
      body.html,
      body.replyTo
    );

    return {
      sent: 1,
    };
  }

  async broadcastEmail(body: {
    audience?: 'ALL' | 'TIER' | 'USER';
    tier?: string;
    email?: string;
    subject?: string;
    html?: string;
    replyTo?: string;
  }) {
    const audience = body.audience || 'ALL';
    const recipients = await this._adminRepository.getBroadcastUsers({
      tier: audience === 'TIER' ? body.tier || 'ALL' : undefined,
      email: audience === 'USER' ? body.email : undefined,
    });

    const sent = await this.sendEmailToUsers(
      recipients,
      body.subject,
      body.html,
      body.replyTo
    );

    return {
      sent,
      recipients: recipients.length,
    };
  }

  async getSubscriptions() {
    const [subscriptions, pricingLookup] = await Promise.all([
      this._adminRepository.getActiveSubscriptions(),
      this.getPricingLookup(),
    ]);

    return subscriptions.map((subscription) => {
      const plan = pricingLookup[subscription.subscriptionTier];
      const monthlyRevenue =
        subscription.period === 'YEARLY'
          ? (plan?.yearPrice || 0) / 12
          : plan?.monthPrice || 0;

      return {
        ...subscription,
        monthlyRevenue: this.roundCurrency(monthlyRevenue),
        yearlyRevenue: this.roundCurrency(monthlyRevenue * 12),
      };
    });
  }

  async getPricing() {
    const overrides = await this._adminRepository.getPricingOverrides();

    return ALL_TIERS.map((tier) => {
      const plan = pricing[tier];
      const override =
        tier === 'FREE'
          ? undefined
          : overrides.find((item) => item.tier === tier);

      return {
        tier,
        monthPrice: override?.monthPrice ?? plan.month_price,
        yearPrice: override?.yearPrice ?? plan.year_price,
        totalChannels: override?.totalChannels ?? plan.channel ?? 0,
        overrideId: override?.id || null,
        features: override?.features ? { ...plan, ...JSON.parse(override.features) } : plan,
      };
    });
  }

  async getPricingForTier(tier: string) {
    const normalized = this.normalizeTier(tier, true);
    const rows = await this.getPricing();
    const row = rows.find((item) => item.tier === normalized);

    if (!row) {
      throw new HttpException('Invalid subscription tier', 400);
    }

    return row;
  }

  async updatePricing(body: {
    tier?: string;
    monthPrice?: number;
    yearPrice?: number;
    totalChannels?: number | null;
    features?: any;
  }) {
    const tier = this.normalizeTier(body.tier, false);
    const monthPrice = Number(body.monthPrice);
    const yearPrice = Number(body.yearPrice);

    if (monthPrice < 0 || yearPrice < 0) {
      throw new HttpException('Prices must be zero or greater', 400);
    }

    return this._adminRepository.upsertPricing({
      tier,
      monthPrice,
      yearPrice,
      totalChannels:
        typeof body.totalChannels === 'number'
          ? Number(body.totalChannels)
          : null,
      features: body.features ? JSON.stringify(body.features) : null,
    });
  }

  getDiscounts() {
    return this._adminRepository.getDiscounts();
  }

  createDiscount(body: {
    code?: string;
    type?: string;
    value?: number;
    maxUses?: number | null;
    expiresAt?: string | null;
    active?: boolean;
  }) {
    const data = this.normalizeDiscount(body, true) as {
      code: string;
      type: DiscountType;
      value: number;
      maxUses?: number | null;
      expiresAt?: Date | null;
      active?: boolean;
    };
    return this._adminRepository.createDiscount(data);
  }

  async updateDiscount(
    id: string,
    body: {
      code?: string;
      type?: string;
      value?: number;
      maxUses?: number | null;
      expiresAt?: string | null;
      active?: boolean;
    }
  ) {
    await this.assertDiscount(id);
    const data = this.normalizeDiscount(body, false);
    return this._adminRepository.updateDiscount(id, data);
  }

  async deleteDiscount(id: string) {
    await this.assertDiscount(id);
    await this._adminRepository.deleteDiscount(id);
    return {
      deleted: true,
    };
  }

  getErrors(query: {
    page?: string;
    limit?: string;
    search?: string;
    platform?: string;
  }) {
    return this._adminRepository.listErrors({
      page: Number(query.page) || 1,
      limit: Number(query.limit) || 25,
      search: query.search?.trim(),
      platform: query.platform?.trim(),
    });
  }

  getReviews(query: { page?: string; limit?: string; rating?: string }) {
    return this._adminRepository.listReviews({
      page: Number(query.page) || 1,
      limit: Number(query.limit) || 25,
      rating: Number(query.rating) || undefined,
    });
  }

  async getStats(query: { days?: string }) {
    const days = Math.min(Math.max(Number(query.days) || 30, 7), 365);
    const from = this.daysAgo(days);
    const [
      signups,
      posts,
      errors,
      platforms,
      subscriptionDistribution,
      autoPostStatus,
      credits,
      totalPosts,
      recentErrors,
    ] = await Promise.all([
      this._adminRepository.getUsersCreatedSince(from),
      this._adminRepository.getPostsCreatedSince(from),
      this._adminRepository.getErrorsCreatedSince(from),
      this._adminRepository.groupPlatforms(30),
      this._adminRepository.groupSubscriptionsByTier(),
      this._adminRepository.groupAutoPostStatus(),
      this._adminRepository.groupCreditsSince(from),
      this._adminRepository.countPostsSince(from),
      this._adminRepository.countErrorsSince(from),
    ]);

    return {
      days,
      signupSeries: this.buildDailySeries(signups, days),
      postSeries: this.buildDailySeries(posts, days),
      errorSeries: this.buildDailySeries(errors, days),
      platformDistribution: platforms.map((item) => ({
        platform: item.providerIdentifier || 'unknown',
        count: item._count.id,
      })),
      subscriptionDistribution: subscriptionDistribution.map((item) => ({
        tier: item.subscriptionTier,
        count: item._count.id,
      })),
      automationUsage: autoPostStatus.map((item) => ({
        active: item.active,
        count: item._count.id,
      })),
      credits: credits.map((item) => ({
        type: item.type,
        credits: item._sum.credits || 0,
        events: item._count.id,
      })),
      errorRate:
        totalPosts > 0 ? this.roundRating((recentErrors / totalPosts) * 100) : 0,
    };
  }

  private async getPricingLookup() {
    const rows = await this.getPricing();
    return rows.reduce((all, row) => {
      if (row.tier !== 'FREE') {
        all[row.tier] = row;
      }
      return all;
    }, {} as Record<PaidTier, Awaited<ReturnType<AdminService['getPricing']>>[number]>);
  }

  private async sendEmailToUsers(
    recipients: Array<{ email: string }>,
    subject?: string,
    html?: string,
    replyTo?: string
  ) {
    if (!subject?.trim() || !html?.trim()) {
      throw new HttpException('Subject and email body are required', 400);
    }

    const uniqueRecipients = [
      ...new Set(
        recipients
          .map((recipient) => recipient.email)
          .filter((email) => email && email.includes('@'))
      ),
    ];

    const formattedHtml = this.formatEmailHtml(html);
    let sent = 0;

    for (let index = 0; index < uniqueRecipients.length; index += 10) {
      const batch = uniqueRecipients.slice(index, index + 10);
      await Promise.all(
        batch.map(async (email) => {
          await this._emailService.sendEmailSync(
            email,
            subject,
            formattedHtml,
            replyTo
          );
          sent++;
        })
      );
    }

    return sent;
  }

  private normalizeTier<T extends boolean>(
    tier: string | undefined,
    allowFree: T
  ): T extends true ? AnyTier : PaidTier {
    const normalized = String(tier || '').toUpperCase();
    const allowed = allowFree ? ALL_TIERS : PAID_TIERS;

    if (!allowed.includes(normalized as any)) {
      throw new HttpException('Invalid subscription tier', 400);
    }

    return normalized as any;
  }

  private normalizePeriod(period?: string): Period {
    const normalized = String(period || 'MONTHLY').toUpperCase();
    if (normalized !== 'MONTHLY' && normalized !== 'YEARLY') {
      throw new HttpException('Invalid billing period', 400);
    }

    return normalized as Period;
  }

  private normalizeDiscount(
    body: {
      code?: string;
      type?: string;
      value?: number;
      maxUses?: number | null;
      expiresAt?: string | null;
      active?: boolean;
    },
    requireAll: boolean
  ) {
    const data: Partial<{
      code: string;
      type: DiscountType;
      value: number;
      maxUses: number | null;
      expiresAt: Date | null;
      active: boolean;
    }> = {};

    if (body.code !== undefined) {
      data.code = body.code.trim().toUpperCase();
    }

    if (body.type !== undefined) {
      const type = String(body.type).toUpperCase();
      if (type !== 'PERCENTAGE' && type !== 'FIXED') {
        throw new HttpException('Invalid discount type', 400);
      }
      data.type = type as DiscountType;
    }

    if (body.value !== undefined) {
      data.value = Number(body.value);
    }

    if (body.maxUses !== undefined) {
      data.maxUses = body.maxUses === null ? null : Number(body.maxUses);
    }

    if (body.expiresAt !== undefined) {
      data.expiresAt = body.expiresAt ? new Date(body.expiresAt) : null;
    }

    if (body.active !== undefined) {
      data.active = !!body.active;
    }

    if (requireAll && (!data.code || !data.type || data.value === undefined)) {
      throw new HttpException('Code, type and value are required', 400);
    }

    if (data.value !== undefined && data.value <= 0) {
      throw new HttpException('Discount value must be greater than zero', 400);
    }

    if (data.type === 'PERCENTAGE' && data.value !== undefined && data.value > 100) {
      throw new HttpException('Percentage discounts cannot exceed 100', 400);
    }

    if (data.maxUses !== undefined && data.maxUses !== null && data.maxUses < 1) {
      throw new HttpException('Max uses must be greater than zero', 400);
    }

    return data;
  }

  private async assertDiscount(id: string) {
    const discount = await this._adminRepository.getDiscount(id);
    if (!discount) {
      throw new HttpException('Discount not found', 404);
    }
  }

  private getUserTier(
    organizations: Array<{ organization: { subscription?: { subscriptionTier: string; deletedAt: Date | null } | null } }>
  ) {
    return (
      organizations.find(
        (item) =>
          item.organization.subscription &&
          item.organization.subscription.deletedAt === null
      )?.organization.subscription?.subscriptionTier || 'FREE'
    );
  }

  private buildDailySeries(
    rows: Array<{ createdAt: Date | string }>,
    days: number
  ) {
    const today = new Date();
    const series = Array.from({ length: days }).map((_, index) => {
      const date = new Date(today);
      date.setDate(today.getDate() - (days - index - 1));
      const key = date.toISOString().slice(0, 10);
      return {
        date: key,
        count: 0,
      };
    });
    const byDate = new Map(series.map((item) => [item.date, item]));

    for (const row of rows) {
      const key = new Date(row.createdAt).toISOString().slice(0, 10);
      const item = byDate.get(key);
      if (item) {
        item.count++;
      }
    }

    return series;
  }

  private daysAgo(days: number) {
    const date = new Date();
    date.setDate(date.getDate() - days);
    return date;
  }

  private roundCurrency(value: number) {
    return Math.round(value * 100) / 100;
  }

  private roundRating(value: number) {
    return Math.round(value * 10) / 10;
  }

  private formatEmailHtml(html: string) {
    const trimmed = html.trim();
    if (trimmed.includes('<')) {
      return trimmed;
    }

    return trimmed
      .split('\n')
      .map((line) => `<p>${line || '&nbsp;'}</p>`)
      .join('');
  }
}
