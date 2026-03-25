"use client";

import { useCalculatorStore } from "@/store/calculator";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function EnergyFlowChart() {
  const result = useCalculatorStore((s) => s.result);
  if (!result) return null;

  const data = result.monthly.map((m) => ({
    month: m.month,
    import: Math.round(m.grid_import),
    pv: Math.round(m.pv_production),
    eksport: Math.round(m.grid_export),
  }));

  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-5 mb-6">
      <h3 className="text-base font-semibold mb-4">Import vs PV vs Eksport (kWh)</h3>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis dataKey="month" tick={{ fill: "#94a3b8", fontSize: 12 }} />
          <YAxis tick={{ fill: "#94a3b8", fontSize: 12 }} />
          <Tooltip
            contentStyle={{ background: "#1e293b", border: "1px solid #334155", borderRadius: 8 }}
            labelStyle={{ color: "#e2e8f0" }}
          />
          <Legend wrapperStyle={{ color: "#94a3b8" }} />
          <Bar dataKey="import" name="Import (kWh)" fill="#f8717188" radius={[4, 4, 0, 0]} />
          <Bar dataKey="pv" name="PV (kWh)" fill="#4ade8088" radius={[4, 4, 0, 0]} />
          <Bar dataKey="eksport" name="Eksport (kWh)" fill="#fbbf2488" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
