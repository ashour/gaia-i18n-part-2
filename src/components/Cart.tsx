import React, { Component } from 'react';

import { t } from '../gaia/gaia';
import './Cart.css';

class Cart extends Component {
    render() {
        return (
            <table className="Cart">
                <thead>
                    <tr>
                        <th style={{ textAlign: 'start' }}>{t('Item')}</th>
                        < th style={{ textAlign: 'right' }}>{t('Quantity')}</th>
                        <th style={{ textAlign: 'right' }}>{t('Price')}</th>
                        <th style={{ textAlign: 'right' }}>{t('Subtotal')}</th>
                    </tr>
                </thead>

                <tbody>
                    <tr>
                        <td style={{ textAlign: 'start' }}>Under-inflated balloons</td>
                        <td style={{ textAlign: 'right' }}>2</td>
                        <td style={{ textAlign: 'right' }}>
                            {t('price', { price: 2.99 })}
                        </td>
                        <td style={{ textAlign: 'right' }}>
                            {t('price', { price: 5.98 })}
                        </td>
                    </tr>

                    <tr>
                        <td style={{ textAlign: 'start' }}>Over-priced smartphone</td>
                        <td style={{ textAlign: 'right' }}>1</td>
                        <td style={{ textAlign: 'right' }}>
                            {t('price', { price: 2299.99 })}
                        </td>
                        <td style={{ textAlign: 'right' }}>
                            {t('price', { price: 2299.99 })}
                        </td>
                    </tr>

                    <tr>
                        <td style={{ textAlign: 'start' }}>Diamond-studded selfie stick</td>
                        <td style={{ textAlign: 'right' }}>4</td>
                        <td style={{ textAlign: 'right' }}>
                            {t('price', { price: 284.99 })}
                        </td>
                        <td style={{ textAlign: 'right' }}>
                            {t('price', { price: 1139.96 })}
                        </td>
                    </tr>
                </tbody>
            </table>
        );
    }
}

export default Cart;