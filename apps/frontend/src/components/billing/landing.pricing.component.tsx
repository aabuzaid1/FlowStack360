'use client';

import React, { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import clsx from 'clsx';
import { pricing, PricingInterface } from '@gitroom/nestjs-libraries/database/prisma/subscriptions/pricing';
import { mergeAdminPricing, AdminPricingRow } from './pricing-overrides';

const CheckIcon = () => (
  <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="10" fill="white" />
    <path d="M8 12.5L10.5 15L16 9" stroke="#111827" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ProCheckIcon = () => (
  <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="10" fill="white" />
    <path d="M8 12.5L10.5 15L16 9" stroke="#7C3AED" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const LandingPricing = () => {
  const [dbPricing, setDbPricing] = useState<AdminPricingRow[] | undefined>(undefined);
  const [period, setPeriod] = useState<'MONTHLY' | 'YEARLY'>('MONTHLY');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPricing = async () => {
      try {
        const res = await fetch(`/api/public-pricing`);
        if (res.ok) {
          const data = await res.json();
          setDbPricing(data);
        }
      } catch (err) {
        console.error('Failed to load pricing', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPricing();
  }, []);

  const mergedPricing = useMemo(() => mergeAdminPricing(pricing, dbPricing), [dbPricing]);

  // Order of display: STANDARD, TEAM, PRO, ULTIMATE
  const planOrder = ['STANDARD', 'TEAM', 'PRO', 'ULTIMATE'];

  const getFeatures = (packName: string, p: any) => {
    if (p.custom_features && Array.isArray(p.custom_features) && p.custom_features.length > 0) {
      return p.custom_features;
    }

    const list = [];
    
    // Channels
    list.push(`${p.channel} channels`);
    
    // Posts per month
    list.push(p.posts_per_month > 10000 ? 'Unlimited posts per month' : `${p.posts_per_month} posts per month`);
    
    // Team members
    if (p.team_members) {
      list.push('Unlimited team members');
    }
    
    // Advanced Picture Editor (Assume available on all paid)
    list.push('Advanced Picture Editor');
    
    // AI Copilot
    if (p.ai) {
      list.push('AI copilot');
    }
    
    // Image Generation
    if (p.image_generator && p.image_generation_count > 0) {
      list.push(`${p.image_generation_count} AI images per month`);
    }
    
    // Video Generation
    if (p.generate_videos > 0) {
      list.push(`${p.generate_videos} AI videos per month`);
    }

    // Generic list of premium features based on tiers to match screenshot closely
    list.push('Custom Integrations');
    if (p.public_api) list.push('API');
    if (p.webhooks > 0) list.push('Webhooks');
    list.push('Post comments');
    list.push('Repeated posts');
    list.push('Post delays');
    list.push('Any channel');
    
    if (packName === 'TEAM' || packName === 'PRO' || packName === 'ULTIMATE') {
      list.push('Smart Agent');
      list.push('Cross posting');
      list.push('Internal Plugs');
      list.push('Global Plugs');
      list.push('Analytics');
      list.push('Customer groups');
      list.push('Calendar views');
      list.push('Dark / Light mode');
      if (p.autoPost) list.push('RSS auto-post');
      list.push('Posting sets');
      list.push('Signatures');
    }

    return list;
  };

  const planTitles: Record<string, string> = {
    STANDARD: 'Standard',
    TEAM: 'Team',
    PRO: 'Pro',
    ULTIMATE: 'Ultimate',
  };

  const planSubtitles: Record<string, string> = {
    STANDARD: 'Best for content creators',
    TEAM: 'Best for small brands',
    PRO: 'Best for large businesses',
    ULTIMATE: 'Best for agencies',
  };

  return (
    <section id="pricing" className="relative z-10 py-24 scroll-mt-24 font-sans text-white">
      {/* Background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/20 via-[#050507]/0 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight drop-shadow-md">
            Simple, transparent pricing
          </h2>
          <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-10">
            Choose the perfect plan for your needs. <br className="hidden md:block" />
            Start with a <span className="text-purple-400 font-semibold">14-day free trial</span> on any plan.
          </p>

          {/* Toggle Switch */}
          <div className="flex items-center justify-center gap-4">
            <span className={clsx("text-sm font-semibold transition-colors", period === 'MONTHLY' ? "text-white" : "text-gray-400")}>Monthly</span>
            <button 
              onClick={() => setPeriod(period === 'MONTHLY' ? 'YEARLY' : 'MONTHLY')}
              className="relative w-[60px] h-[32px] rounded-full bg-[#1a1a24] border border-white/10 p-1 flex items-center transition-colors hover:bg-[#252530]"
            >
              <div className={clsx(
                "w-[22px] h-[22px] bg-gradient-to-tr from-purple-600 to-blue-500 rounded-full shadow-md transform transition-transform duration-300",
                period === 'YEARLY' ? "translate-x-[28px]" : "translate-x-0"
              )} />
            </button>
            <span className={clsx("text-sm font-semibold flex items-center gap-2 transition-colors", period === 'YEARLY' ? "text-white" : "text-gray-400")}>
              Yearly
              <span className="px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 text-[10px] uppercase tracking-wider">Save 20%</span>
            </span>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-start">
            {planOrder.map((packName) => {
              const p = mergedPricing[packName];
              if (!p) return null;
              
              const isPro = packName === 'PRO';
              const price = period === 'YEARLY' ? p.year_price : p.month_price;
              const features = getFeatures(packName, p);

              return (
                <div 
                  key={packName}
                  className={clsx(
                    "relative flex flex-col rounded-[24px] p-8 transition-all duration-300 h-full",
                    isPro 
                      ? "bg-[#6d28d9] shadow-[0_0_40px_-10px_rgba(124,58,237,0.5)] transform lg:-translate-y-4" 
                      : "bg-[#111116] border border-white/5 hover:bg-[#1a1a24] hover:border-white/10"
                  )}
                >
                  {isPro && (
                    <div className="absolute -top-4 right-6 px-4 py-1 bg-white/20 backdrop-blur-md border border-white/30 rounded-full text-white text-xs font-bold uppercase tracking-wider shadow-lg">
                      Popular
                    </div>
                  )}

                  <div className="mb-8">
                    <h3 className="text-xl font-medium mb-4 text-gray-200">{planTitles[packName]}</h3>
                    <div className="flex items-baseline gap-2 mb-2">
                      <span className="text-5xl font-extrabold tracking-tight">${price}</span>
                      <span className={clsx("text-sm font-medium", isPro ? "text-purple-200" : "text-gray-500")}>/mo</span>
                    </div>
                    <p className={clsx("text-sm", isPro ? "text-purple-200" : "text-gray-500")}>
                      {planSubtitles[packName]}
                    </p>
                  </div>

                  <Link href="/auth" className="mt-auto mb-8">
                    <button className={clsx(
                      "w-full py-3.5 rounded-xl text-sm font-bold transition-all duration-300",
                      isPro 
                        ? "bg-white text-purple-900 hover:bg-gray-100 hover:shadow-lg" 
                        : "bg-white/5 text-white border border-white/10 hover:bg-white/10"
                    )}>
                      Start 14-day free trial
                    </button>
                  </Link>

                  <div className="flex flex-col gap-4">
                    {features.map((feature: string, i: number) => (
                      <div key={i} className="flex items-start gap-3">
                        {isPro ? <ProCheckIcon /> : <CheckIcon />}
                        <span className={clsx("text-sm leading-tight pt-0.5", isPro ? "text-white" : "text-gray-300")}>
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
