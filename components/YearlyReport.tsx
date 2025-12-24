
import React, { useState, useEffect, useMemo } from 'react';
import { Stock, DailyRecord, Commodity } from '../types';
import { COMMODITY_NAMES, COMMODITIES, MONTHS_TAMIL } from '../constants';
import { getInitialStock } from '../utils/calculator';

interface MonthlyReportData {
  month: number;
  monthName: string;
  consumption: Stock;
  stockReceived: Stock;
  totalPrimaryStudents: number;
  totalUpperPrimaryStudents: number;
  hasData: boolean;
}

const YearlyReport: React.FC<{ initialYear: number }> = ({ initialYear }) => {
  const [year, setYear] = useState(initialYear);
  const [reportData, setReportData] = useState<MonthlyReportData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadYearlyData = () => {
      setLoading(true);
      const allMonthsData: MonthlyReportData[] = [];
      // Financial year runs from April (3) to March (2)
      const financialYearMonths = [3, 4, 5, 6, 7, 8, 9, 10, 11, 0, 1, 2];

      for (const month of financialYearMonths) {
        // For Jan, Feb, Mar, the year is the next calendar year
        const dataYear = month >= 3 ? year : year + 1;
        const lsKey = `stock-register-${dataYear}-${month}`;
        
        const monthData: MonthlyReportData = {
          month,
          monthName: MONTHS_TAMIL[month],
          consumption: getInitialStock(),
          stockReceived: getInitialStock(),
          totalPrimaryStudents: 0,
          totalUpperPrimaryStudents: 0,
          hasData: false,
        };

        try {
          const savedData = localStorage.getItem(lsKey);
          if (savedData) {
            const parsedData: { monthlyData: DailyRecord[] } = JSON.parse(savedData);
            if (parsedData.monthlyData) {
              monthData.hasData = true;
              parsedData.monthlyData.forEach(day => {
                if (!day.isHoliday) {
                    COMMODITIES.forEach(c => {
                        monthData.consumption[c] += day.consumption[c];
                        if (day.stockReceived && day.stockReceived.primary) {
                           monthData.stockReceived[c] += day.stockReceived.primary[c] + day.stockReceived.upperPrimary[c];
                        }
                    });
                    monthData.totalPrimaryStudents += day.primaryStudents;
                    monthData.totalUpperPrimaryStudents += day.upperPrimaryStudents;
                }
              });
            }
          }
        } catch (error) {
          console.error(`Failed to load data for ${dataYear}-${month}`, error);
        }
        allMonthsData.push(monthData);
      }
      setReportData(allMonthsData);
      setLoading(false);
    };

    loadYearlyData();
  }, [year]);

  const yearlyTotals = useMemo(() => {
    const totals = {
      stockReceived: getInitialStock(),
      consumption: getInitialStock(),
      totalPrimaryStudents: 0,
      totalUpperPrimaryStudents: 0,
    };

    reportData.forEach(month => {
      if (month.hasData) {
        COMMODITIES.forEach(c => {
          totals.stockReceived[c] += month.stockReceived[c];
          totals.consumption[c] += month.consumption[c];
        });
        totals.totalPrimaryStudents += month.totalPrimaryStudents;
        totals.totalUpperPrimaryStudents += month.totalUpperPrimaryStudents;
      }
    });

    return totals;
  }, [reportData]);
  
  const handlePrint = () => {
    window.print();
  };
  
  return (
    <div>
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 no-print">
            <h2 className="text-2xl font-bold text-gray-800">{year} - {year + 1} - ஆண்டு அறிக்கை</h2>
            <div className="flex items-center gap-4 mt-4 md:mt-0">
                 <div className="flex items-center gap-2">
                    <label htmlFor="year-selector" className="font-semibold">நிதி ஆண்டின் தொடக்கம்:</label>
                    <input
                        type="number"
                        id="year-selector"
                        value={year}
                        onChange={e => setYear(parseInt(e.target.value))}
                        className="w-24 p-2 border rounded-md"
                        min="2020"
                        max="2030"
                    />
                 </div>
                <button
                    onClick={handlePrint}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                >
                    அச்சிடுக / PDF
                </button>
            </div>
      </div>

      {loading ? <p>தரவுகள் ஏற்றப்படுகின்றது...</p> : (
        <div className="overflow-x-auto printable-table">
          <table className="min-w-full bg-white border text-sm">
            <thead className="bg-gray-200">
               <tr>
                <th rowSpan={2} className="py-2 px-2 border text-left align-middle sticky left-0 bg-gray-200 z-20">மாதம்</th>
                {COMMODITIES.map(c => (
                  <th key={c} colSpan={2} className="py-2 px-2 border text-center">{COMMODITY_NAMES[c].name}</th>
                ))}
                <th rowSpan={2} className="py-2 px-2 border text-right align-middle">மொத்த மாணவர்கள் (1-5)</th>
                <th rowSpan={2} className="py-2 px-2 border text-right align-middle">மொத்த மாணவர்கள் (6-8)</th>
              </tr>
              <tr>
                {COMMODITIES.map(c => (
                  <React.Fragment key={c}>
                    <th className="py-2 px-2 border font-normal text-right bg-gray-100">வரவு</th>
                    <th className="py-2 px-2 border font-normal text-right bg-gray-100">செலவு</th>
                  </React.Fragment>
                ))}
              </tr>
            </thead>
            <tbody>
              {reportData.map(month => (
                <tr key={month.month} className={`group ${month.hasData ? "hover:bg-slate-50" : "bg-gray-50 text-gray-500"}`}>
                  <td className={`py-2 px-2 border font-semibold text-gray-700 sticky left-0 z-10 ${month.hasData ? 'bg-white group-hover:bg-slate-50' : 'bg-gray-50'}`}>{month.monthName}</td>
                   {COMMODITIES.map(c => (
                     <React.Fragment key={c}>
                        <td className="py-2 px-2 border text-right font-mono text-green-700">
                           {month.hasData ? (c === 'egg' ? month.stockReceived[c].toFixed(0) : month.stockReceived[c].toFixed(3)) : '-'}
                        </td>
                        <td className="py-2 px-2 border text-right font-mono text-red-700">
                           {month.hasData ? (c === 'egg' ? month.consumption[c].toFixed(0) : month.consumption[c].toFixed(3)) : '-'}
                        </td>
                     </React.Fragment>
                  ))}
                  <td className="py-2 px-2 border text-right font-mono">{month.hasData ? month.totalPrimaryStudents : '-'}</td>
                  <td className="py-2 px-2 border text-right font-mono">{month.hasData ? month.totalUpperPrimaryStudents : '-'}</td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-gray-300 font-bold text-gray-800">
                <tr>
                    <td className="py-2 px-2 border text-left sticky left-0 bg-gray-300 z-10">மொத்தம்</td>
                     {COMMODITIES.map(c => (
                        <React.Fragment key={`total-${c}`}>
                            <td className="py-2 px-2 border text-right font-mono">
                                {c === 'egg' ? yearlyTotals.stockReceived[c].toFixed(0) : yearlyTotals.stockReceived[c].toFixed(3)}
                            </td>
                            <td className="py-2 px-2 border text-right font-mono">
                                {c === 'egg' ? yearlyTotals.consumption[c].toFixed(0) : yearlyTotals.consumption[c].toFixed(3)}
                            </td>
                        </React.Fragment>
                    ))}
                    <td className="py-2 px-2 border text-right font-mono">{yearlyTotals.totalPrimaryStudents}</td>
                    <td className="py-2 px-2 border text-right font-mono">{yearlyTotals.totalUpperPrimaryStudents}</td>
                </tr>
            </tfoot>
          </table>
        </div>
      )}
    </div>
  );
};

export default YearlyReport;