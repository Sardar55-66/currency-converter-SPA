import currenciesData from './currencies.json';

export interface CurrencyData {
    name: string;
    symbol: string;
    symbolNative: string;
    decimalDigits: number;
    rounding: number;
    code: string;
    namePlural: string;
    countryCodeISO2: string;
    flagSrc: string;
}

export { currenciesData };
