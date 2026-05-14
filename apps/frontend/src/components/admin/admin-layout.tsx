'use client';

import clsx from 'clsx';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';
import { useUser } from '@gitroom/frontend/components/layout/user.context';

const AdminIcon = ({ path }: { path: string }) => {
  const common = {
    width: 18,
    height: 18,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.8,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  };

  if (path.includes('users')) {
    return (
      <svg {...common}>
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    );
  }

  if (path.includes('subscriptions')) {
    return (
      <svg {...common}>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="M3 10h18" />
        <path d="M7 15h4" />
      </svg>
    );
  }

  if (path.includes('discounts')) {
    return (
      <svg {...common}>
        <path d="M20.59 13.41 13.42 20.58a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82Z" />
        <path d="M7 7h.01" />
      </svg>
    );
  }

  if (path.includes('emails')) {
    return (
      <svg {...common}>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="m3 7 9 6 9-6" />
      </svg>
    );
  }

  if (path.includes('issues')) {
    return (
      <svg {...common}>
        <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" />
        <path d="M12 9v4" />
        <path d="M12 17h.01" />
      </svg>
    );
  }

  if (path.includes('reviews')) {
    return (
      <svg {...common}>
        <path d="m12 3 2.8 5.67 6.26.91-4.53 4.42 1.07 6.24L12 17.3l-5.6 2.94L7.47 14 2.94 9.58l6.26-.91L12 3Z" />
      </svg>
    );
  }

  if (path.includes('statistics')) {
    return (
      <svg {...common}>
        <path d="M3 3v18h18" />
        <path d="M8 17V9" />
        <path d="M13 17V5" />
        <path d="M18 17v-4" />
      </svg>
    );
  }

  return (
    <svg {...common}>
      <path d="M3 13h8V3H3v10Z" />
      <path d="M13 21h8V11h-8v10Z" />
      <path d="M13 9h8V3h-8v6Z" />
      <path d="M3 21h8v-6H3v6Z" />
    </svg>
  );
};

const adminNav = [
  { label: 'Overview', path: '/admin' },
  { label: 'Users', path: '/admin/users' },
  { label: 'Subscriptions', path: '/admin/subscriptions' },
  { label: 'Discounts', path: '/admin/discounts' },
  { label: 'Emails', path: '/admin/emails' },
  { label: 'Issues', path: '/admin/issues' },
  { label: 'Reviews', path: '/admin/reviews' },
  { label: 'Statistics', path: '/admin/statistics' },
];

export const AdminLayoutClient = ({ children }: { children: ReactNode }) => {
  const user = useUser();
  const pathname = usePathname();

  if (!user) {
    return null;
  }

  if (!user.isSuperAdmin) {
    return (
      <div className="flex w-full items-center justify-center bg-slate-50 dark:bg-[#07080d] p-8 text-slate-900 dark:text-white">
        <div className="max-w-[520px] rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-white/[0.06] p-8 text-center shadow-lg dark:shadow-[0_24px_80px_rgba(0,0,0,0.3)] backdrop-blur-xl">
          <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-lg border border-amber-200 dark:border-amber-300/30 bg-amber-50 dark:bg-amber-300/10 text-amber-700 dark:text-amber-200">
            <AdminIcon path="/admin/issues" />
          </div>
          <h2 className="mb-3 text-[24px] font-[700]">Admin access required</h2>
          <p className="text-[14px] leading-6 text-slate-500 dark:text-white/60">
            This area is restricted to super admins.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full bg-slate-50 dark:bg-[#07080d] text-slate-900 dark:text-white">
      <div className="hidden w-[244px] shrink-0 border-e border-slate-200 dark:border-white/10 bg-white/95 dark:bg-[#0b0d12]/95 p-4 backdrop-blur-xl lg:block">
        <div className="mb-5 rounded-lg border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-white/[0.04] p-4">
          <div className="text-[11px] uppercase text-slate-500 dark:text-white/40">Stack360</div>
          <div className="mt-1 text-[18px] font-[700]">Admin Control</div>
          <div className="mt-2 h-[3px] w-16 rounded-full bg-gradient-to-r from-cyan-400 via-violet-500 to-emerald-400 dark:from-cyan-300 dark:via-violet-400 dark:to-emerald-300" />
        </div>
        <nav className="flex flex-col gap-2">
          {adminNav.map((item) => {
            const active =
              item.path === '/admin'
                ? pathname === '/admin'
                : pathname.indexOf(item.path) === 0;
            return (
              <Link
                href={item.path}
                key={item.path}
                className={clsx(
                  'flex min-h-[42px] items-center gap-3 rounded-lg border px-3 text-[13px] font-[600] transition-colors',
                  active
                    ? 'border-cyan-200 dark:border-cyan-300/30 bg-cyan-50 dark:bg-cyan-300/10 text-cyan-700 dark:text-cyan-100'
                    : 'border-transparent text-slate-500 dark:text-white/58 hover:border-slate-200 dark:hover:border-white/10 hover:bg-slate-100 dark:hover:bg-white/[0.05] hover:text-slate-900 dark:hover:text-white'
                )}
              >
                <AdminIcon path={item.path} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex gap-2 overflow-x-auto border-b border-slate-200 dark:border-white/10 bg-white/80 dark:bg-[#0b0d12]/80 p-3 lg:hidden">
          {adminNav.map((item) => {
            const active =
              item.path === '/admin'
                ? pathname === '/admin'
                : pathname.indexOf(item.path) === 0;
            return (
              <Link
                href={item.path}
                key={item.path}
                className={clsx(
                  'flex shrink-0 items-center gap-2 rounded-lg border px-3 py-2 text-[12px] font-[700]',
                  active
                    ? 'border-cyan-200 dark:border-cyan-300/30 bg-cyan-50 dark:bg-cyan-300/10 text-cyan-700 dark:text-cyan-100'
                    : 'border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-white/[0.04] text-slate-600 dark:text-white/60'
                )}
              >
                <AdminIcon path={item.path} />
                {item.label}
              </Link>
            );
          })}
        </div>
        {children}
      </div>
    </div>
  );
};
