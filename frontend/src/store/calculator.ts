import { create } from "zustand";
import { calculate } from "@/lib/api";
import type { CalculatorInput, CalculatorResult } from "@/lib/types";

interface CalculatorState {
  input: CalculatorInput;
  result: CalculatorResult | null;
  isLoading: boolean;
  error: string | null;
  setInput: (partial: Partial<CalculatorInput>) => void;
  runCalculation: () => Promise<void>;
  reset: () => void;
}

const defaultInput: CalculatorInput = {
  location: "Wroclaw",
  pv_kwp: 10,
  battery_kwh: 0,
  tariff: "G12w",
  monthly_consumption_kwh: 500,
};

export const useCalculatorStore = create<CalculatorState>((set, get) => ({
  input: defaultInput,
  result: null,
  isLoading: false,
  error: null,

  setInput: (partial) =>
    set((state) => ({ input: { ...state.input, ...partial } })),

  runCalculation: async () => {
    set({ isLoading: true, error: null });
    try {
      const result = await calculate(get().input);
      set({ result, isLoading: false });
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Blad obliczen",
        isLoading: false,
      });
    }
  },

  reset: () => set({ input: defaultInput, result: null, error: null }),
}));
