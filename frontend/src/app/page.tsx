"use client";

import CalculatorForm from "@/components/CalculatorForm";
import ResultsSummary from "@/components/ResultsSummary";
import ComparisonCard from "@/components/ComparisonCard";
import MonthlyCostChart from "@/components/charts/MonthlyCostChart";
import EnergyFlowChart from "@/components/charts/EnergyFlowChart";
import MonthlyTable from "@/components/MonthlyTable";
import { useCalculatorStore } from "@/store/calculator";

export default function Home() {
  const result = useCalculatorStore((s) => s.result);
  const error = useCalculatorStore((s) => s.error);

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-[var(--text-primary)] mb-2">
            Kalkulator Kosztow Energii
          </h1>
          <p className="text-[var(--text-muted)] text-sm">
            Oblicz oszczednosci z fotowoltaiki, magazynu energii i net-meteringu
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left: Form */}
          <div className="lg:w-[360px] shrink-0">
            <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-5 sticky top-4">
              <h2 className="text-lg font-semibold mb-4">Parametry domu</h2>
              <CalculatorForm />
            </div>
          </div>

          {/* Right: Results */}
          <div className="flex-1 min-w-0">
            {error && (
              <div className="rounded-xl border border-[var(--red)]/30 bg-[var(--red)]/10 p-4 mb-6 text-[var(--red)]">
                {error}
              </div>
            )}

            {!result && !error && (
              <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-12 text-center text-[var(--text-muted)]">
                <div className="text-5xl mb-4">&#9889;</div>
                <p className="text-lg">Ustaw parametry i kliknij &quot;Oblicz koszty&quot;</p>
                <p className="text-sm mt-2">Zobaczysz roczna analize kosztow energii z PV</p>
              </div>
            )}

            {result && (
              <>
                <ResultsSummary />
                <ComparisonCard />
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                  <MonthlyCostChart />
                  <EnergyFlowChart />
                </div>
                <MonthlyTable />
              </>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-[var(--text-dim)] mt-8 pb-4">
          Energia Dom v1.0 | Dane PV oparte na PVGIS dla Polski | Taryfy G11/G12/G12w/G13 | Net-metering 80%
        </div>
      </div>
    </div>
  );
}
