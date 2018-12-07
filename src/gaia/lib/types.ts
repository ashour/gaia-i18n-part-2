export interface StringToStringMap { [key: string]: string }

export interface PluralTranslation {
    plural: StringToStringMap
}

export interface FormattedTranslation {
    format: string
    [key: string]: string | DateFormatOptions
}

export interface DateFormatOptions {
    [key: string]: string | boolean
}

export interface Translations {
    [key: string]:
    string |
    PluralTranslation |
    FormattedTranslation
}

export interface TranslationReplacements {
    [key: string]: string | number | Date
}
