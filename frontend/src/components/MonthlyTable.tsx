"use client";

import { useCalculatorStore } from "@/store/calculator";
import { formatKWh, formatPLN } from "@/lib/utils";

export default function MonthlyTable() {
  const result = useCalculatorStore((s) => s.result);
  if (!result) return null;

  const totals = {
    pv: Math.round(result.annual_pv_production),
    consumption: Math.round(result.annual_consumption),
    import: Math.round(result.annual_grid_import),
    export: Math.round(result.annual_grid_export),
    nm: Math.round(result.annual_nm_credit_kwh),
    net: Math.round(result.annual_cost_with_pv),
  };

  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-5 mb-6 overflow-x-auto">
      <h3 className="text-base font-semibold mb-4">Szczegoly miesieczne</h3>
      <table className="w-full text-xs">
        <thead>
          <tr className="text-[var(--text-muted)] uppercase tracking-wider">
            <th className="text-left py-2 px-2">Mies.</th>
            <th className="text-right py-2 px-2">PV</th>
            <th className="text-right py-2 px-2">Zuzycie</th>
            <th className="text-right py-2 px-2">Import</th>
            <th className="text-right py-2 px-2">Eksport</th>
            <th className="text-right py-2 px-2">NM kred.</th>
            <th className="text-right py-2 px-2">Netto</th>
          </tr>
        </thead>
        <tbody>
          {result.monthly.map((m) => (
            <tr key={m.month} className="border-t border-[var(--border)] hover:bg-[var(--border)]">
              <td className="text-left py-1.5 px-2 font-medium">{m.month}</td>
              <td className="text-right py-1.5 px-2">{formatKWh(m.pv_production)}</td>
              <td className="text-right py-1.5 px-2">{formatKWh(m.consumption)}</td>
              <td className="text-right py-1.5 px-2">{formatKWh(m.grid_import)}</td>
              <td className="text-right py-1.5 px-2">{formatKWh(m.grid_export)}</td>
              <td className="text-right py-1.5 px-2">{formatKWh(m.nm_credit_kwh)}</td>
              <td
                className="text-right py-1.5 px-2 font-medium"
                style={{ color: m.cost_net < 0 ? "var(--green)" : m.cost_net > 2000 ? "var(--red)" : "inherit" }}
              >
                {formatPLN(Math.round(m.cost_net))} PLN
              </td>
            </tr>
          ))}
          <tr className="border-t-2 border-[var(--border-accent)] font-bold bg-[var(--bg-card-hover)]">
            <td className="text-left py-2 px-2">ROCZNE</td>
            <td className="text-right py-2 px-2">{formatKWh(totals.pv)}</td>
            <td className="text-right py-2 px-2">{formatKWh(totals.consumption)}</td>
            <td className="text-right py-2 px-2">{formatKWh(totals.import)}</td>
            <td className="text-right py-2 px-2">{formatKWh(totals.export)}</td>
            <td className="text-right py-2 px-2">{formatKWh(totals.nm)}</td>
            <td className="text-right py-2 px-2">{formatPLN(totals.net)} PLN</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
