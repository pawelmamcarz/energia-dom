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
  Cell,
} from "recharts";

export default function MonthlyCostChart() {
  const result = useCalculatorStore((s) => s.result);
  if (!result) return null;

  const data = result.monthly.map((m) => ({
    month: m.month,
    netto: Math.round(m.cost_net),
    kredyt: Math.round(m.nm_credit_pln),
  }));

  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-5 mb-6">
      <h3 className="text-base font-semibold mb-4">Koszt netto z NM (PLN/mies.)</h3>
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
          <Bar dataKey="netto" name="Koszt netto (PLN)" radius={[4, 4, 0, 0]}>
            {data.map((entry, i) => (
              <Cell
                key={i}
                fill={
                  entry.netto < 0
                    ? "#4ade80"
                    : entry.netto > 2000
                      ? "#ef4444"
                      : entry.netto > 1500
                        ? "#f97316"
                        : entry.netto > 500
                          ? "#fbbf24"
                          : "#a3e635"
                }
              />
            ))}
          </Bar>
          <Bar dataKey="kredyt" name="Kredyt NM (PLN)" fill="#22c55e55" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
