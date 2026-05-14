'use client';

import {
  createContext,
  FC,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import i18next from 'i18next';
interface VariableContextInterface {
  stripeClient: string;
  billingEnabled: boolean;
  isGeneral: boolean;
  genericOauth: boolean;
  oauthLogoUrl: string;
  oauthDisplayName: string;
  mcpUrl?: string;
  cloudflareUrl: string;
  mainUrl: string;
  frontEndUrl: string;
  plontoKey: string;
  storageProvider: 'local' | 'cloudflare' | 'firebase';
  backendUrl: string;
  environment: string;
  discordUrl: string;
  uploadDirectory: string;
  facebookPixel: string;
  telegramBotName: string;
  neynarClientId: string;
  isSecured: boolean;
  disableImageCompression: boolean;
  disableXAnalytics: boolean;
  language: string;
  dub: boolean;
  transloadit: string[];
  sentryDsn: string;
  extensionId: string;
}
const VariableContext = createContext({
  stripeClient: '',
  billingEnabled: false,
  isGeneral: true,
  genericOauth: false,
  oauthLogoUrl: '',
  oauthDisplayName: '',
  mcpUrl: '',
  cloudflareUrl: '',
  mainUrl: '',
  frontEndUrl: '',
  storageProvider: 'local',
  plontoKey: '',
  backendUrl: '',
  discordUrl: '',
  uploadDirectory: '',
  isSecured: false,
  telegramBotName: '',
  facebookPixel: '',
  neynarClientId: '',
  disableImageCompression: false,
  disableXAnalytics: false,
  language: '',
  dub: false,
  transloadit: [],
  sentryDsn: '',
  extensionId: '',
} as VariableContextInterface);
export const VariableContextComponent: FC<
  VariableContextInterface & {
    children: ReactNode;
  }
> = (props) => {
  const { children, ...otherProps } = props;
  const [language, setLanguage] = useState(otherProps.language);
  const contextValue = useMemo(
    () => ({
      ...otherProps,
      language,
    }),
    [otherProps, language]
  );

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // @ts-ignore
      window.vars = contextValue;
    }
  }, [contextValue]);

  useEffect(() => {
    setLanguage(otherProps.language);
  }, [otherProps.language]);

  useEffect(() => {
    const handleLanguageChanged = (lng: string) => {
      setLanguage(lng);
    };

    i18next.on('languageChanged', handleLanguageChanged);
    return () => {
      i18next.off('languageChanged', handleLanguageChanged);
    };
  }, []);

  return (
    <VariableContext.Provider value={contextValue}>
      {children}
    </VariableContext.Provider>
  );
};
export const useVariables = () => {
  return useContext(VariableContext);
};
export const loadVars = () => {
  // @ts-ignore
  return window.vars as VariableContextInterface;
};
