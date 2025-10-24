import React, { useState, useEffect, useRef } from 'react';
import { currenciesData } from '../../data';
import { AVAILABLE_CURRENCIES } from '../../constants';
import './CurrencyModal.scss';

interface CurrencyModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelectCurrency: (currency: string) => void;
    selectedCurrency?: string;
}

export const CurrencyModal: React.FC<CurrencyModalProps> = ({
    isOpen,
    onClose,
    onSelectCurrency,
    selectedCurrency
}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(0);
    const searchInputRef = useRef<HTMLInputElement>(null);
    const currencyListRef = useRef<HTMLDivElement>(null);

    const filteredCurrencies = currenciesData.filter(currency =>
        AVAILABLE_CURRENCIES.includes(currency.code as any) && (
            currency.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
            currency.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

    const handleCurrencySelect = (currencyCode: string) => {
        onSelectCurrency(currencyCode);
        onClose();
    };

    // Keyboard navigation
    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            switch (e.key) {
                case 'Escape':
                    onClose();
                    break;
                case 'ArrowDown':
                    e.preventDefault();
                    setSelectedIndex(prev =>
                        prev < filteredCurrencies.length - 1 ? prev + 1 : 0
                    );
                    break;
                case 'ArrowUp':
                    e.preventDefault();
                    setSelectedIndex(prev =>
                        prev > 0 ? prev - 1 : filteredCurrencies.length - 1
                    );
                    break;
                case 'Enter':
                    e.preventDefault();
                    if (filteredCurrencies[selectedIndex]) {
                        handleCurrencySelect(filteredCurrencies[selectedIndex].code);
                    }
                    break;
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        // Focus search input when modal opens
        if (searchInputRef.current) {
            searchInputRef.current.focus();
        }

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen, filteredCurrencies, selectedIndex, onClose, onSelectCurrency]);

    // Reset selected index when search changes
    useEffect(() => {
        setSelectedIndex(0);
    }, [searchTerm]);

    // Scroll selected item into view
    useEffect(() => {
        if (currencyListRef.current && filteredCurrencies[selectedIndex]) {
            const selectedElement = currencyListRef.current.children[selectedIndex] as HTMLElement;
            if (selectedElement) {
                selectedElement.scrollIntoView({ block: 'nearest' });
            }
        }
    }, [selectedIndex, filteredCurrencies]);

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="currency-modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2 className="modal-title">Select currency</h2>
                    <button className="close-button" onClick={onClose}>
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <path d="M15 5L5 15M5 5L15 15" stroke="#0A0A0A" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                    </button>
                </div>

                <p className="modal-description">
                    Choose a currency from the list below or use the search bar to find a specific currency.
                </p>

                <div className="search-container">
                    <div className="search-input">
                        <svg className="search-icon" width="18" height="18" viewBox="0 0 18 18" fill="none">
                            <path d="M8.25 15C11.9782 15 15 11.9782 15 8.25C15 4.52179 11.9782 1.5 8.25 1.5C4.52179 1.5 1.5 4.52179 1.5 8.25C1.5 11.9782 4.52179 15 8.25 15Z" stroke="#737373" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M16.5 16.5L12.4875 12.4875" stroke="#737373" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <input
                            type="text"
                            placeholder="Search currencies..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="search-field"
                            ref={searchInputRef}
                        />
                    </div>
                </div>

                <div className="currency-list" ref={currencyListRef}>
                    {filteredCurrencies.map((currency, index) => (
                        <div
                            key={currency.code}
                            className={`currency-option ${selectedCurrency === currency.code ? 'selected' : ''
                                } ${index === selectedIndex ? 'keyboard-selected' : ''
                                }`}
                            onClick={() => handleCurrencySelect(currency.code)}
                        >
                            <div className="currency-info">
                                <div className="currency-symbol-badge">
                                    <span className="currency-symbol">{currency.symbolNative}</span>
                                </div>
                                <div className="currency-details">
                                    <div className="currency-code">{currency.code}</div>
                                    <div className="currency-name">{currency.name}</div>
                                </div>
                            </div>
                            {selectedCurrency === currency.code && (
                                <svg className="check-icon" width="18" height="18" viewBox="0 0 18 18" fill="none">
                                    <path d="M7.5 12L4.5 9L3 10.5L7.5 15L15 7.5L13.5 6L7.5 12Z" fill="#1447E6" />
                                </svg>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};