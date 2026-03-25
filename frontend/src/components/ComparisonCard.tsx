"use client";

import { useCalculatorStore } from "@/store/calculator";
import { formatPLN } from "@/lib/utils";

export default function ComparisonCard() {
  const result = useCalculatorStore((s) => s.result);
  if (!result) return null;

  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-5 mb-6">
      <h3 className="text-base font-semibold mb-4">Porownanie: z PV vs bez PV</h3>
      <div className="flex gap-4 flex-wrap items-center">
        <div className="flex-1 min-w-[180px] rounded-lg bg-[var(--border)] p-4 text-center opacity-70">
          <div className="text-xs text-[var(--text-muted)]">BEZ PV</div>
          <div className="text-2xl font-bold text-[var(--red)]">
            ~{formatPLN(result.annual_cost_without_pv)} PLN
          </div>
          <div className="text-xs text-[var(--text-muted)]">rocznie</div>
        </div>
        <div className="text-2xl text-[var(--green)]">&rarr;</div>
        <div className="flex-1 min-w-[180px] rounded-lg border border-[var(--green)]/30 bg-[var(--green)]/5 p-4 text-center">
          <div className="text-xs text-[var(--text-muted)]">Z PV + NM 80%</div>
          <div className="text-2xl font-bold text-[var(--green)]">
            ~{formatPLN(result.annual_cost_with_pv)} PLN
          </div>
          <div className="text-xs text-[var(--text-muted)]">
            rocznie (oszcz. ~{formatPLN(result.annual_savings)} PLN)
          </div>
        </div>
      </div>
    </div>
  );
}
