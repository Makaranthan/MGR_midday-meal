
export interface Stock {
  rice: number;
  dhal: number;
  oil: number;
  salt: number;
  gram: number;
  chickpea: number;
  egg: number;
}

export type Commodity = keyof Stock;

export interface DailyRecord {
  date: string; // ISO format "YYYY-MM-DD"
  dayOfWeek: number; // 0 for Sunday, ..., 6 for Saturday
  primaryStudents: number;
  upperPrimaryStudents: number;
  openingBalance: Stock;
  stockReceived: {
    primary: Stock;
    upperPrimary: Stock;
  };
  consumption: Stock;
  closingBalance: Stock;
  isHoliday: boolean;
  eggsIssued: boolean;
  dhalIssued: boolean;
  chickpeasIssued: boolean;
  gramIssued: boolean;
}

export enum View {
  MONTH_SELECTION = 'month_selection',
  DAILY_ENTRY = 'daily_entry',
  STOCK_REGISTER = 'stock_register',
  MONTHLY_SUMMARY = 'monthly_summary',
  YEARLY_SUMMARY = 'yearly_summary',
}