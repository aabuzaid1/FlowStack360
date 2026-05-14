'use client';
import i18next from './i18next';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useVariables } from "../helpers/variable.context";
export function useT(ns, options) {
    const { language } = useVariables();
    const translationOptions = useMemo(() => ({
        ...options,
        lng: (options === null || options === void 0 ? void 0 : options.lng) || language || undefined,
    }), [language, options]);
    const { t } = useTranslation(ns, translationOptions);
    return t;
}
export function useTranslationSettings() {
    const [savedI18next, setSavedI18next] = useState(i18next);
    return savedI18next;
}
//# sourceMappingURL=get.transation.service.client.js.map
