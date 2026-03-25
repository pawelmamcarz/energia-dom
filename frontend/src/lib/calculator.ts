import type { CalculatorResult, MonthlyResult } from "./types";
import {
  MONTHLY_CONSUMPTION_PROFILE,
  MONTHLY_PV_PROFILE,
  MONTH_NAMES,
  NET_METERING_RETURN,
  REGIONS,
  TARIFFS,
} from "./constants";

function getBlendedRate(tariff: string): number {
  const t = TARIFFS[tariff] ?? TARIFFS["G12w"];
  const rates = t.rates;

  if ("flat" in rates) return rates.flat;

  if ("shoulder" in rates) {
    const peakR = t.peak_ratio;
    const shoulderR = 0.35;
    const offpeakR = 1.0 - peakR - shoulderR;
    return rates.peak * peakR + rates.shoulder * shoulderR + rates.offpeak * offpeakR;
  }

  if ("day" in rates) {
    // Dynamic tariff: peak (morning/evening), day (PV hours cheap), night
    const peakR = t.peak_ratio;
    const dayR = 0.45;
    const offpeakR = 1.0 - peakR - dayR;
    return rates.peak * peakR + rates.day * dayR + rates.offpeak * offpeakR;
  }

  const peakR = t.peak_ratio;
  return rates.peak * peakR + rates.offpeak * (1.0 - peakR);
}

export function calculate(input: {
  region: string;
  pv_kwp: number;
  battery_kwh: number;
  tariff: string;
  monthly_consumption_kwh: number;
}): CalculatorResult {
  const region = REGIONS.find((r) => r.code === input.region);
  const yieldPerKwp = region?.yield_kwp ?? 1020;

  // 1. Annual PV production
  const annualPv = input.pv_kwp * yieldPerKwp;
  const monthlyPv = MONTHLY_PV_PROFILE.map((f) => Math.round(annualPv * f));

  // 2. Monthly consumption distribution
  const annualConsumption = input.monthly_consumption_kwh * 12;
  const monthlyConsumption = MONTHLY_CONSUMPTION_PROFILE.map((f) =>
    Math.round(annualConsumption * f)
  );

  // 3. Self-consumption + export
  const selfConsumed: number[] = [];
  const exported: number[] = [];

  for (let i = 0; i < 12; i++) {
    let direct = Math.min(monthlyConsumption[i], monthlyPv[i]);
    let surplus = Math.max(0, monthlyPv[i] - monthlyConsumption[i]);

    if (input.battery_kwh > 0 && surplus > 0) {
      const batteryCapacity = input.battery_kwh * 30 * 0.8;
      const fromBattery = Math.min(surplus, batteryCapacity);
      direct += fromBattery;
      surplus -= fromBattery;
    }

    selfConsumed.push(Math.round(direct));
    exported.push(Math.round(surplus));
  }

  // 4. Monthly cost calculations
  const rate = getBlendedRate(input.tariff);
  const monthly: MonthlyResult[] = [];
  let totalCostNet = 0;
  let totalGridImport = 0;
  let totalGridExport = 0;
  let totalNmCredit = 0;
  let totalSelfConsumed = 0;

  for (let i = 0; i < 12; i++) {
    const gridImport = Math.max(0, monthlyConsumption[i] - selfConsumed[i]);
    const gridExport = exported[i];
    const nmCreditKwh = Math.round(gridExport * NET_METERING_RETURN);
    const costGross = Math.round(gridImport * rate);
    const nmCreditPln = Math.round(nmCreditKwh * rate);
    const costNet = costGross - nmCreditPln;

    monthly.push({
      month: MONTH_NAMES[i],
      pv_production: monthlyPv[i],
      consumption: monthlyConsumption[i],
      self_consumed: selfConsumed[i],
      grid_import: gridImport,
      grid_export: gridExport,
      nm_credit_kwh: nmCreditKwh,
      cost_gross: costGross,
      nm_credit_pln: nmCreditPln,
      cost_net: costNet,
    });

    totalCostNet += costNet;
    totalGridImport += gridImport;
    totalGridExport += gridExport;
    totalNmCredit += nmCreditKwh;
    totalSelfConsumed += selfConsumed[i];
  }

  const totalPv = monthlyPv.reduce((a, b) => a + b, 0);
  const costNoPv = Math.round(annualConsumption * rate);

  return {
    annual_cost_with_pv: totalCostNet,
    annual_cost_without_pv: costNoPv,
    annual_savings: costNoPv - totalCostNet,
    annual_pv_production: totalPv,
    annual_consumption: annualConsumption,
    annual_grid_import: totalGridImport,
    annual_grid_export: totalGridExport,
    annual_nm_credit_kwh: totalNmCredit,
    self_consumption_ratio: totalPv > 0 ? totalSelfConsumed / totalPv : 0,
    pv_coverage_ratio: annualConsumption > 0 ? totalPv / annualConsumption : 0,
    monthly,
    location: region?.name ?? input.region,
    pv_kwp: input.pv_kwp,
    battery_kwh: input.battery_kwh,
    tariff: input.tariff,
  };
}
