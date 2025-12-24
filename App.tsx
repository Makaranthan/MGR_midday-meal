
import React, { useState, useEffect, useMemo } from 'react';
import { DailyRecord, Stock, View } from './types';
import { COMMODITY_NAMES, VIEWS } from './constants';
import { calculateMonthlyData, getInitialStock } from './utils/calculator';
import MonthSelector from './components/MonthSelector';
import DailyEntry from './components/DailyEntry';
import StockRegister from './components/StockRegister';
import MonthlySummary from './components/MonthlySummary';
import YearlyReport from './components/YearlyReport';
import Header from './components/Header';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(View.MONTH_SELECTION);
  const [selectedDate, setSelectedDate] = useState<{ month: number; year: number } | null>(null);
  const [monthlyData, setMonthlyData] = useState<DailyRecord[]>([]);
  const [openingBalances, setOpeningBalances] = useState<Stock>(getInitialStock());
  
  const lsKey = selectedDate ? `stock-register-${selectedDate.year}-${selectedDate.month}` : null;

  useEffect(() => {
    if (lsKey) {
      try {
        const savedData = localStorage.getItem(lsKey);
        if (savedData) {
          const parsedData = JSON.parse(savedData);
          setMonthlyData(parsedData.monthlyData);
          setOpeningBalances(parsedData.openingBalances);
          setCurrentView(View.DAILY_ENTRY);
        }
      } catch (error) {
        console.error("Failed to load data from local storage", error);
        localStorage.removeItem(lsKey); // Clear corrupted data
      }
    }
  }, [lsKey]);

  const saveData = (data: DailyRecord[], balances: Stock) => {
    if (lsKey) {
      try {
        const dataToSave = { monthlyData: data, openingBalances: balances };
        localStorage.setItem(lsKey, JSON.stringify(dataToSave));
      } catch (error) {
        console.error("Failed to save data to local storage", error);
      }
    }
  };

  const handleMonthSelect = (month: number, year: number, balances: Stock) => {
    setSelectedDate({ month, year });
    setOpeningBalances(balances);
    const initialData = calculateMonthlyData(month, year, balances, []);
    setMonthlyData(initialData);
    saveData(initialData, balances);
    setCurrentView(View.DAILY_ENTRY);
  };

  const updateDailyRecord = (date: string, primaryStudents: number, upperPrimaryStudents: number, stockReceived: { primary: Stock; upperPrimary: Stock; }, eggsIssued: boolean, dhalIssued: boolean, chickpeasIssued: boolean, gramIssued: boolean) => {
    const updatedData = monthlyData.map(d => 
      d.date === date ? { ...d, primaryStudents, upperPrimaryStudents, stockReceived, eggsIssued, dhalIssued, chickpeasIssued, gramIssued } : d
    );
    const recalculatedData = calculateMonthlyData(selectedDate!.month, selectedDate!.year, openingBalances, updatedData);
    setMonthlyData(recalculatedData);
    saveData(recalculatedData, openingBalances);
  };
  
  const handleReset = () => {
    if (lsKey) {
        localStorage.removeItem(lsKey);
    }
    setCurrentView(View.MONTH_SELECTION);
    setSelectedDate(null);
    setMonthlyData([]);
    setOpeningBalances(getInitialStock());
  };

  const renderView = () => {
    switch (currentView) {
      case View.DAILY_ENTRY:
        return <DailyEntry monthlyData={monthlyData} updateDailyRecord={updateDailyRecord} />;
      case View.STOCK_REGISTER:
        return <StockRegister monthlyData={monthlyData} />;
      case View.MONTHLY_SUMMARY:
        return <MonthlySummary monthlyData={monthlyData} />;
      case View.YEARLY_SUMMARY:
        return <YearlyReport initialYear={selectedDate?.year || new Date().getFullYear()} />;
      case View.MONTH_SELECTION:
      default:
        return <MonthSelector onMonthSelect={handleMonthSelect} />;
    }
  };

  return (
    <div className="bg-slate-100 min-h-screen text-slate-800">
      <Header />
      <main className="p-4 md:p-8 max-w-7xl mx-auto">
        {currentView !== View.MONTH_SELECTION && selectedDate && (
          <nav className="bg-white p-4 rounded-lg shadow-md mb-6 no-print">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
                 <h2 className="text-xl md:text-2xl font-bold text-blue-700">
                    {new Date(selectedDate.year, selectedDate.month).toLocaleString('ta-IN', { month: 'long', year: 'numeric' })}
                </h2>
                <button
                    onClick={handleReset}
                    className="mt-2 sm:mt-0 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-md transition duration-300"
                >
                    புதிய மாதம்/ஆண்டு தேர்வு செய்ய
                </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {Object.values(View).map(view => {
                if (view === View.MONTH_SELECTION) return null;
                return (
                  <button
                    key={view}
                    onClick={() => setCurrentView(view)}
                    className={`px-4 py-2 text-sm md:text-base font-semibold rounded-md transition-colors duration-300 ${
                      currentView === view
                        ? 'bg-blue-600 text-white shadow-lg'
                        : 'bg-slate-200 hover:bg-blue-200 text-slate-700'
                    }`}
                  >
                    {VIEWS[view]}
                  </button>
                );
              })}
            </div>
          </nav>
        )}
        <div className="bg-white p-4 md:p-6 rounded-lg shadow-md">
            {renderView()}
        </div>
      </main>
      <footer className="text-center p-4 text-slate-500 text-sm no-print">
        <p>புரட்சித் தலைவர் எம்.ஜி.ஆர் சத்துணவுத் திட்டம்</p>
      </footer>
    </div>
  );
};

export default App;