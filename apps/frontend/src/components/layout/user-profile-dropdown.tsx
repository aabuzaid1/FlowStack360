'use client';

import React, { FC, useCallback, useRef, useState, useEffect } from 'react';
import { useUser } from '@gitroom/frontend/components/layout/user.context';
import { useFetch } from '@gitroom/helpers/utils/custom.fetch';
import { useToaster } from '@gitroom/react/toaster/toaster';
import { useT } from '@gitroom/react/translation/get.transation.service.client';
import SafeImage from '@gitroom/react/helpers/safe.image';
import { LogoutComponent } from '@gitroom/frontend/components/layout/logout.component';

const extractDomainCompany = (email?: string) => {
  if (!email) return '';
  const domain = email.split('@')[1];
  if (!domain) return '';
  const companyName = domain.split('.')[0];
  if (['gmail', 'yahoo', 'hotmail', 'outlook'].includes(companyName.toLowerCase())) {
    return '';
  }
  return companyName.charAt(0).toUpperCase() + companyName.slice(1);
};

export const UserProfileDropdown: FC = () => {
  const user = useUser();
  const fetch = useFetch();
  const toast = useToaster();
  const t = useT();
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<'info' | 'password'>('info');
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Password form state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pwError, setPwError] = useState('');

  // Load profile on open
  const loadProfile = useCallback(async () => {
    try {
      const data = await (await fetch('/user/personal')).json();
      setProfile(data);
    } catch (e) {
      console.error('Failed to load profile', e);
    }
  }, [fetch]);

  useEffect(() => {
    if (open && !profile) {
      loadProfile();
    }
  }, [open]);

  // Close on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  const changePassword = useCallback(async () => {
    setPwError('');
    if (!newPassword || newPassword.length < 6) {
      setPwError(t('password_too_short', 'Password must be at least 6 characters'));
      return;
    }
    if (newPassword !== confirmPassword) {
      setPwError(t('passwords_dont_match', 'Passwords do not match'));
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/user/change-password', {
        method: 'POST',
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      if (res.ok) {
        toast.show(t('password_changed', 'Password changed successfully'), 'success');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setTab('info');
      } else {
        const msg = await res.text();
        setPwError(msg || t('password_change_failed', 'Failed to change password'));
      }
    } catch (e) {
      setPwError(t('error_occurred', 'An error occurred'));
    } finally {
      setLoading(false);
    }
  }, [currentPassword, newPassword, confirmPassword, fetch, toast, t]);

  const [imgError, setImgError] = useState(false);

  // Avatar display
  const initials = (user?.name || user?.email || 'U').charAt(0).toUpperCase();
  const dbPicture = profile?.picture?.path || profile?.picture;
  const avatarUrl = !imgError ? (dbPicture || (user?.email ? `https://unavatar.io/${user.email}?fallback=false` : null)) : null;
  
  const displayCompany = profile?.company || (user as any)?.company || extractDomainCompany(user?.email);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Avatar button */}
      <button
        onClick={() => setOpen(!open)}
        className="relative w-[36px] h-[36px] rounded-full overflow-hidden border-2 transition-all hover:scale-105 focus:outline-none"
        style={{borderColor: open ? '#7C3AED' : 'rgba(124,58,237,0.3)'}}
        title={t('profile', 'Profile')}
      >
        {avatarUrl ? (
          <SafeImage
            src={avatarUrl}
            alt={user?.name || 'User'}
            width={36}
            height={36}
            className="w-full h-full object-cover"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white text-sm font-bold"
            style={{background: 'linear-gradient(135deg, #7C3AED, #4F46E5)'}}>
            {initials}
          </div>
        )}
        {/* Online indicator */}
        <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-newBgColorInner" />
      </button>

      {/* Dropdown panel */}
      {open && (
        <div
          className="absolute start-[calc(100%+15px)] bottom-0 w-[320px] rounded-2xl border border-newBorder shadow-2xl z-[500] overflow-hidden bg-newBgColorInner"
          style={{
            boxShadow: '0 25px 50px rgba(0,0,0,0.1), 0 0 0 1px rgba(124,58,237,0.1)',
            animation: 'dropdownIn 0.18s ease-out both',
          }}
        >
          {/* Header */}
          <div className="px-5 py-4 border-b border-newBorder">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-purple-500/50 flex-shrink-0 bg-newBgColor">
                {avatarUrl ? (
                  <SafeImage src={avatarUrl} alt="" width={40} height={40} className="w-full h-full object-cover" onError={() => setImgError(true)} />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white font-bold"
                    style={{background: 'linear-gradient(135deg, #7C3AED, #4F46E5)'}}>
                    {initials}
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-newTextColor text-sm truncate">{profile?.name || user?.name || '—'}</div>
                <div className="text-xs text-newTextItemBlur truncate">{user?.email || '—'}</div>
                {displayCompany && (
                  <div className="text-xs text-[#7C3AED] truncate font-medium mt-0.5">{displayCompany}</div>
                )}
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-newBorder">
            {(['info', 'password'] as const).map((t_) => (
              <button
                key={t_}
                onClick={() => setTab(t_)}
                className={`flex-1 py-2.5 text-xs font-medium transition-colors ${tab === t_ ? 'text-[#7C3AED] border-b-2 border-[#7C3AED]' : 'text-newTextItemBlur hover:text-newTextColor'}`}
              >
                {t_ === 'info' ? t('profile_info', 'Profile Info') : t('change_password', 'Change Password')}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="p-4">
            {tab === 'info' && (
              <div className="space-y-3">
                <InfoRow label={t('label_email', 'Email')} value={user?.email} />
                <InfoRow label={t('full_name', 'Name')} value={profile?.name || user?.name} />
                <InfoRow label={t('label_company', 'Company')} value={displayCompany} />
                <InfoRow label={t('role', 'Role')} value={user?.role} />
              </div>
            )}

            {tab === 'password' && (
              <div className="space-y-3">
                {pwError && (
                  <div className="text-xs text-red-500 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                    {pwError}
                  </div>
                )}
                <PasswordInput
                  label={t('current_password', 'Current Password')}
                  value={currentPassword}
                  onChange={setCurrentPassword}
                />
                <PasswordInput
                  label={t('new_password', 'New Password')}
                  value={newPassword}
                  onChange={setNewPassword}
                />
                <PasswordInput
                  label={t('confirm_password', 'Confirm Password')}
                  value={confirmPassword}
                  onChange={setConfirmPassword}
                />
                <button
                  onClick={changePassword}
                  disabled={loading}
                  className="w-full py-2.5 rounded-lg text-sm font-semibold text-white transition-all hover:opacity-90 disabled:opacity-50 mt-1 shadow-sm"
                  style={{background: 'linear-gradient(135deg, #7C3AED, #4F46E5)'}}
                >
                  {loading ? t('saving', 'Saving...') : t('update_password', 'Update Password')}
                </button>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-4 pb-4 border-t border-newBorder pt-3">
            <LogoutComponent />
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{__html:`
        @keyframes dropdownIn {
          from { opacity: 0; transform: translateY(-8px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}} />
    </div>
  );
};

const InfoRow: FC<{label: string; value?: string | null}> = ({label, value}) => (
  <div className="flex items-start gap-2 p-2.5 rounded-lg bg-newBgColor border border-newBorder transition-colors hover:bg-newBgLineColor">
    <span className="text-xs text-newTextItemBlur min-w-[70px] flex-shrink-0 font-medium">{label}</span>
    <span className="text-xs text-newTextColor break-all">{value || '—'}</span>
  </div>
);

const PasswordInput: FC<{label: string; value: string; onChange: (v: string) => void}> = ({label, value, onChange}) => (
  <div>
    <label className="text-xs text-newTextItemBlur mb-1 block font-medium">{label}</label>
    <input
      type="password"
      value={value}
      onChange={e => onChange(e.target.value)}
      className="w-full px-3 py-2 rounded-lg text-sm text-newTextColor border border-newBorder bg-newBgColor focus:outline-none focus:border-[#7C3AED] focus:ring-1 focus:ring-[#7C3AED] transition-all"
      autoComplete="new-password"
    />
  </div>
);
