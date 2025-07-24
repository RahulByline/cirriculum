import React from 'react';
import { DollarSign } from 'lucide-react';

interface CurrencySelectorProps {
  selectedCurrency: string;
  onCurrencyChange: (currency: string) => void;
  exchangeRates: Record<string, number>;
}

const CurrencySelector: React.FC<CurrencySelectorProps> = ({
  selectedCurrency,
  onCurrencyChange,
  exchangeRates
}) => {
  const currencies = [
    { code: 'USD', symbol: '$', name: 'US Dollar' },
    { code: 'EUR', symbol: '€', name: 'Euro' },
    { code: 'GBP', symbol: '£', name: 'British Pound' },
    { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
    { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
    { code: 'AED', symbol: 'د.إ', name: 'UAE Dirham' },
    { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
    { code: 'INR', symbol: '₹', name: 'Indian Rupee' }
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <div className="flex items-center space-x-2 mb-3">
        <DollarSign className="w-5 h-5 text-gray-600" />
        <h3 className="text-lg font-semibold text-gray-900">Currency</h3>
      </div>
      
      <select
        value={selectedCurrency}
        onChange={(e) => onCurrencyChange(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      >
        {currencies.map(currency => (
          <option key={currency.code} value={currency.code}>
            {currency.symbol} {currency.name} ({currency.code})
          </option>
        ))}
      </select>
      
      {selectedCurrency !== 'USD' && (
        <p className="text-xs text-gray-600 mt-2">
          Exchange rate: 1 USD = {exchangeRates[selectedCurrency]?.toFixed(4)} {selectedCurrency}
        </p>
      )}
    </div>
  );
};

export default CurrencySelector;