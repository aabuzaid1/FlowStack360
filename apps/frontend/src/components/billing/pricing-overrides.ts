import {
  PricingInnerInterface,
  PricingInterface,
} from '@gitroom/nestjs-libraries/database/prisma/subscriptions/pricing';

export type AdminPricingRow = {
  tier: string;
  monthPrice: number;
  yearPrice: number;
  totalChannels: number;
  features?: PricingInnerInterface;
};

export const mergeAdminPricing = (
  basePricing: PricingInterface,
  rows?: AdminPricingRow[]
): PricingInterface => {
  const next = Object.fromEntries(
    Object.entries(basePricing).map(([tier, value]) => [
      tier,
      {
        ...value,
      },
    ])
  ) as PricingInterface;

  if (!Array.isArray(rows)) {
    return next;
  }

  for (const row of rows) {
    if (!next[row.tier]) {
      continue;
    }

    next[row.tier] = {
      ...next[row.tier],
      ...(row.features || {}),
      current: row.tier,
      month_price: Number(row.monthPrice) || 0,
      year_price: Number(row.yearPrice) || 0,
      channel: Number(row.totalChannels) || 0,
    };
  }

  return next;
};
