/**
 * Formatters for Numbers, Currency, and Dates
 * Used globally across tables, charts, and metrics.
 */

export const formatCurrency = (amount: number, currency: string = 'INR', locale: string = 'en-IN') => {
    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
    }).format(amount);
};

export const formatNumber = (num: number, locale: string = 'en-IN') => {
    return new Intl.NumberFormat(locale).format(num);
};

export const formatCompactNumber = (num: number, locale: string = 'en-IN') => {
    return new Intl.NumberFormat(locale, {
        notation: 'compact',
        compactDisplay: 'short'
    }).format(num);
};

export const formatDate = (dateInput: string | Date, includeTime: boolean = false) => {
    if (!dateInput) return '';
    const date = new Date(dateInput);
    
    const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    };

    if (includeTime) {
        options.hour = '2-digit';
        options.minute = '2-digit';
    }

    return new Intl.DateTimeFormat('en-IN', options).format(date);
};

export const formatPercentage = (value: number, decimals: number = 1) => {
    return new Intl.NumberFormat('en-IN', {
        style: 'percent',
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
    }).format(value / 100);
};
