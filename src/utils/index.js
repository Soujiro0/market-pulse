// src/utils/index.js

export function formatMoney(amount) {
    const str = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(Math.abs(amount));
    return amount < 0 ? `-${str}` : str;
}
