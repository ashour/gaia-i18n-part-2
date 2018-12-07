import {
    DateFormatOptions,
    StringToStringMap,
    FormattedTranslation,
    TranslationReplacements,
} from "./types";

export function interpolateSimple(
    source: string,
    replacements: TranslationReplacements,
): string {
    const placeholderRegexp = getPlaceholderRegexp();

    let interpolated = source;

    let currentMatch = placeholderRegexp.exec(source);

    while (currentMatch !== null) {
        const [placeholder, replacementKey] = currentMatch;

        const replacement = replacements[replacementKey.trim()];

        if (replacement !== undefined) {
            interpolated = interpolated.replace(placeholder, replacement.toString());
        }

        currentMatch = placeholderRegexp.exec(source);
    }

    return interpolated;
}

export function interpolatePlural(
    definition: StringToStringMap,
    replacements: TranslationReplacements,
): string | undefined {
    const count: number = replacements.count as number;

    const countForms = Object.keys(definition);

    let match: string | undefined;

    for (let i = 0; i < countForms.length; i += 1) {
        const form = countForms[i];

        // exact match
        if (parseInt(form, 10) === count) {
            match = form;
            break;
        }

        // range match e.g. "3-11"
        if (form.includes('-')) {
            const [min, max] = form.split('-').map(n => parseInt(n, 10));

            if (min <= count && count <= max) {
                match = form;
                break;
            }
        }

        // greater than or equal to match e.g. "2+"
        if (form.includes('+') && count >= parseInt(form, 10)) {
            match = form;
            break;
        }
    }

    if (match !== undefined) {
        return interpolateSimple(definition[match], replacements);
    }
}

export function interpolateFormatted(
    definition: FormattedTranslation,
    replacements: TranslationReplacements,
    locale: string,
): string {
    const placeholderRegexp = getPlaceholderRegexp();

    const source = definition.format;

    let interpolated = definition.format;

    let currentMatch = placeholderRegexp.exec(source);

    while (currentMatch !== null) {
        const [placeholder, compositeKey] = currentMatch;

        const compositeKeyParts = compositeKey.trim().split(':');

        if (compositeKeyParts.length === 2) {
            const [replacementKey, type] = compositeKeyParts;

            if (type === 'date') {
                const options =
                    definition[replacementKey] as
                    DateFormatOptions;

                const date =
                    replacements[replacementKey] as Date;

                if (date !== undefined && options !== undefined) {
                    const format = new Intl.DateTimeFormat(locale, options)
                        .format(date);

                    interpolated = interpolated.replace(placeholder, format);
                }
            } else if (type === 'currency') {
                const currency = definition[replacementKey] as string;

                const amount = replacements[replacementKey] as number;

                const options = { style: 'currency', currency };

                const format = new Intl.NumberFormat(locale, options)
                    .format(amount);

                if (amount !== undefined && currency !== undefined) {
                    interpolated = interpolated.replace(placeholder, format);
                }
            }
        }

        currentMatch = placeholderRegexp.exec(source);
    }

    return interpolateSimple(interpolated, replacements);
}

let _placeholderRegExp: RegExp;
function getPlaceholderRegexp(): RegExp {
    if (_placeholderRegExp === undefined) {
        _placeholderRegExp = new RegExp('\{\s*([^{}]+?)\s*\}', 'g');
    }

    return _placeholderRegExp;
}
