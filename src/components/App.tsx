import React, { Component } from 'react';

import './App.css';
import Cart from './Cart';
import gaia, { t } from '../gaia/gaia';
import i18nConfig from '../config/i18n';
import SelectLanguage from './SelectLanguage';

class App extends Component {
    state = {
        locale: 'en',
        isLocaleDetermined: false,
    }

    componentDidMount() {
        const { supportedLocales } = i18nConfig;

        this.setDirection(this.state.locale);

        gaia
            .init({
                supportedLocales: Object.keys(supportedLocales),
                locale: this.state.locale,
            })
            .then((locale) => {
                this.setState({ locale, isLocaleDetermined: true });
            });
    }

    onSelectLocale = (newLocale: string) => {
        this.setState({ isLocaleDetermined: false }, () => {
            gaia.setLocale(newLocale)
                .then(() => {
                    this.setDirection(newLocale);

                    return this.setState({
                        locale: newLocale,
                        isLocaleDetermined: true
                    });
                });
        });
    }

    setDirection(locale: string) {
        if (locale.indexOf('ar') === 0) {
            window.document.dir = 'rtl';
        } else {
            window.document.dir = 'ltr';
        }
    }

    renderHeader() {
        return (
            <header className="App__Header">
                <h1>{t('title')}</h1>

                <SelectLanguage
                    value={this.state.locale}
                    onChange={this.onSelectLocale}
                />
            </header>
        );
    }

    renderLead() {
        return (
            <div className="App__Header">
                <p className="App__Lead__Start">
                    {t('lead', { name: 'Adam' })}
                    {' '}
                    ({t('item_count', { count: 7 })})
                </p>

                <p className="App__Lead__End">
                    {t('updated', {
                        updatedAt: new Date('January 1 2019'),
                    })}
                </p>
            </div >
        );
    }

    renderFooter() {
        return (
            <p className="App__Footer">{t('footer')}</p>
        );
    }

    renderContent() {
        return (
            <>
                {this.renderHeader()}

                {this.renderLead()}

                <Cart />

                {this.renderFooter()}
            </>
        );
    }

    renderLoader() {
        return <p>Loading...</p>;
    }

    render() {
        return (
            <div className="App">
                {this.state.isLocaleDetermined ?
                    this.renderContent() :
                    this.renderLoader()
                }
            </div>
        );
    }
}

export default App;
