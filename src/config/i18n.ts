interface I18nConfig {
    supportedLocales: {
        [key: string]: string;
    };

    fallbackLocale: string;
}

const i18nConfig: I18nConfig = {
    supportedLocales: {
        ar_EG: 'عربي',
        fr: 'Français',
        en: 'English',
    },

    fallbackLocale: 'fr',
};

export default i18nConfig;
