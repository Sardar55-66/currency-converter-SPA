import React, { useState, useEffect, useMemo } from 'react';
import { useRatesContext } from '../../context/RatesProvider';
import { useDebounced } from '../../hooks/useDebounced';
import { ClockIcon } from '../Common/ClockIcon';
import { NetworkOnlineIcon } from '../Common/NetworkOnlineIcon';
import { NetworkOfflineIcon } from '../Common/NetworkOfflineIcon';
import { RefreshIcon } from '../Common/RefreshIcon';
import { SwapIcon } from '../Common/SwapIcon';
import { CurrencyModal } from '../CurrencyModal';
import { Skeleton } from '../Common/Skeleton';
import { currenciesData } from '../../data';
import { convertCurrency, getExchangeRate, formatCurrencyAmount, formatNumber, loadFromStorage, saveToStorage } from '../../utils';
import { AVAILABLE_CURRENCIES, ERROR_MESSAGES, SUCCESS_MESSAGES } from '../../constants';
import { useToast } from '../Common/Toast';
import './ConversionScreen.scss';

export const ConversionScreen: React.FC = () => {
  const { loading, error, lastUpdated, refresh, rates } = useRatesContext();
  const { showError, showSuccess } = useToast();
  const [from, setFrom] = useState<string>('USD');
  const [to, setTo] = useState<string>('EUR');
  const [amountRaw, setAmountRaw] = useState<string>('1');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedField, setSelectedField] = useState<'from' | 'to' | null>(null);

  // Show toast notifications based on rates state
  useEffect(() => {
    if (rates && !loading && !error) {
      showSuccess(SUCCESS_MESSAGES.RATES_UPDATED);
    } else if (error) {
      showError(ERROR_MESSAGES.API_ERROR);
    }
  }, [rates, loading, error, showSuccess, showError]);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    const validPattern = /^[0-9.,]*$/;

    if (validPattern.test(value)) {
      const dotCount = (value.match(/\./g) || []).length;
      const commaCount = (value.match(/,/g) || []).length;

      if (dotCount <= 1 && commaCount <= 1 && (dotCount + commaCount) <= 1) {
        setAmountRaw(value);
      } else {
        showError(ERROR_MESSAGES.INVALID_AMOUNT);
      }
    } else {
      showError(ERROR_MESSAGES.INVALID_AMOUNT);
    }
  };

  // Handle key press for additional validation
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const char = e.key;

    // Allow numbers, dots, commas, and control keys
    const allowedKeys = /^[0-9.,]$/;
    const controlKeys = ['Backspace', 'Delete', 'Tab', 'Enter', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'];

    if (!allowedKeys.test(char) && !controlKeys.includes(char)) {
      e.preventDefault();
    }
  };

  useEffect(() => {
    const savedFrom = loadFromStorage('lastFromCurrency', 'USD');
    const savedTo = loadFromStorage('lastToCurrency', 'EUR');
    const savedAmount = loadFromStorage('lastAmount', '1');

    setFrom(savedFrom);
    setTo(savedTo);
    setAmountRaw(savedAmount);
  }, []);

  useEffect(() => {
    saveToStorage('lastFromCurrency', from);
  }, [from]);

  useEffect(() => {
    saveToStorage('lastToCurrency', to);
  }, [to]);

  useEffect(() => {
    saveToStorage('lastAmount', amountRaw);
  }, [amountRaw]);

  const amountNormalized = amountRaw.replace(',', '.');
  const amount = parseFloat(amountNormalized || '0');
  const debouncedAmount = useDebounced(amount, 250);

  // Функции для работы с модальным окном
  const openCurrencyModal = (field: 'from' | 'to') => {
    setSelectedField(field);
    setIsModalOpen(true);
  };

  const closeCurrencyModal = () => {
    setIsModalOpen(false);
    setSelectedField(null);
  };

  const handleCurrencySelect = (currencyCode: string) => {
    if (selectedField === 'from') {
      if (currencyCode === to) {
        showError(ERROR_MESSAGES.SAME_CURRENCY);
        return;
      }
      setFrom(currencyCode);
    } else if (selectedField === 'to') {
      if (currencyCode === from) {
        showError(ERROR_MESSAGES.SAME_CURRENCY);
        return;
      }
      setTo(currencyCode);
    }
    closeCurrencyModal();
  };

  // Получение информации о валютах
  const getCurrencyInfo = (code: string) => {
    return currenciesData.find(currency => currency.code === code);
  };

  const fromCurrency = getCurrencyInfo(from);
  const toCurrency = getCurrencyInfo(to);

  // Check if currencies are available in API
  const isFromCurrencyAvailable = AVAILABLE_CURRENCIES.includes(from as any);
  const isToCurrencyAvailable = AVAILABLE_CURRENCIES.includes(to as any);

  // Calculate conversion result
  const conversionResult = useMemo(() => {
    console.log('Calculating conversion result:', {
      rates: !!rates,
      debouncedAmount,
      isFromCurrencyAvailable,
      isToCurrencyAvailable,
      from,
      to
    });

    if (!rates || debouncedAmount <= 0 || !isFromCurrencyAvailable || !isToCurrencyAvailable) {
      return null;
    }

    const result = convertCurrency(debouncedAmount, from, to, rates);
    return result;
  }, [debouncedAmount, from, to, rates, isFromCurrencyAvailable, isToCurrencyAvailable]);

  // Calculate exchange rate
  const exchangeRate = useMemo(() => {
    if (!rates) return null;

    return getExchangeRate(from, to, rates);
  }, [from, to, rates]);

  // Calculate inverse rate
  const inverseRate = useMemo(() => {
    if (!rates) return null;

    return getExchangeRate(to, from, rates);
  }, [from, to, rates]);

  // Format results
  const formattedResult = useMemo(() => {
    if (!conversionResult || !toCurrency) return null;

    return formatCurrencyAmount(conversionResult, to, 'en-US');
  }, [conversionResult, to]);

  const formattedExchangeRate = useMemo(() => {
    if (!exchangeRate) return null;

    return `1 ${from} = ${formatNumber(exchangeRate)} ${to}`;
  }, [exchangeRate, from, to]);

  const formattedInverseRate = useMemo(() => {
    if (!inverseRate) return null;

    return `1 ${to} = ${formatNumber(inverseRate)} ${from}`;
  }, [inverseRate, from, to]);

  return (
    <div className="conversion-screen">

      <div className="status-date-refresh-bar">
        <div className={`network-status ${error || loading ? 'offline' : 'online'}`}>
          {!error && !loading ? (
            <> <NetworkOnlineIcon className="status-icon" />
              <span className="online-status-text">online</span>
            </>
          ) : (
            <> <NetworkOfflineIcon className="status-icon" />
              <span className="offline-status-text">offline</span>
            </>
          )}
        </div>
        <div className="last-update-date">
          <ClockIcon className="clock-icon" />
          <span>Last updated:
            {lastUpdated
              ? new Date(lastUpdated).toLocaleString('ru-RU', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
              })
              : '01.01.2025 12:00:00'
            }
          </span>
        </div>
        <div className="refresh-rates-btn">
          <button onClick={() => refresh()} className="refresh-button">
            <RefreshIcon className="refresh-icon" />
            <span>Refresh rates</span>
          </button>
        </div>
      </div>

      <div className="main-currency-section">
        <div className="currency-converter-section">
          <div className="conversion-screen__amount-section">
            <label>Amount</label>
            <input
              value={amountRaw}
              onChange={handleAmountChange}
              onKeyDown={handleKeyPress}
              inputMode="decimal"
              placeholder="Enter amount"
            />
          </div>
          <div className="conversion-screen__currency-section">
            <div className="currency-field">
              <label>From</label>
              <div className="currency-select" onClick={() => openCurrencyModal('from')}>
                <div className="currency-symbol">{fromCurrency?.symbolNative || '$'}</div>
                <div className="currency-info">
                  <div className="currency-code">{from}</div>
                  <div className="currency-name">{fromCurrency?.name || 'United States Dollar'}</div>
                </div>
              </div>
            </div>

            <button
              onClick={() => { const t = from; setFrom(to); setTo(t); }}
              className="swap-button"
            >
              <SwapIcon className="swap-icon" />
            </button>

            <div className="currency-field">
              <label>To</label>
              <div className="currency-select" onClick={() => openCurrencyModal('to')}>
                <div className="currency-symbol">{toCurrency?.symbolNative || '€'}</div>
                <div className="currency-info">
                  <div className="currency-code">{to}</div>
                  <div className="currency-name">{toCurrency?.name || 'Euro'}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="currency-conversion-result">
          <h3 className="conversion-title">Conversion result</h3>

          <div className="result-value-container">
            {loading ? (
              <Skeleton height="32px" width="120px" className="skeleton-result-value" />
            ) : (
              <div className="result-value">
                {formattedResult || '--'}
              </div>
            )}
            <div className="result-label">{amount} {from} =</div>
          </div>

          <div className="divider"></div>

          <div className="conversion-info">
            <div className="info-row">
              <span className="info-label">Exchange Rate</span>
              {loading ? (
                <Skeleton height="16px" width="180px" className="skeleton-exchange-rate" />
              ) : (
                <span className="info-value">{formattedExchangeRate || '--'}</span>
              )}
            </div>
            <div className="info-row">
              <span className="info-label">Inverse Rate</span>
              {loading ? (
                <Skeleton height="16px" width="180px" className="skeleton-exchange-rate" />
              ) : (
                <span className="info-value">{formattedInverseRate || '--'}</span>
              )}
            </div>
          </div>

          <div className="divider"></div>

          <div className="disclaimer">
            <p>
              {!isFromCurrencyAvailable || !isToCurrencyAvailable ? (
                <>
                  <strong>Warning:</strong> {from} or {to} is not available in the current API.
                  Please select from available currencies: USD, EUR, GBP, JPY, CAD, AUD, CHF, CNY, etc.
                </>
              ) : error ? (
                `Using cached rates from ${lastUpdated && new Date(lastUpdated).toLocaleString('en-US', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}`
              ) : (
                'Rates are for informational purposes only and may not reflect real-time market rates'
              )}
            </p>
          </div>
        </div>
      </div>

      <CurrencyModal
        isOpen={isModalOpen}
        onClose={closeCurrencyModal}
        onSelectCurrency={handleCurrencySelect}
        selectedCurrency={selectedField === 'from' ? from : selectedField === 'to' ? to : undefined}
      />

    </div>
  );
};
