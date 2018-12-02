import load from './lib/load';
import resolveUserLocale from './lib/user-locale';
import { interpolateSimple } from './lib/interpolate';
import { normalize, containsNormalized } from './lib/util';
import { Translations, TranslationReplacements } from './lib/types';

let _locale: string;
let _translations: Translations;
let _supportedLocales: ReadonlyArray<string>;

const gaia = {
    /**
     * Intialize the library.
     *
     * @param options.supportedLocales locales the app supports
     * @param options.locale initial locale, defaults to the browser locale
     * @param options.fallbackLocale locale to use if `options.locale` is not
     *        provided and we cannot determine the browser locale
     * @returns Promise<string>
     */
    init(options: {
        supportedLocales: string[],
        locale?: string,
        fallbackLocale?: string,
    }): Promise<string> {
        return new Promise((resolve, reject) => {
            if (!options.supportedLocales ||
                options.supportedLocales.length === 0
            ) {
                return reject(new Error(
                    'No supported locales given. Please provide ' +
                    'supported locales.'
                ));
            }

            _supportedLocales = Object.freeze(
                options.supportedLocales.map(normalize)
            );

            if (options.fallbackLocale &&
                !gaia.isSupported(options.fallbackLocale)
            ) {
                return reject(new Error(
                    `Fallback locale ${options.fallbackLocale} is not in ` +
                    'supported locales given: ' +
                    `[${_supportedLocales.join(', ')}].`
                ));
            }

            if (options.locale) {
                _locale = options.locale;
            } else {
                _locale = resolveUserLocale(_supportedLocales) ||
                    options.fallbackLocale ||
                    _supportedLocales[0];
            }

            return loadAndSet(_locale).then(() => resolve(_locale));
        });
    },

    /**
     * Normalized array of given supported locales
     * e.g. `['en-us', 'ar', 'fr']`.
     */
    get supportedLocales(): ReadonlyArray<string> {
        return _supportedLocales;
    },

    /**
     * Check if the given locale is supported.
     *
     * @param locale The locale to check.
     */
    isSupported(locale: string): boolean {
        return containsNormalized(gaia.supportedLocales, locale);
    },


    /**
     * The current locale code e.g. 'en-us'
     */
    get locale() { return _locale; },

    /**
     * Set the current locale, reloading translations.
     *
     * @param locale The locale to set.
     */
    setLocale(locale: string): Promise<void> {
        return loadAndSet(locale);
    },

    /**
     * Retrieve a string translated to the current locale.
     *
     * @param key - index of translation to retrieve
     * @param replacements - key-value pairs of interpolation replacements.
     * @returns the translation if found, or the given `key` as
     *          a fallback
     */
    t(key: string, replacements?: TranslationReplacements): string {
        const translated = _translations[key] || key;

        if (replacements === undefined || Object.keys(replacements).length === 0) {
            return translated;
        }

        return interpolateSimple(translated, replacements);
    },
};

export default gaia;

export const t = gaia.t;

// Private
function loadAndSet(locale: string): Promise<void> {
    return new Promise((resolve, reject) => {
        if (!gaia.isSupported(locale)) {
            return reject(new Error(`Locale ${locale} is not in supported ` +
                `locales given: [${_supportedLocales.join(', ')}].`));
        }

        const normalizedLocale = normalize(locale);

        return load(normalizedLocale).then((json) => {
            _locale = normalizedLocale;
            _translations = json;

            return resolve();
        });
    });
}
