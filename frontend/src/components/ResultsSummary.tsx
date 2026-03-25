"use client";

import { useCalculatorStore } from "@/store/calculator";
import { formatPLN, formatKWh, formatPercent } from "@/lib/utils";

interface CardProps {
  title: string;
  value: string;
  detail: string;
  color: string;
  highlight?: boolean;
}

function Card({ title, value, detail, color, highlight }: CardProps) {
  return (
    <div
      className={`rounded-xl border p-5 ${
        highlight
          ? "border-[var(--green)]/20 bg-gradient-to-br from-[var(--bg-card)] to-[var(--bg-card-hover)]"
          : "border-[var(--border)] bg-[var(--bg-card)]"
      }`}
    >
      <div className="text-xs uppercase tracking-wider text-[var(--text-muted)] mb-2">
        {title}
      </div>
      <div className={`text-3xl font-bold`} style={{ color }}>
        {value}
      </div>
      <div className="text-sm text-[var(--text-muted)] mt-1">{detail}</div>
    </div>
  );
}

export default function ResultsSummary() {
  const result = useCalculatorStore((s) => s.result);
  if (!result) return null;

  const monthlyCost = Math.round(result.annual_cost_with_pv / 12);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
      <Card
        title="Koszt roczny z PV"
        value={`${formatPLN(result.annual_cost_with_pv)} PLN`}
        detail={`~${formatPLN(monthlyCost)} PLN/mies.`}
        color="var(--amber)"
        highlight
      />
      <Card
        title="Zuzycie ogolem"
        value={`${formatKWh(result.annual_consumption)} kWh`}
        detail={`~${formatKWh(Math.round(result.annual_consumption / 365))} kWh/dzien`}
        color="var(--blue)"
      />
      <Card
        title="Produkcja PV"
        value={`${formatKWh(result.annual_pv_production)} kWh`}
        detail={`Pokrycie ${formatPercent(result.pv_coverage_ratio)} zuzycia`}
        color="var(--green)"
      />
      <Card
        title="Oszczednosc roczna"
        value={`${formatPLN(result.annual_savings)} PLN`}
        detail={`Autokonsumpcja: ${formatPercent(result.self_consumption_ratio)}`}
        color="var(--green)"
        highlight
      />
    </div>
  );
}
