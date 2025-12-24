
import React, { useState, useEffect, useCallback } from 'react';
import { DailyRecord, Stock, Commodity } from '../types';
import { COMMODITY_NAMES, COMMODITIES, DAYS_TAMIL } from '../constants';
import { getInitialStock } from '../utils/calculator';

interface DailyEntryProps {
  monthlyData: DailyRecord[];
  updateDailyRecord: (date: string, primaryStudents: number, upperPrimaryStudents: number, stockReceived: { primary: Stock; upperPrimary: Stock; }, eggsIssued: boolean, dhalIssued: boolean, chickpeasIssued: boolean, gramIssued: boolean) => void;
}

const DailyEntry: React.FC<DailyEntryProps> = ({ monthlyData, updateDailyRecord }) => {
  const [selectedDay, setSelectedDay] = useState<DailyRecord | null>(null);
  const [primaryStudents, setPrimaryStudents] = useState(0);
  const [upperPrimaryStudents, setUpperPrimaryStudents] = useState(0);
  const [stockReceived, setStockReceived] = useState<{ primary: Stock, upperPrimary: Stock }>({ primary: getInitialStock(), upperPrimary: getInitialStock() });
  const [eggsIssued, setEggsIssued] = useState(true);
  const [dhalIssued, setDhalIssued] = useState(true);
  const [chickpeasIssued, setChickpeasIssued] = useState(false);
  const [gramIssued, setGramIssued] = useState(false);

  useEffect(() => {
    if (monthlyData.length > 0 && !selectedDay) {
      const todayDate = new Date();
      const y = todayDate.getFullYear();
      const m = String(todayDate.getMonth() + 1).padStart(2, '0');
      const d = String(todayDate.getDate()).padStart(2, '0');
      const today = `${y}-${m}-${d}`;
      
      const todayRecord = monthlyData.find(d => d.date === today);
      setSelectedDay(todayRecord || monthlyData[0]);
    }
  }, [monthlyData, selectedDay]);

  useEffect(() => {
    if (selectedDay) {
      setPrimaryStudents(selectedDay.primaryStudents);
      setUpperPrimaryStudents(selectedDay.upperPrimaryStudents);
      // Handle old data structure gracefully
      if (selectedDay.stockReceived && selectedDay.stockReceived.primary) {
          setStockReceived(selectedDay.stockReceived);
      } else {
          setStockReceived({ primary: getInitialStock(), upperPrimary: getInitialStock() });
      }
      setEggsIssued(selectedDay.eggsIssued);
      setDhalIssued(selectedDay.dhalIssued);
      setChickpeasIssued(selectedDay.chickpeasIssued);
      setGramIssued(selectedDay.gramIssued);
    }
  }, [selectedDay]);

  const handleSave = () => {
    if (selectedDay) {
      updateDailyRecord(selectedDay.date, primaryStudents, upperPrimaryStudents, stockReceived, eggsIssued, dhalIssued, chickpeasIssued, gramIssued);
    }
  };

  const handleStockChange = useCallback((category: 'primary' | 'upperPrimary', commodity: Commodity, value: string) => {
    const numericValue = parseFloat(value) || 0;
    setStockReceived(prev => ({
        ...prev,
        [category]: {
            ...prev[category],
            [commodity]: numericValue
        }
    }));
  }, []);

  const parseDate = (dateString: string) => {
    const parts = dateString.split('-');
    // new Date(year, monthIndex, day)
    return new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
  };

  return (
    <div className="flex flex-col md:flex-row gap-6">
      <div className="md:w-1/3 space-y-2">
        <h3 className="text-lg font-bold mb-2">தேதி தேர்வு</h3>
        <div className="max-h-96 overflow-y-auto pr-2">
            {monthlyData.map(day => (
            <button
                key={day.date}
                onClick={() => setSelectedDay(day)}
                className={`w-full text-left p-3 mb-2 rounded-md transition-colors duration-200 ${day.isHoliday ? 'bg-gray-200 text-gray-500' : ''} ${
                selectedDay?.date === day.date
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-slate-100 hover:bg-blue-100'
                }`}
            >
                <span className="font-semibold">{parseDate(day.date).toLocaleDateString('ta-IN', { day: '2-digit', month: '2-digit' })}</span> - {DAYS_TAMIL[day.dayOfWeek]}
            </button>
            ))}
        </div>
      </div>

      <div className="md:w-2/3">
        {selectedDay ? (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-blue-700">
                பதிவு: {parseDate(selectedDay.date).toLocaleDateString('ta-IN', { day: 'numeric', month: 'long', year: 'numeric' })} - {DAYS_TAMIL[selectedDay.dayOfWeek]}
            </h2>

            {selectedDay.isHoliday ? <p className="text-red-600 font-bold p-4 bg-red-100 rounded-md">விடுமுறை நாள்</p> : 
            (<div>
                <div className="bg-slate-50 p-4 rounded-lg shadow-inner">
                    <h3 className="text-lg font-semibold mb-3">உணவு உண்ட மாணவர் எண்ணிக்கை</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">வகுப்பு 1-5</label>
                            <input type="number" value={primaryStudents} onChange={e => setPrimaryStudents(parseInt(e.target.value) || 0)} className="mt-1 w-full p-2 border rounded-md"/>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">வகுப்பு 6-8</label>
                            <input type="number" value={upperPrimaryStudents} onChange={e => setUpperPrimaryStudents(parseInt(e.target.value) || 0)} className="mt-1 w-full p-2 border rounded-md"/>
                        </div>
                    </div>
                     <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2">
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="dhalIssued"
                                checked={dhalIssued}
                                onChange={(e) => setDhalIssued(e.target.checked)}
                                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <label htmlFor="dhalIssued" className="ml-2 block text-sm font-medium text-gray-900">
                                பருப்பு வழங்கப்பட்டதா?
                            </label>
                        </div>
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="eggsIssued"
                                checked={eggsIssued}
                                onChange={(e) => setEggsIssued(e.target.checked)}
                                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <label htmlFor="eggsIssued" className="ml-2 block text-sm font-medium text-gray-900">
                                முட்டை வழங்கப்பட்டதா?
                            </label>
                        </div>
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="chickpeasIssued"
                                checked={chickpeasIssued}
                                onChange={(e) => setChickpeasIssued(e.target.checked)}
                                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <label htmlFor="chickpeasIssued" className="ml-2 block text-sm font-medium text-gray-900">
                                கொண்டைக்கடலை நாளா?
                            </label>
                        </div>
                         <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="gramIssued"
                                checked={gramIssued}
                                onChange={(e) => setGramIssued(e.target.checked)}
                                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <label htmlFor="gramIssued" className="ml-2 block text-sm font-medium text-gray-900">
                                பயறு வழங்கப்பட்டதா?
                            </label>
                        </div>
                    </div>
                </div>

                <div className="bg-slate-50 p-4 mt-6 rounded-lg shadow-inner">
                    <h3 className="text-lg font-semibold mb-3 text-center">வரவு வைக்கப்பட்ட பொருட்கள் (Varavu)</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h4 className="text-md font-bold mb-3 text-center text-blue-600">வகுப்பு 1-5</h4>
                            <div className="space-y-2">
                                {COMMODITIES.map(commodity => (
                                    <div key={`primary-${commodity}`} className="grid grid-cols-2 items-center gap-2">
                                    <label className="text-sm font-medium text-gray-700">{COMMODITY_NAMES[commodity].name}</label>
                                    <input
                                        type="number"
                                        step="0.001"
                                        value={stockReceived.primary[commodity]}
                                        onChange={e => handleStockChange('primary', commodity, e.target.value)}
                                        className="w-full p-2 border rounded-md"
                                    />
                                    </div>
                                ))}
                            </div>
                        </div>
                         <div>
                            <h4 className="text-md font-bold mb-3 text-center text-blue-600">வகுப்பு 6-8</h4>
                            <div className="space-y-2">
                                {COMMODITIES.map(commodity => (
                                    <div key={`upperPrimary-${commodity}`} className="grid grid-cols-2 items-center gap-2">
                                    <label className="text-sm font-medium text-gray-700">{COMMODITY_NAMES[commodity].name}</label>
                                    <input
                                        type="number"
                                        step="0.001"
                                        value={stockReceived.upperPrimary[commodity]}
                                        onChange={e => handleStockChange('upperPrimary', commodity, e.target.value)}
                                        className="w-full p-2 border rounded-md"
                                    />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="text-center mt-6">
                    <button onClick={handleSave} className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-lg text-lg transition duration-300 shadow-md">
                        சேமி
                    </button>
                </div>
            </div>)}
          </div>
        ) : (
          <p>ஒரு நாளைத் தேர்ந்தெடுக்கவும்</p>
        )}
      </div>
    </div>
  );
};

export default DailyEntry;