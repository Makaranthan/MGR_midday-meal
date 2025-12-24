
import React from 'react';
import { DailyRecord, Commodity } from '../types';
import { COMMODITY_NAMES, COMMODITIES, DAYS_TAMIL } from '../constants';

interface StockRegisterProps {
  monthlyData: DailyRecord[];
}

const formatNumber = (num: number, isEgg: boolean) => {
    if (isEgg) {
        return num.toFixed(0);
    }
    return num.toFixed(3);
}

const parseDate = (dateString: string) => {
    const parts = dateString.split('-');
    return new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
};


const StockRegister: React.FC<StockRegisterProps> = ({ monthlyData }) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div>
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-800">உணவுப் பொருள் இருப்புப் பதிவேடு</h2>
            <button
                onClick={handlePrint}
                className="no-print bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
            >
                அச்சிடுக / PDF
            </button>
      </div>
      <div className="overflow-x-auto">
        {COMMODITIES.map(commodity => (
          <div key={commodity} className="mb-8 printable-table">
            <h3 className="text-xl font-bold bg-slate-200 p-2 rounded-t-lg text-slate-700">
              {COMMODITY_NAMES[commodity].name} ({COMMODITY_NAMES[commodity].unit})
            </h3>
            <table className="min-w-full bg-white border border-gray-300">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-2 px-3 border-b text-center sticky left-0 bg-gray-100 z-10">தேதி</th>
                  <th className="py-2 px-3 border-b text-center">நாள்</th>
                  <th className="py-2 px-3 border-b text-center">வகுப்பு 1-5 மாணவர்கள்</th>
                  <th className="py-2 px-3 border-b text-center">வகுப்பு 6-8 மாணவர்கள்</th>
                  <th className="py-2 px-3 border-b text-right">தொடக்க இருப்பு</th>
                  <th className="py-2 px-3 border-b text-right">வரவு</th>
                  <th className="py-2 px-3 border-b text-right">மொத்தம்</th>
                  <th className="py-2 px-3 border-b text-right">செலவு</th>
                  <th className="py-2 px-3 border-b text-right">இறுதி இருப்பு</th>
                </tr>
              </thead>
              <tbody>
                {monthlyData.map((day, index) => {
                    const totalReceived = (day.stockReceived && day.stockReceived.primary) 
                        ? day.stockReceived.primary[commodity] + day.stockReceived.upperPrimary[commodity]
                        : 0; // Fallback for old data structure
                  const rowBgClass = day.isHoliday ? 'bg-gray-50' : (index % 2 === 0 ? 'bg-white' : 'bg-slate-50');
                  return (
                  <tr key={index} className={rowBgClass}>
                    <td className={`py-1 px-3 border-b text-center sticky left-0 z-0 ${rowBgClass}`}>{parseDate(day.date).toLocaleDateString('ta-IN', {day:'2-digit'})}</td>
                    <td className="py-1 px-3 border-b text-center">{DAYS_TAMIL[day.dayOfWeek]}</td>
                    <td className="py-1 px-3 border-b text-center font-mono">{day.isHoliday ? '-' : day.primaryStudents}</td>
                    <td className="py-1 px-3 border-b text-center font-mono">{day.isHoliday ? '-' : day.upperPrimaryStudents}</td>
                    <td className="py-1 px-3 border-b text-right font-mono">{formatNumber(day.openingBalance[commodity], commodity === 'egg')}</td>
                    <td className="py-1 px-3 border-b text-right font-mono text-green-600">{formatNumber(totalReceived, commodity === 'egg')}</td>
                    <td className="py-1 px-3 border-b text-right font-mono">{formatNumber(day.openingBalance[commodity] + totalReceived, commodity === 'egg')}</td>
                    <td className="py-1 px-3 border-b text-right font-mono text-red-600">{formatNumber(day.consumption[commodity], commodity === 'egg')}</td>
                    <td className="py-1 px-3 border-b text-right font-mono font-bold">{formatNumber(day.closingBalance[commodity], commodity === 'egg')}</td>
                  </tr>
                )})}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StockRegister;
