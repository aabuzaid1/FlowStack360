'use client';
import { __rest } from "tslib";
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import i18next from 'i18next';
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
});
export const VariableContextComponent = (props) => {
    const { children } = props, otherProps = __rest(props, ["children"]);
    const [language, setLanguage] = useState(otherProps.language);
    const contextValue = useMemo(() => ({
        ...otherProps,
        language,
    }), [otherProps, language]);
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
        const handleLanguageChanged = (lng) => {
            setLanguage(lng);
        };
        i18next.on('languageChanged', handleLanguageChanged);
        return () => {
            i18next.off('languageChanged', handleLanguageChanged);
        };
    }, []);
    return (<VariableContext.Provider value={contextValue}>
      {children}
    </VariableContext.Provider>);
};
export const useVariables = () => {
    return useContext(VariableContext);
};
export const loadVars = () => {
    // @ts-ignore
    return window.vars;
};
//# sourceMappingURL=variable.context.js.map
