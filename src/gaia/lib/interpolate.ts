import { TranslationReplacements } from "./types";

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

let _placeholderRegExp: RegExp;
function getPlaceholderRegexp(): RegExp {
    if (_placeholderRegExp === undefined) {
        _placeholderRegExp = new RegExp('\{\s*([^{}]+?)\s*\}', 'mg');
    }

    return _placeholderRegExp;
}
