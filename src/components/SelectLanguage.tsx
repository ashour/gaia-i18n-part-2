import React from 'react';

import gaia from '../gaia/gaia';
import i18nConfig from '../config/i18n';

function renderOption(value: string, label: string) {
    return (<option key={value} value={value}>{label}</option>);
}

interface SelectLanuageProps {
    value: string;
    onChange(value: string): void;
}

function SelectLanguage(props: SelectLanuageProps) {
    return (
        <select
            value={props.value}
            onChange={e => props.onChange(e.target.value)}
        >
            {
                gaia.supportedLocales.map((key) => {
                    return renderOption(key, i18nConfig.supportedLocales[key]);
                })
            }
        </select>
    );
}

export default SelectLanguage;
