'use client';

import clsx from 'clsx';
import useSWR from 'swr';
import {
  ButtonHTMLAttributes,
  FormEvent,
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
  useCallback,
  useMemo,
  useState,
} from 'react';
import { useFetch } from '@gitroom/helpers/utils/custom.fetch';
import { useToaster } from '@gitroom/react/toaster/toaster';

type Paginated<T> = {
  items: T[];
  total: number;
  page: number;
  pages: number;
  limit: number;
};

type DashboardData = {
  metrics: Record<string, number>;
  revenue: {
    monthlyRecurringRevenue: number;
    annualizedRevenue: number;
  };
  subscriptionDistribution: Array<{ tier: string; count: number }>;
  platformDistribution: Array<{ platform: string; count: number }>;
  postStates: Array<{ state: string; count: number }>;
  signupSeries: Array<{ date: string; count: number }>;
  recentErrors: any[];
  recentReviews: any[];
  primaryAdminEmail: string;
};

const tiers = ['ALL', 'FREE', 'STANDARD', 'PRO', 'TEAM', 'ULTIMATE'];
const paidTiers = ['STANDARD', 'PRO', 'TEAM', 'ULTIMATE'];
const periods = ['MONTHLY', 'YEARLY'];
const accents = [
  'from-cyan-300/35 to-cyan-300/5 text-cyan-700 dark:text-cyan-100',
  'from-violet-300/35 to-violet-300/5 text-violet-100',
  'from-emerald-300/35 to-emerald-300/5 text-emerald-700 dark:text-emerald-100',
  'from-amber-300/35 to-amber-300/5 text-amber-700 dark:text-amber-100',
  'from-rose-300/35 to-rose-300/5 text-rose-700 dark:text-rose-100',
  'from-sky-300/35 to-sky-300/5 text-sky-100',
];

const formatNumber = (value?: number) =>
  new Intl.NumberFormat('en-US').format(value || 0);

const formatCurrency = (value?: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value || 0);

const formatDate = (value?: string) => {
  if (!value) {
    return '—';
  }

  return new Date(value).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

const useAdminSWR = <T,>(path: string | null) => {
  const appFetch = useFetch();
  const fetcher = useCallback(
    async (url: string) => {
      const response = await appFetch(url);
      if (!response.ok) {
        throw new Error(await response.text());
      }
      return response.json();
    },
    [appFetch]
  );

  return useSWR<T>(path, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    revalidateIfStale: false,
  });
};

type JsonRequestInit = Omit<RequestInit, 'body'> & {
  body?: unknown;
};

const useAdminRequest = () => {
  const appFetch = useFetch();
  const toaster = useToaster();

  return useCallback(
    async (path: string, options: JsonRequestInit = {}) => {
      const response = await appFetch(path, {
        ...options,
        body:
          options.body &&
          typeof options.body !== 'string' &&
          !(options.body instanceof FormData)
            ? JSON.stringify(options.body)
            : options.body,
      } as RequestInit);
      if (!response.ok) {
        const text = await response.text();
        toaster.show(text || 'Admin request failed', 'warning');
        throw new Error(text);
      }

      if (response.status === 204) {
        return null;
      }

      return response.json();
    },
    [appFetch, toaster]
  );
};

const PageShell = ({
  title,
  eyebrow,
  actions,
  children,
}: {
  title: string;
  eyebrow?: string;
  actions?: ReactNode;
  children: ReactNode;
}) => (
  <div className="min-h-[calc(100vh-82px)] w-full overflow-y-auto bg-slate-50 dark:bg-[linear-gradient(180deg,#07080d_0%,#0d0f14_52%,#08090d_100%)]">
    <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-5 p-4 md:p-6">
      <div className="flex flex-col gap-4 border-b border-slate-200 dark:border-white/10 pb-5 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="mb-2 text-[11px] font-[800] uppercase text-cyan-700 dark:text-cyan-200/70">
            {eyebrow || 'Admin'}
          </div>
          <h2 className="text-[28px] font-[800] leading-tight text-slate-900 dark:text-white md:text-[34px]">
            {title}
          </h2>
        </div>
        {actions}
      </div>
      {children}
    </div>
  </div>
);

const Panel = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => (
  <div
    className={clsx(
      'rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-white/[0.055] shadow-sm dark:shadow-[0_24px_80px_rgba(0,0,0,0.22)] backdrop-blur-xl',
      className
    )}
  >
    {children}
  </div>
);

const Field = ({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) => (
  <label className="flex min-w-0 flex-col gap-2 text-[12px] font-[700] uppercase text-slate-500 dark:text-white/45">
    <span>{label}</span>
    {children}
  </label>
);

const inputClass =
  'min-h-[40px] w-full rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-black/25 px-3 text-[14px] text-slate-900 dark:text-white outline-none transition-colors placeholder:text-slate-400 dark:placeholder:text-white/25 focus:border-cyan-500 dark:focus:border-cyan-300/45';

const Input = (props: InputHTMLAttributes<HTMLInputElement>) => (
  <input {...props} className={clsx(inputClass, props.className)} />
);

const Select = (props: SelectHTMLAttributes<HTMLSelectElement>) => (
  <select {...props} className={clsx(inputClass, props.className)} />
);

const Textarea = (props: TextareaHTMLAttributes<HTMLTextAreaElement>) => (
  <textarea
    {...props}
    className={clsx(
      inputClass,
      'min-h-[150px] resize-y py-3 leading-6',
      props.className
    )}
  />
);

const AdminButton = ({
  children,
  variant = 'primary',
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'quiet' | 'danger' | 'success';
}) => (
  <button
    {...props}
    className={clsx(
      'inline-flex min-h-[38px] items-center justify-center rounded-lg border px-4 text-[13px] font-[800] transition-colors disabled:cursor-not-allowed disabled:opacity-45',
      variant === 'primary' &&
        'border-cyan-200 dark:border-cyan-300/30 bg-cyan-50 dark:bg-cyan-300/15 text-cyan-700 dark:text-cyan-100 hover:bg-cyan-100 dark:hover:bg-cyan-300/22',
      variant === 'quiet' &&
        'border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-white/[0.04] text-slate-600 dark:text-white/70 hover:bg-slate-200 dark:hover:bg-white/[0.08] hover:text-slate-900 dark:hover:text-white',
      variant === 'danger' &&
        'border-rose-200 dark:border-rose-300/30 bg-rose-50 dark:bg-rose-300/12 text-rose-700 dark:text-rose-100 hover:bg-rose-100 dark:hover:bg-rose-300/20',
      variant === 'success' &&
        'border-emerald-200 dark:border-emerald-300/30 bg-emerald-50 dark:bg-emerald-300/12 text-emerald-700 dark:text-emerald-100 hover:bg-emerald-100 dark:hover:bg-emerald-300/20',
      className
    )}
  >
    {children}
  </button>
);

const LoadingPanel = () => (
  <Panel className="p-6">
    <div className="h-4 w-40 animate-pulse rounded bg-slate-200 dark:bg-white/10" />
    <div className="mt-5 grid gap-3 md:grid-cols-3">
      {[0, 1, 2].map((item) => (
        <div key={item} className="h-28 animate-pulse rounded-lg bg-slate-100 dark:bg-white/8" />
      ))}
    </div>
  </Panel>
);

const StatCard = ({
  label,
  value,
  detail,
  accent = 0,
}: {
  label: string;
  value: string;
  detail?: string;
  accent?: number;
}) => (
  <Panel className="relative overflow-hidden p-5">
    <div
      className={clsx(
        'absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r',
        accents[accent % accents.length]
      )}
    />
    <div className="text-[12px] font-[800] uppercase text-slate-500 dark:text-white/42">
      {label}
    </div>
    <div className="mt-3 text-[30px] font-[800] tracking-[0] text-slate-900 dark:text-white">
      {value}
    </div>
    {detail && <div className="mt-2 text-[13px] text-slate-500 dark:text-white/48">{detail}</div>}
  </Panel>
);

const BarList = ({
  items,
  labelKey,
  valueKey,
}: {
  items: any[];
  labelKey: string;
  valueKey: string;
}) => {
  const max = Math.max(...items.map((item) => Number(item[valueKey]) || 0), 1);

  return (
    <div className="flex flex-col gap-3">
      {items.map((item, index) => (
        <div key={`${item[labelKey]}-${index}`} className="grid gap-2">
          <div className="flex items-center justify-between gap-3 text-[13px]">
            <span className="truncate font-[700] text-slate-700 dark:text-white/78">
              {item[labelKey]}
            </span>
            <span className="text-slate-500 dark:text-white/45">{formatNumber(item[valueKey])}</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-white/8">
            <div
              className={clsx(
                'h-full rounded-full bg-gradient-to-r',
                accents[index % accents.length]
              )}
              style={{ width: `${(Number(item[valueKey]) / max) * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

const SparkBars = ({ series }: { series: Array<{ count: number }> }) => {
  const max = Math.max(...series.map((item) => item.count), 1);
  return (
    <div className="flex h-[120px] items-end gap-1">
      {series.map((item, index) => (
        <div
          key={index}
          className="flex-1 rounded-t bg-gradient-to-t from-cyan-300/70 to-emerald-200/70"
          style={{
            height: `${Math.max((item.count / max) * 100, 4)}%`,
          }}
        />
      ))}
    </div>
  );
};

const Table = ({
  headers,
  children,
}: {
  headers: string[];
  children: ReactNode;
}) => (
  <div className="overflow-x-auto">
    <table className="w-full min-w-[760px] border-separate border-spacing-0">
      <thead>
        <tr>
          {headers.map((header) => (
            <th
              key={header}
              className="border-b border-slate-200 dark:border-white/10 px-4 py-3 text-left text-[11px] font-[800] uppercase text-slate-500 dark:text-white/40"
            >
              {header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>{children}</tbody>
    </table>
  </div>
);

const Td = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => (
  <td
    className={clsx(
      'border-b border-slate-100 dark:border-white/[0.06] px-4 py-3 text-[13px] text-slate-600 dark:text-white/70',
      className
    )}
  >
    {children}
  </td>
);

const Badge = ({
  children,
  tone = 'neutral',
}: {
  children: ReactNode;
  tone?: 'neutral' | 'good' | 'warn' | 'danger';
}) => (
  <span
    className={clsx(
      'inline-flex min-h-[24px] items-center rounded-md border px-2 text-[11px] font-[800] uppercase',
      tone === 'neutral' && 'border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-white/[0.05] text-slate-500 dark:text-white/55',
      tone === 'good' &&
        'border-emerald-200 dark:border-emerald-300/25 bg-emerald-50 dark:bg-emerald-300/10 text-emerald-700 dark:text-emerald-100',
      tone === 'warn' && 'border-amber-200 dark:border-amber-300/25 bg-amber-50 dark:bg-amber-300/10 text-amber-700 dark:text-amber-100',
      tone === 'danger' && 'border-rose-200 dark:border-rose-300/25 bg-rose-50 dark:bg-rose-300/10 text-rose-700 dark:text-rose-100'
    )}
  >
    {children}
  </span>
);

const EmptyState = ({ label }: { label: string }) => (
  <div className="p-8 text-center text-[14px] text-slate-500 dark:text-white/42">{label}</div>
);

export const AdminDashboardHome = () => {
  const { data } = useAdminSWR<DashboardData>('/admin/dashboard');

  if (!data) {
    return (
      <PageShell title="Admin Dashboard" eyebrow="Overview">
        <LoadingPanel />
      </PageShell>
    );
  }

  return (
    <PageShell title="Admin Dashboard" eyebrow="Overview">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total Users"
          value={formatNumber(data.metrics.totalUsers)}
          detail={`${formatNumber(data.metrics.totalOrganizations)} organizations`}
          accent={0}
        />
        <StatCard
          label="Active Subscriptions"
          value={formatNumber(data.metrics.activeSubscriptions)}
          detail={formatCurrency(data.revenue.monthlyRecurringRevenue) + ' MRR'}
          accent={1}
        />
        <StatCard
          label="Automations"
          value={formatNumber(data.metrics.activeAutomations)}
          detail={`${formatNumber(data.metrics.totalPosts)} total posts`}
          accent={2}
        />
        <StatCard
          label="Error Rate Signal"
          value={formatNumber(data.metrics.recentErrors)}
          detail={`${formatNumber(data.metrics.totalErrors)} lifetime errors`}
          accent={4}
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.3fr_.7fr]">
        <Panel className="p-5">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-[18px] font-[800]">Signups Over 30 Days</h3>
            <Badge tone="good">
              {formatCurrency(data.revenue.annualizedRevenue)} ARR
            </Badge>
          </div>
          <SparkBars series={data.signupSeries} />
        </Panel>
        <Panel className="p-5">
          <h3 className="mb-4 text-[18px] font-[800]">Platform Mix</h3>
          <BarList
            items={data.platformDistribution}
            labelKey="platform"
            valueKey="count"
          />
        </Panel>
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <Panel className="p-5">
          <h3 className="mb-4 text-[18px] font-[800]">Subscription Tiers</h3>
          <BarList
            items={data.subscriptionDistribution}
            labelKey="tier"
            valueKey="count"
          />
        </Panel>
        <Panel className="p-5">
          <h3 className="mb-4 text-[18px] font-[800]">Post States</h3>
          <BarList items={data.postStates} labelKey="state" valueKey="count" />
        </Panel>
        <Panel className="p-5">
          <h3 className="mb-4 text-[18px] font-[800]">Reviews</h3>
          <div className="text-[42px] font-[800] text-slate-900 dark:text-white">
            {data.metrics.averageRating || 0}
          </div>
          <div className="mb-5 text-[13px] text-slate-500 dark:text-white/45">
            {formatNumber(data.metrics.totalReviews)} total reviews
          </div>
          <div className="text-[12px] text-slate-500 dark:text-white/45">
            Primary admin: {data.primaryAdminEmail}
          </div>
        </Panel>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <Panel>
          <div className="border-b border-slate-200 dark:border-white/10 p-4 text-[16px] font-[800]">
            Recent Errors
          </div>
          {data.recentErrors.length ? (
            data.recentErrors.map((error) => (
              <div
                key={error.id}
                className="border-b border-slate-100 dark:border-white/[0.06] p-4 last:border-b-0"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="truncate text-[14px] font-[700] text-slate-900 dark:text-white">
                    {error.message}
                  </div>
                  <Badge tone="danger">{error.platform}</Badge>
                </div>
                <div className="mt-2 text-[12px] text-slate-500 dark:text-white/42">
                  {error.organization?.name || error.organizationId} ·{' '}
                  {formatDate(error.createdAt)}
                </div>
              </div>
            ))
          ) : (
            <EmptyState label="No errors recorded." />
          )}
        </Panel>
        <Panel>
          <div className="border-b border-slate-200 dark:border-white/10 p-4 text-[16px] font-[800]">
            Latest Reviews
          </div>
          {data.recentReviews.length ? (
            data.recentReviews.map((review) => (
              <div
                key={review.id}
                className="border-b border-slate-100 dark:border-white/[0.06] p-4 last:border-b-0"
              >
                <div className="flex items-center justify-between">
                  <div className="text-[14px] font-[700] text-slate-900 dark:text-white">
                    {review.user?.email || 'Unknown user'}
                  </div>
                  <Badge tone="warn">{review.rating}/5</Badge>
                </div>
                <div className="mt-2 line-clamp-2 text-[13px] text-slate-500 dark:text-white/52">
                  {review.comment || 'No comment'}
                </div>
              </div>
            ))
          ) : (
            <EmptyState label="No reviews yet." />
          )}
        </Panel>
      </div>
    </PageShell>
  );
};

const EmailDialog = ({
  user,
  onClose,
}: {
  user: any;
  onClose: () => void;
}) => {
  const request = useAdminRequest();
  const toaster = useToaster();
  const [subject, setSubject] = useState('');
  const [html, setHtml] = useState('');
  const [sending, setSending] = useState(false);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setSending(true);
    try {
      await request(`/admin/users/${user.id}/email`, {
        method: 'POST',
        body: { subject, html },
      });
      toaster.show('Email sent', 'success');
      onClose();
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[800] flex items-center justify-center bg-slate-900/40 dark:bg-black/70 p-4 backdrop-blur-sm">
      <form
        onSubmit={submit}
        className="w-full max-w-[680px] rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0b0d12] p-5 shadow-xl dark:shadow-[0_32px_100px_rgba(0,0,0,0.55)]"
      >
        <div className="mb-5 flex items-center justify-between gap-4">
          <div>
            <div className="text-[12px] uppercase text-slate-500 dark:text-white/42">Email</div>
            <div className="text-[20px] font-[800] text-slate-900 dark:text-white">{user.email}</div>
          </div>
          <AdminButton type="button" variant="quiet" onClick={onClose}>
            Close
          </AdminButton>
        </div>
        <div className="grid gap-4">
          <Field label="Subject">
            <Input
              value={subject}
              onChange={(event) => setSubject(event.target.value)}
              required
            />
          </Field>
          <Field label="Body">
            <Textarea
              value={html}
              onChange={(event) => setHtml(event.target.value)}
              required
            />
          </Field>
        </div>
        <div className="mt-5 flex justify-end">
          <AdminButton disabled={sending}>
            {sending ? 'Sending...' : 'Send Email'}
          </AdminButton>
        </div>
      </form>
    </div>
  );
};

export const AdminUsersPage = () => {
  const request = useAdminRequest();
  const toaster = useToaster();
  const [search, setSearch] = useState('');
  const [tier, setTier] = useState('ALL');
  const [admin, setAdmin] = useState('ALL');
  const [page, setPage] = useState(1);
  const [emailUser, setEmailUser] = useState<any>(null);
  const [tierDraft, setTierDraft] = useState<Record<string, string>>({});

  const query = useMemo(() => {
    const params = new URLSearchParams({
      page: String(page),
      limit: '25',
      tier,
    });
    if (search.trim()) {
      params.set('search', search.trim());
    }
    if (admin !== 'ALL') {
      params.set('admin', admin);
    }
    return `/admin/users?${params.toString()}`;
  }, [admin, page, search, tier]);

  const { data, mutate } = useAdminSWR<Paginated<any>>(query);

  const changeTier = async (user: any) => {
    const nextTier = tierDraft[user.id] || user.tier || 'FREE';
    await request(`/admin/users/${user.id}/upgrade`, {
      method: 'POST',
      body: {
        organizationId: user.primaryOrganization?.id,
        tier: nextTier,
      },
    });
    toaster.show('Subscription updated', 'success');
    await mutate();
  };

  const toggleAdmin = async (user: any) => {
    await request(`/admin/users/${user.id}/toggle-admin`, {
      method: 'POST',
      body: {
        isSuperAdmin: !user.isSuperAdmin,
      },
    });
    toaster.show(user.isSuperAdmin ? 'Admin removed' : 'Admin promoted', 'success');
    await mutate();
  };

  return (
    <PageShell title="Users" eyebrow="Admin Control">
      {emailUser && (
        <EmailDialog user={emailUser} onClose={() => setEmailUser(null)} />
      )}
      <Panel className="p-4">
        <div className="grid gap-3 lg:grid-cols-[1fr_180px_180px_auto]">
          <Field label="Search">
            <Input
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setPage(1);
              }}
              placeholder="Email or name"
            />
          </Field>
          <Field label="Tier">
            <Select
              value={tier}
              onChange={(event) => {
                setTier(event.target.value);
                setPage(1);
              }}
            >
              {tiers.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </Select>
          </Field>
          <Field label="Admin">
            <Select
              value={admin}
              onChange={(event) => {
                setAdmin(event.target.value);
                setPage(1);
              }}
            >
              <option value="ALL">ALL</option>
              <option value="true">ADMINS</option>
              <option value="false">USERS</option>
            </Select>
          </Field>
          <div className="flex items-end">
            <AdminButton variant="quiet" onClick={() => mutate()}>
              Refresh
            </AdminButton>
          </div>
        </div>
      </Panel>

      <Panel>
        {!data ? (
          <LoadingPanel />
        ) : data.items.length ? (
          <>
            <Table
              headers={[
                'User',
                'Organization',
                'Tier',
                'Joined',
                'Admin',
                'Actions',
              ]}
            >
              {data.items.map((user) => (
                <tr key={user.id}>
                  <Td>
                    <div className="font-[800] text-slate-900 dark:text-white">{user.email}</div>
                    <div className="text-[12px] text-slate-500 dark:text-white/38">
                      {[user.name, user.lastName].filter(Boolean).join(' ') ||
                        'No name'}
                    </div>
                  </Td>
                  <Td>
                    <div className="font-[700] text-slate-700 dark:text-white/80">
                      {user.primaryOrganization?.name || 'No organization'}
                    </div>
                    <div className="text-[12px] text-slate-500 dark:text-white/38">
                      {formatNumber(
                        user.primaryOrganization?._count?.Integration || 0
                      )}{' '}
                      channels
                    </div>
                  </Td>
                  <Td>
                    <Select
                      value={tierDraft[user.id] || user.tier || 'FREE'}
                      onChange={(event) =>
                        setTierDraft((current) => ({
                          ...current,
                          [user.id]: event.target.value,
                        }))
                      }
                      className="min-w-[135px]"
                    >
                      {tiers
                        .filter((item) => item !== 'ALL')
                        .map((item) => (
                          <option key={item}>{item}</option>
                        ))}
                    </Select>
                  </Td>
                  <Td>{formatDate(user.createdAt)}</Td>
                  <Td>
                    <Badge tone={user.isSuperAdmin ? 'good' : 'neutral'}>
                      {user.isSuperAdmin ? 'Admin' : 'User'}
                    </Badge>
                  </Td>
                  <Td>
                    <div className="flex flex-wrap gap-2">
                      <AdminButton
                        variant="success"
                        disabled={!user.primaryOrganization?.id}
                        onClick={() => changeTier(user)}
                      >
                        Save Plan
                      </AdminButton>
                      <AdminButton variant="quiet" onClick={() => toggleAdmin(user)}>
                        {user.isSuperAdmin ? 'Demote' : 'Promote'}
                      </AdminButton>
                      <AdminButton variant="quiet" onClick={() => setEmailUser(user)}>
                        Email
                      </AdminButton>
                    </div>
                  </Td>
                </tr>
              ))}
            </Table>
            <div className="flex items-center justify-between gap-3 p-4">
              <div className="text-[13px] text-slate-500 dark:text-white/45">
                {formatNumber(data.total)} users
              </div>
              <div className="flex gap-2">
                <AdminButton
                  variant="quiet"
                  disabled={page <= 1}
                  onClick={() => setPage((value) => value - 1)}
                >
                  Previous
                </AdminButton>
                <AdminButton
                  variant="quiet"
                  disabled={page >= data.pages}
                  onClick={() => setPage((value) => value + 1)}
                >
                  Next
                </AdminButton>
              </div>
            </div>
          </>
        ) : (
          <EmptyState label="No users found." />
        )}
      </Panel>
    </PageShell>
  );
};

const PricingRow = ({
  plan,
  onSaved,
  onEditFeatures,
}: {
  plan: any;
  onSaved: () => Promise<any>;
  onEditFeatures: (plan: any) => void;
}) => {
  const request = useAdminRequest();
  const toaster = useToaster();
  const [monthPrice, setMonthPrice] = useState(plan.monthPrice || 0);
  const [yearPrice, setYearPrice] = useState(plan.yearPrice || 0);
  const [totalChannels, setTotalChannels] = useState(plan.totalChannels || 0);
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    try {
      await request('/admin/pricing', {
        method: 'POST',
        body: {
          tier: plan.tier,
          monthPrice: Number(monthPrice),
          yearPrice: Number(yearPrice),
          totalChannels: Number(totalChannels),
        },
      });
      toaster.show('Pricing updated', 'success');
      await onSaved();
    } finally {
      setSaving(false);
    }
  };

  return (
    <tr>
      <Td>
        <Badge tone={plan.overrideId ? 'good' : 'neutral'}>{plan.tier}</Badge>
      </Td>
      <Td>
        <Input
          type="number"
          value={monthPrice}
          onChange={(event) => setMonthPrice(Number(event.target.value))}
        />
      </Td>
      <Td>
        <Input
          type="number"
          value={yearPrice}
          onChange={(event) => setYearPrice(Number(event.target.value))}
        />
      </Td>
      <Td>
        <Input
          type="number"
          value={totalChannels}
          onChange={(event) => setTotalChannels(Number(event.target.value))}
        />
      </Td>
      <Td>
        <div className="flex items-center gap-2">
          <AdminButton disabled={saving} onClick={() => save()}>
            {saving ? 'Saving...' : 'Save'}
          </AdminButton>
          <AdminButton variant="quiet" onClick={() => onEditFeatures(plan)}>
            Features
          </AdminButton>
        </div>
      </Td>
    </tr>
  );
};

const FeaturesDialog = ({
  plan,
  onClose,
  onSave,
}: {
  plan: any;
  onClose: () => void;
  onSave: (features: any) => Promise<void>;
}) => {
  const [customFeatures, setCustomFeatures] = useState<string[]>(
    plan.features?.custom_features || []
  );
  const [newFeature, setNewFeature] = useState('');
  const [saving, setSaving] = useState(false);

  const handleAdd = () => {
    if (newFeature.trim()) {
      setCustomFeatures([...customFeatures, newFeature.trim()]);
      setNewFeature('');
    }
  };

  const handleRemove = (index: number) => {
    setCustomFeatures(customFeatures.filter((_, i) => i !== index));
  };

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave({
        ...plan.features,
        custom_features: customFeatures.length > 0 ? customFeatures : null,
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[800] flex items-center justify-center bg-slate-900/40 dark:bg-black/70 p-4 backdrop-blur-sm">
      <form
        onSubmit={handleSave}
        className="w-full max-w-[500px] rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0b0d12] p-5 shadow-xl dark:shadow-[0_32px_100px_rgba(0,0,0,0.55)]"
      >
        <div className="mb-5 flex items-center justify-between gap-4">
          <div>
            <div className="text-[12px] uppercase text-slate-500 dark:text-white/42">Custom Features</div>
            <div className="text-[20px] font-[800] text-slate-900 dark:text-white">{plan.tier}</div>
          </div>
          <AdminButton type="button" variant="quiet" onClick={onClose}>
            Close
          </AdminButton>
        </div>
        
        <div className="mb-4 text-[13px] text-slate-500 dark:text-white/45">
          If you add custom features here, they will completely replace the default features list on the landing page for this plan.
        </div>

        <div className="grid gap-3">
          {customFeatures.map((feature, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <div className="flex-1 rounded-md border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-black/20 p-2 text-[13px] text-slate-700 dark:text-white/80">
                {feature}
              </div>
              <AdminButton type="button" variant="danger" onClick={() => handleRemove(idx)}>
                Remove
              </AdminButton>
            </div>
          ))}

          <div className="flex items-center gap-2 mt-2">
            <Input
              value={newFeature}
              onChange={(e) => setNewFeature(e.target.value)}
              placeholder="Add a new feature..."
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAdd();
                }
              }}
            />
            <AdminButton type="button" variant="quiet" onClick={handleAdd}>
              Add
            </AdminButton>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <AdminButton disabled={saving}>
            {saving ? 'Saving...' : 'Save Features'}
          </AdminButton>
        </div>
      </form>
    </div>
  );
};

export const AdminSubscriptionsPage = () => {
  const { data: subscriptions } = useAdminSWR<any[]>('/admin/subscriptions');
  const { data: pricingData, mutate: mutatePricing } =
    useAdminSWR<any[]>('/admin/pricing');
  const request = useAdminRequest();
  const toaster = useToaster();
  const [featuresPlan, setFeaturesPlan] = useState<any>(null);

  const revenue = useMemo(
    () =>
      (subscriptions || []).reduce(
        (total, item) => total + Number(item.monthlyRevenue || 0),
        0
      ),
    [subscriptions]
  );

  return (
    <PageShell title="Subscriptions" eyebrow="Revenue">
      {featuresPlan && (
        <FeaturesDialog
          plan={featuresPlan}
          onClose={() => setFeaturesPlan(null)}
          onSave={async (features) => {
            await request('/admin/pricing', {
              method: 'POST',
              body: {
                tier: featuresPlan.tier,
                monthPrice: featuresPlan.monthPrice || 0,
                yearPrice: featuresPlan.yearPrice || 0,
                totalChannels: featuresPlan.totalChannels || 0,
                features: features,
              },
            });
            toaster.show('Features updated', 'success');
            setFeaturesPlan(null);
            mutatePricing();
          }}
        />
      )}
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          label="Active Subscriptions"
          value={formatNumber(subscriptions?.length || 0)}
          accent={0}
        />
        <StatCard label="MRR" value={formatCurrency(revenue)} accent={2} />
        <StatCard label="ARR" value={formatCurrency(revenue * 12)} accent={3} />
      </div>

      <Panel>
        <div className="border-b border-slate-200 dark:border-white/10 p-4 text-[16px] font-[800]">
          Pricing
        </div>
        {!pricingData ? (
          <LoadingPanel />
        ) : (
          <Table
            headers={['Tier', 'Monthly Price', 'Yearly Price', 'Channels', '']}
          >
            {pricingData
              .filter((plan) => paidTiers.includes(plan.tier))
              .map((plan) => (
                <PricingRow
                  key={plan.tier}
                  plan={plan}
                  onSaved={mutatePricing}
                  onEditFeatures={setFeaturesPlan}
                />
              ))}
          </Table>
        )}
      </Panel>

      <Panel>
        <div className="border-b border-slate-200 dark:border-white/10 p-4 text-[16px] font-[800]">
          Active Accounts
        </div>
        {!subscriptions ? (
          <LoadingPanel />
        ) : subscriptions.length ? (
          <Table
            headers={[
              'Organization',
              'Tier',
              'Period',
              'Channels',
              'Monthly Revenue',
              'Updated',
            ]}
          >
            {subscriptions.map((subscription) => (
              <tr key={subscription.id}>
                <Td>
                  <div className="font-[800] text-slate-900 dark:text-white">
                    {subscription.organization?.name}
                  </div>
                  <div className="text-[12px] text-slate-500 dark:text-white/38">
                    {subscription.organization?.users?.[0]?.user?.email ||
                      'No owner'}
                  </div>
                </Td>
                <Td>
                  <Badge tone="good">{subscription.subscriptionTier}</Badge>
                </Td>
                <Td>{subscription.period}</Td>
                <Td>{formatNumber(subscription.totalChannels)}</Td>
                <Td>{formatCurrency(subscription.monthlyRevenue)}</Td>
                <Td>{formatDate(subscription.updatedAt)}</Td>
              </tr>
            ))}
          </Table>
        ) : (
          <EmptyState label="No active subscriptions." />
        )}
      </Panel>
    </PageShell>
  );
};

const DiscountRow = ({
  discount,
  onSaved,
}: {
  discount: any;
  onSaved: () => Promise<any>;
}) => {
  const request = useAdminRequest();
  const toaster = useToaster();
  const [draft, setDraft] = useState({
    code: discount.code,
    type: discount.type,
    value: discount.value,
    maxUses: discount.maxUses || '',
    expiresAt: discount.expiresAt ? discount.expiresAt.slice(0, 10) : '',
    active: discount.active,
  });

  const save = async () => {
    await request(`/admin/discounts/${discount.id}`, {
      method: 'PUT',
      body: {
        ...draft,
        maxUses: draft.maxUses === '' ? null : Number(draft.maxUses),
        value: Number(draft.value),
        expiresAt: draft.expiresAt || null,
      },
    });
    toaster.show('Discount updated', 'success');
    await onSaved();
  };

  const remove = async () => {
    await request(`/admin/discounts/${discount.id}`, {
      method: 'DELETE',
    });
    toaster.show('Discount deleted', 'success');
    await onSaved();
  };

  return (
    <tr>
      <Td>
        <Input
          value={draft.code}
          onChange={(event) =>
            setDraft((current) => ({ ...current, code: event.target.value }))
          }
        />
      </Td>
      <Td>
        <Select
          value={draft.type}
          onChange={(event) =>
            setDraft((current) => ({ ...current, type: event.target.value }))
          }
        >
          <option>PERCENTAGE</option>
          <option>FIXED</option>
        </Select>
      </Td>
      <Td>
        <Input
          type="number"
          value={draft.value}
          onChange={(event) =>
            setDraft((current) => ({
              ...current,
              value: Number(event.target.value),
            }))
          }
        />
      </Td>
      <Td>
        <Input
          type="number"
          value={draft.maxUses}
          onChange={(event) =>
            setDraft((current) => ({ ...current, maxUses: event.target.value }))
          }
        />
      </Td>
      <Td>
        <Input
          type="date"
          value={draft.expiresAt}
          onChange={(event) =>
            setDraft((current) => ({
              ...current,
              expiresAt: event.target.value,
            }))
          }
        />
      </Td>
      <Td>
        <Select
          value={draft.active ? 'true' : 'false'}
          onChange={(event) =>
            setDraft((current) => ({
              ...current,
              active: event.target.value === 'true',
            }))
          }
        >
          <option value="true">ACTIVE</option>
          <option value="false">PAUSED</option>
        </Select>
      </Td>
      <Td>
        <div className="flex flex-wrap gap-2">
          <AdminButton onClick={save}>Save</AdminButton>
          <AdminButton variant="danger" onClick={remove}>
            Delete
          </AdminButton>
        </div>
      </Td>
    </tr>
  );
};

export const AdminDiscountsPage = () => {
  const { data, mutate } = useAdminSWR<any[]>('/admin/discounts');
  const request = useAdminRequest();
  const toaster = useToaster();
  const [draft, setDraft] = useState({
    code: '',
    type: 'PERCENTAGE',
    value: 10,
    maxUses: '',
    expiresAt: '',
  });

  const create = async (event: FormEvent) => {
    event.preventDefault();
    await request('/admin/discounts', {
      method: 'POST',
      body: {
        ...draft,
        value: Number(draft.value),
        maxUses: draft.maxUses ? Number(draft.maxUses) : null,
        expiresAt: draft.expiresAt || null,
        active: true,
      },
    });
    toaster.show('Discount created', 'success');
    setDraft({
      code: '',
      type: 'PERCENTAGE',
      value: 10,
      maxUses: '',
      expiresAt: '',
    });
    await mutate();
  };

  return (
    <PageShell title="Discounts" eyebrow="Promotions">
      <Panel className="p-4">
        <form
          onSubmit={create}
          className="grid gap-3 md:grid-cols-2 xl:grid-cols-[1fr_180px_160px_160px_180px_auto]"
        >
          <Field label="Code">
            <Input
              value={draft.code}
              onChange={(event) =>
                setDraft((current) => ({ ...current, code: event.target.value }))
              }
              required
            />
          </Field>
          <Field label="Type">
            <Select
              value={draft.type}
              onChange={(event) =>
                setDraft((current) => ({ ...current, type: event.target.value }))
              }
            >
              <option>PERCENTAGE</option>
              <option>FIXED</option>
            </Select>
          </Field>
          <Field label="Value">
            <Input
              type="number"
              value={draft.value}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  value: Number(event.target.value),
                }))
              }
              required
            />
          </Field>
          <Field label="Max Uses">
            <Input
              type="number"
              value={draft.maxUses}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  maxUses: event.target.value,
                }))
              }
            />
          </Field>
          <Field label="Expires">
            <Input
              type="date"
              value={draft.expiresAt}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  expiresAt: event.target.value,
                }))
              }
            />
          </Field>
          <div className="flex items-end">
            <AdminButton>Create</AdminButton>
          </div>
        </form>
      </Panel>

      <Panel>
        {!data ? (
          <LoadingPanel />
        ) : data.length ? (
          <Table
            headers={[
              'Code',
              'Type',
              'Value',
              'Max Uses',
              'Expires',
              'Status',
              'Actions',
            ]}
          >
            {data.map((discount) => (
              <DiscountRow
                key={discount.id}
                discount={discount}
                onSaved={mutate}
              />
            ))}
          </Table>
        ) : (
          <EmptyState label="No discounts created." />
        )}
      </Panel>
    </PageShell>
  );
};

export const AdminEmailsPage = () => {
  const request = useAdminRequest();
  const toaster = useToaster();
  const [draft, setDraft] = useState({
    audience: 'ALL',
    tier: 'STANDARD',
    email: '',
    subject: '',
    html: '',
  });
  const [sending, setSending] = useState(false);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setSending(true);
    try {
      const response = await request('/admin/email/broadcast', {
        method: 'POST',
        body: draft,
      });
      toaster.show(`Email queued for ${response.sent} recipients`, 'success');
      setDraft((current) => ({ ...current, subject: '', html: '' }));
    } finally {
      setSending(false);
    }
  };

  return (
    <PageShell title="Emails" eyebrow="Messaging">
      <Panel className="p-5">
        <form onSubmit={submit} className="grid gap-4">
          <div className="grid gap-4 md:grid-cols-3">
            <Field label="Audience">
              <Select
                value={draft.audience}
                onChange={(event) =>
                  setDraft((current) => ({
                    ...current,
                    audience: event.target.value,
                  }))
                }
              >
                <option value="ALL">All users</option>
                <option value="TIER">Specific tier</option>
                <option value="USER">Individual user</option>
              </Select>
            </Field>
            {draft.audience === 'TIER' && (
              <Field label="Tier">
                <Select
                  value={draft.tier}
                  onChange={(event) =>
                    setDraft((current) => ({
                      ...current,
                      tier: event.target.value,
                    }))
                  }
                >
                  {tiers
                    .filter((item) => item !== 'ALL')
                    .map((item) => (
                      <option key={item}>{item}</option>
                    ))}
                </Select>
              </Field>
            )}
            {draft.audience === 'USER' && (
              <Field label="Email">
                <Input
                  type="email"
                  value={draft.email}
                  onChange={(event) =>
                    setDraft((current) => ({
                      ...current,
                      email: event.target.value,
                    }))
                  }
                  required
                />
              </Field>
            )}
          </div>
          <Field label="Subject">
            <Input
              value={draft.subject}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  subject: event.target.value,
                }))
              }
              required
            />
          </Field>
          <Field label="Body">
            <Textarea
              value={draft.html}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  html: event.target.value,
                }))
              }
              required
            />
          </Field>
          <div className="flex justify-end">
            <AdminButton disabled={sending}>
              {sending ? 'Sending...' : 'Send Broadcast'}
            </AdminButton>
          </div>
        </form>
      </Panel>
    </PageShell>
  );
};

export const AdminIssuesPage = () => {
  const [search, setSearch] = useState('');
  const [platform, setPlatform] = useState('');
  const [page, setPage] = useState(1);
  const query = useMemo(() => {
    const params = new URLSearchParams({
      page: String(page),
      limit: '30',
    });
    if (search.trim()) {
      params.set('search', search.trim());
    }
    if (platform.trim()) {
      params.set('platform', platform.trim());
    }
    return `/admin/errors?${params.toString()}`;
  }, [page, platform, search]);
  const { data } = useAdminSWR<
    Paginated<any> & { grouped: Array<{ organizationId: string; platform: string; _count: { id: number } }> }
  >(query);

  return (
    <PageShell title="Issues & Errors" eyebrow="Reliability">
      <Panel className="p-4">
        <div className="grid gap-3 md:grid-cols-[1fr_220px]">
          <Field label="Search">
            <Input
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setPage(1);
              }}
              placeholder="Message, organization, platform"
            />
          </Field>
          <Field label="Platform">
            <Input
              value={platform}
              onChange={(event) => {
                setPlatform(event.target.value);
                setPage(1);
              }}
            />
          </Field>
        </div>
      </Panel>
      <div className="grid gap-4 xl:grid-cols-[.7fr_1.3fr]">
        <Panel>
          <div className="border-b border-slate-200 dark:border-white/10 p-4 text-[16px] font-[800]">
            Grouped Errors
          </div>
          {data?.grouped?.length ? (
            <div className="p-4">
              <BarList
                items={data.grouped.map((item) => ({
                  label: `${item.platform} · ${item.organizationId.slice(0, 8)}`,
                  count: item._count.id,
                }))}
                labelKey="label"
                valueKey="count"
              />
            </div>
          ) : (
            <EmptyState label="No grouped errors." />
          )}
        </Panel>
        <Panel>
          {!data ? (
            <LoadingPanel />
          ) : data.items.length ? (
            <>
              <Table
                headers={['Message', 'Platform', 'Organization', 'Post', 'Date']}
              >
                {data.items.map((error) => (
                  <tr key={error.id}>
                    <Td>
                      <div className="max-w-[420px] truncate font-[700] text-slate-900 dark:text-white">
                        {error.message}
                      </div>
                    </Td>
                    <Td>
                      <Badge tone="danger">{error.platform}</Badge>
                    </Td>
                    <Td>{error.organization?.name || error.organizationId}</Td>
                    <Td>{error.post?.state || '—'}</Td>
                    <Td>{formatDate(error.createdAt)}</Td>
                  </tr>
                ))}
              </Table>
              <div className="flex justify-end gap-2 p-4">
                <AdminButton
                  variant="quiet"
                  disabled={page <= 1}
                  onClick={() => setPage((value) => value - 1)}
                >
                  Previous
                </AdminButton>
                <AdminButton
                  variant="quiet"
                  disabled={page >= data.pages}
                  onClick={() => setPage((value) => value + 1)}
                >
                  Next
                </AdminButton>
              </div>
            </>
          ) : (
            <EmptyState label="No errors found." />
          )}
        </Panel>
      </div>
    </PageShell>
  );
};

export const AdminReviewsPage = () => {
  const [rating, setRating] = useState('ALL');
  const query = rating === 'ALL' ? '/admin/reviews' : `/admin/reviews?rating=${rating}`;
  const { data } = useAdminSWR<
    Paginated<any> & { aggregate: { _avg: { rating: number }; _count: { id: number } } }
  >(query);

  return (
    <PageShell title="Reviews" eyebrow="Feedback">
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          label="Average Rating"
          value={
            typeof data?.aggregate?._avg?.rating === 'number'
              ? data.aggregate._avg.rating.toFixed(1)
              : '0.0'
          }
          accent={3}
        />
        <StatCard
          label="Total Reviews"
          value={formatNumber(data?.aggregate?._count?.id || 0)}
          accent={1}
        />
        <Panel className="p-5">
          <Field label="Rating Filter">
            <Select value={rating} onChange={(event) => setRating(event.target.value)}>
              <option>ALL</option>
              <option value="5">5</option>
              <option value="4">4</option>
              <option value="3">3</option>
              <option value="2">2</option>
              <option value="1">1</option>
            </Select>
          </Field>
        </Panel>
      </div>
      <Panel>
        {!data ? (
          <LoadingPanel />
        ) : data.items.length ? (
          <Table headers={['User', 'Organization', 'Rating', 'Comment', 'Date']}>
            {data.items.map((review) => (
              <tr key={review.id}>
                <Td>
                  <div className="font-[800] text-slate-900 dark:text-white">{review.user?.email}</div>
                  <div className="text-[12px] text-slate-500 dark:text-white/38">
                    {[review.user?.name, review.user?.lastName]
                      .filter(Boolean)
                      .join(' ') || 'No name'}
                  </div>
                </Td>
                <Td>{review.organization?.name}</Td>
                <Td>
                  <Badge tone="warn">{review.rating}/5</Badge>
                </Td>
                <Td>
                  <div className="max-w-[520px] whitespace-pre-wrap">
                    {review.comment || '—'}
                  </div>
                </Td>
                <Td>{formatDate(review.createdAt)}</Td>
              </tr>
            ))}
          </Table>
        ) : (
          <EmptyState label="No reviews found." />
        )}
      </Panel>
    </PageShell>
  );
};

export const AdminStatisticsPage = () => {
  const [days, setDays] = useState('30');
  const { data } = useAdminSWR<any>(`/admin/stats?days=${days}`);

  return (
    <PageShell
      title="Statistics"
      eyebrow="Platform Data"
      actions={
        <Field label="Window">
          <Select value={days} onChange={(event) => setDays(event.target.value)}>
            <option value="7">7 days</option>
            <option value="30">30 days</option>
            <option value="90">90 days</option>
            <option value="365">365 days</option>
          </Select>
        </Field>
      }
    >
      {!data ? (
        <LoadingPanel />
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-3">
            <StatCard label="Error Rate" value={`${data.errorRate}%`} accent={4} />
            <StatCard
              label="New Users"
              value={formatNumber(
                data.signupSeries.reduce(
                  (total: number, item: any) => total + item.count,
                  0
                )
              )}
              accent={0}
            />
            <StatCard
              label="Posts Created"
              value={formatNumber(
                data.postSeries.reduce(
                  (total: number, item: any) => total + item.count,
                  0
                )
              )}
              accent={2}
            />
          </div>
          <div className="grid gap-4 xl:grid-cols-3">
            <Panel className="p-5 xl:col-span-2">
              <h3 className="mb-4 text-[18px] font-[800]">Post Volume</h3>
              <SparkBars series={data.postSeries} />
            </Panel>
            <Panel className="p-5">
              <h3 className="mb-4 text-[18px] font-[800]">Errors</h3>
              <SparkBars series={data.errorSeries} />
            </Panel>
          </div>
          <div className="grid gap-4 xl:grid-cols-3">
            <Panel className="p-5">
              <h3 className="mb-4 text-[18px] font-[800]">Platforms</h3>
              <BarList
                items={data.platformDistribution}
                labelKey="platform"
                valueKey="count"
              />
            </Panel>
            <Panel className="p-5">
              <h3 className="mb-4 text-[18px] font-[800]">Subscriptions</h3>
              <BarList
                items={data.subscriptionDistribution}
                labelKey="tier"
                valueKey="count"
              />
            </Panel>
            <Panel className="p-5">
              <h3 className="mb-4 text-[18px] font-[800]">AI Credits</h3>
              <BarList items={data.credits} labelKey="type" valueKey="credits" />
            </Panel>
          </div>
        </>
      )}
    </PageShell>
  );
};
