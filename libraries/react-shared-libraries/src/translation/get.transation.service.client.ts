'use client';

import i18next from './i18next';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { UseTranslationOptions } from 'react-i18next/index';
import { useVariables } from '@gitroom/react/helpers/variable.context';

export function useT(ns?: string, options?: UseTranslationOptions<any>) {
  const { language } = useVariables();
  const translationOptions = useMemo(
    () => ({
      ...options,
      lng: options?.lng || language || undefined,
    }),
    [language, options]
  );
  const { t } = useTranslation(ns, translationOptions);
  return t;
}

export function useTranslationSettings() {
  const [savedI18next, setSavedI18next] = useState(i18next);

  return savedI18next;
}
