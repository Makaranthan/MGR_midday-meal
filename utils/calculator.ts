
import { DailyRecord, Stock } from '../types';
import { NORMS } from '../constants';

const roundTo3 = (num: number): number => {
  return Math.round(num * 1000) / 1000;
};

export const getInitialStock = (): Stock => ({
  rice: 0,
  dhal: 0,
  oil: 0,
  salt: 0,
  gram: 0,
  chickpea: 0,
  egg: 0,
});

export const calculateDailyConsumption = (
  primaryStudents: number,
  upperPrimaryStudents: number,
  dayOfWeek: number,
  eggsIssued: boolean,
  dhalIssued: boolean,
  chickpeasIssued: boolean,
  gramIssued: boolean
): Stock => {
  const consumption = getInitialStock();

  // Rice
  consumption.rice = roundTo3(((primaryStudents * NORMS.PRIMARY.rice) + (upperPrimaryStudents * NORMS.UPPER_PRIMARY.rice)) / 1000);

  // Dhal
  if (dhalIssued) {
    consumption.dhal = roundTo3(((primaryStudents * NORMS.PRIMARY.dhal) + (upperPrimaryStudents * NORMS.UPPER_PRIMARY.dhal)) / 1000);
  }
  
  // Oil
  consumption.oil = roundTo3(((primaryStudents * NORMS.PRIMARY.oil) + (upperPrimaryStudents * NORMS.UPPER_PRIMARY.oil)) / 1000);
  
  // Salt
  consumption.salt = roundTo3(((primaryStudents * NORMS.PRIMARY.salt) + (upperPrimaryStudents * NORMS.UPPER_PRIMARY.salt)) / 1000);
  
  // Gram (user-controlled day)
  if (gramIssued) {
    consumption.gram = roundTo3(((primaryStudents * NORMS.PRIMARY.gram) + (upperPrimaryStudents * NORMS.UPPER_PRIMARY.gram)) / 1000);
  }

  // Chickpea (user-controlled day)
  if (chickpeasIssued) {
    consumption.chickpea = roundTo3(((primaryStudents * NORMS.PRIMARY.chickpea) + (upperPrimaryStudents * NORMS.UPPER_PRIMARY.chickpea)) / 1000);
  }

  // Egg
  if (eggsIssued) {
    consumption.egg = primaryStudents + upperPrimaryStudents;
  }

  return consumption;
};

export const calculateMonthlyData = (
    month: number, // 0-indexed
    year: number,
    initialOpeningBalance: Stock,
    existingData: DailyRecord[]
): DailyRecord[] => {

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const newData: DailyRecord[] = [];
    let previousDayClosingBalance = { ...initialOpeningBalance };

    for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month, day);
        const dayOfWeek = date.getDay();
        
        // Manually format date string to YYYY-MM-DD to avoid timezone issues with toISOString()
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, '0');
        const d = String(date.getDate()).padStart(2, '0');
        const dateString = `${y}-${m}-${d}`;

        const existingRecord = existingData.find(d => d.date === dateString);

        const primaryStudents = existingRecord?.primaryStudents || 0;
        const upperPrimaryStudents = existingRecord?.upperPrimaryStudents || 0;
        
        // Handle potentially old data format vs new format
        const stockReceived = (existingRecord?.stockReceived && existingRecord.stockReceived.primary) 
            ? existingRecord.stockReceived 
            : { primary: getInitialStock(), upperPrimary: getInitialStock() };

        const isHoliday = (dayOfWeek === 0) || (existingRecord?.isHoliday ?? false);
        const eggsIssued = existingRecord?.eggsIssued ?? !isHoliday;
        const dhalIssued = existingRecord?.dhalIssued ?? !isHoliday;
        const chickpeasIssued = existingRecord?.chickpeasIssued ?? false;
        const gramIssued = existingRecord?.gramIssued ?? false;


        const openingBalance = { ...previousDayClosingBalance };

        const consumption = isHoliday ? getInitialStock() : calculateDailyConsumption(primaryStudents, upperPrimaryStudents, dayOfWeek, eggsIssued, dhalIssued, chickpeasIssued, gramIssued);

        const closingBalance = getInitialStock();
        Object.keys(closingBalance).forEach(key => {
            const commodity = key as keyof Stock;
            const totalReceived = stockReceived.primary[commodity] + stockReceived.upperPrimary[commodity];
            closingBalance[commodity] = roundTo3(openingBalance[commodity] + totalReceived - consumption[commodity]);
        });
        // Eggs should not be rounded
        const totalEggsReceived = stockReceived.primary.egg + stockReceived.upperPrimary.egg;
        closingBalance.egg = Math.round(openingBalance.egg + totalEggsReceived - consumption.egg);


        newData.push({
            date: dateString,
            dayOfWeek,
            primaryStudents,
            upperPrimaryStudents,
            openingBalance,
            stockReceived,
            consumption,
            closingBalance,
            isHoliday,
            eggsIssued,
            dhalIssued,
            chickpeasIssued,
            gramIssued,
        });

        previousDayClosingBalance = { ...closingBalance };
    }

    return newData;
};