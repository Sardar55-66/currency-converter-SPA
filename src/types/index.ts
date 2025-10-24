// API Response Types
export interface ExchangeRatesResponse {
    base: string;
    date: string;
    rates: Record<string, number>;
}

// Currency Types
export interface Currency {
    code: string;
    name: string;
    symbol: string;
}

// Conversion Types
export interface ConversionResult {
    fromCurrency: string;
    toCurrency: string;
    amount: number;
    result: number;
    rate: number;
    timestamp: number;
}

// Cache Types
export interface CachedRates {
    rates: Record<string, number>;
    base: string;
    timestamp: number;
    date: string;
}

// App State Types
export interface AppState {
    fromCurrency: string;
    toCurrency: string;
    amount: string;
    result: number | null;
    isLoading: boolean;
    error: string | null;
    isOnline: boolean;
    lastUpdated: number | null;
}

// Network Status
export type NetworkStatus = 'online' | 'offline';

// Error Types
export interface ApiError {
    message: string;
    code?: string;
    status?: number;
}

// Modal Types
export interface CurrencyModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (currency: string) => void;
    selectedCurrency?: string;
    title: string;
}

// Component Props Types
export interface CurrencySelectorProps {
    currency: string;
    onCurrencyChange: (currency: string) => void;
    label: string;
    disabled?: boolean;
}

export interface AmountInputProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    disabled?: boolean;
}

export interface ConversionDisplayProps {
    result: number | null;
    fromCurrency: string;
    toCurrency: string;
    amount: number;
    isLoading: boolean;
    error: string | null;
    lastUpdated: number | null;
    isOnline: boolean;
}

