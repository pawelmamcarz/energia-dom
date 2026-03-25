import { create } from "zustand";
import { calculate } from "@/lib/calculator";
import type { CalculatorResult } from "@/lib/types";

export interface CalcInput {
  region: string;
  seller: string;
  pv_kwp: number;
  battery_kwh: number;
  tariff: string;
  monthly_consumption_kwh: number;
}

interface CalculatorState {
  result: CalculatorResult | null;
  runCalculation: (input: CalcInput) => void;
}

export const useCalculatorStore = create<CalculatorState>((set) => ({
  result: null,
  runCalculation: (input) => {
    const result = calculate(input);
    set({ result });
  },
}));
