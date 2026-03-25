export interface CalculatorInput {
  location: string;
  pv_kwp: number;
  battery_kwh: number;
  tariff: string;
  monthly_consumption_kwh: number;
}

export interface MonthlyResult {
  month: string;
  pv_production: number;
  consumption: number;
  self_consumed: number;
  grid_import: number;
  grid_export: number;
  nm_credit_kwh: number;
  cost_gross: number;
  nm_credit_pln: number;
  cost_net: number;
}

export interface CalculatorResult {
  annual_cost_with_pv: number;
  annual_cost_without_pv: number;
  annual_savings: number;
  annual_pv_production: number;
  annual_consumption: number;
  annual_grid_import: number;
  annual_grid_export: number;
  annual_nm_credit_kwh: number;
  self_consumption_ratio: number;
  pv_coverage_ratio: number;
  monthly: MonthlyResult[];
  location: string;
  pv_kwp: number;
  battery_kwh: number;
  tariff: string;
}

export interface TariffInfo {
  code: string;
  name: string;
  rates: Record<string, number>;
}

export interface LocationInfo {
  name: string;
  lat: number;
  lon: number;
  yield_kwp: number;
}
