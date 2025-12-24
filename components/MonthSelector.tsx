
import React, { useState } from 'react';
import { Stock, Commodity } from '../types';
import { MONTHS_TAMIL, COMMODITY_NAMES, COMMODITIES, VIEWS } from '../constants';
import { getInitialStock } from '../utils/calculator';

interface MonthSelectorProps {
  onMonthSelect: (month: number, year: number, openingBalances: Stock) => void;
}

const MonthSelector: React.FC<MonthSelectorProps> = ({ onMonthSelect }) => {
  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState(currentYear);
  const [month, setMonth] = useState(new Date().getMonth());
  const [primaryOpeningBalances, setPrimaryOpeningBalances] = useState<Stock>(getInitialStock());
  const [upperPrimaryOpeningBalances, setUpperPrimaryOpeningBalances] = useState<Stock>(getInitialStock());

  const handleBalanceChange = (category: 'primary' | 'upperPrimary', commodity: Commodity, value: string) => {
    const numericValue = parseFloat(value) || 0;
    if (category === 'primary') {
        setPrimaryOpeningBalances(prev => ({ ...prev, [commodity]: numericValue }));
    } else {
        setUpperPrimaryOpeningBalances(prev => ({ ...prev, [commodity]: numericValue }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const totalOpeningBalances = getInitialStock();
    COMMODITIES.forEach(commodity => {
        totalOpeningBalances[commodity] = (primaryOpeningBalances[commodity] || 0) + (upperPrimaryOpeningBalances[commodity] || 0);
    });
    onMonthSelect(month, year, totalOpeningBalances);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-700">{VIEWS.month_selection}</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 border rounded-lg bg-slate-50">
          <div>
            <label htmlFor="month" className="block text-lg font-medium text-gray-700">மாதம்</label>
            <select
              id="month"
              value={month}
              onChange={e => setMonth(parseInt(e.target.value))}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            >
              {MONTHS_TAMIL.map((m, i) => (
                <option key={i} value={i}>{m}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="year" className="block text-lg font-medium text-gray-700">ஆண்டு</label>
            <input
              type="number"
              id="year"
              value={year}
              onChange={e => setYear(parseInt(e.target.value))}
              className="mt-1 block w-full pl-3 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              min="2020"
              max="2030"
            />
          </div>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-4 text-center text-gray-700">மாதத்தின் முதல் நாள் இருப்பு</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Primary Students Inputs */}
            <div className="p-4 border rounded-lg bg-slate-50">
              <h4 className="text-lg font-bold mb-3 text-center text-blue-700">வகுப்பு 1-5</h4>
              <div className="space-y-3">
                {COMMODITIES.map(commodity => (
                  <div key={`primary-${commodity}`} className="grid grid-cols-2 items-center gap-2">
                    <label htmlFor={`primary-${commodity}`} className="text-sm font-medium text-gray-600">
                      {COMMODITY_NAMES[commodity].name} ({COMMODITY_NAMES[commodity].unit})
                    </label>
                    <input
                      type="number"
                      id={`primary-${commodity}`}
                      step="0.001"
                      min="0"
                      value={primaryOpeningBalances[commodity]}
                      onChange={e => handleBalanceChange('primary', commodity, e.target.value)}
                      className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Upper Primary Students Inputs */}
            <div className="p-4 border rounded-lg bg-slate-50">
                <h4 className="text-lg font-bold mb-3 text-center text-blue-700">வகுப்பு 6-8</h4>
                <div className="space-y-3">
                {COMMODITIES.map(commodity => (
                  <div key={`upperPrimary-${commodity}`} className="grid grid-cols-2 items-center gap-2">
                    <label htmlFor={`upperPrimary-${commodity}`} className="text-sm font-medium text-gray-600">
                      {COMMODITY_NAMES[commodity].name} ({COMMODITY_NAMES[commodity].unit})
                    </label>
                    <input
                      type="number"
                      id={`upperPrimary-${commodity}`}
                      step="0.001"
                      min="0"
                      value={upperPrimaryOpeningBalances[commodity]}
                      onChange={e => handleBalanceChange('upperPrimary', commodity, e.target.value)}
                      className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="text-center pt-4">
          <button
            type="submit"
            className="w-full md:w-auto inline-flex justify-center py-3 px-6 border border-transparent shadow-sm text-lg font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            பதிவேட்டைத் தொடங்கு
          </button>
        </div>
      </form>
    </div>
  );
};
export default MonthSelector;
