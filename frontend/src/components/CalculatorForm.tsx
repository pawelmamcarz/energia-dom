"use client";

import { useCalculatorStore } from "@/store/calculator";
import { Sun, Battery, Zap, MapPin } from "lucide-react";

const LOCATIONS = [
  "Bialystok", "Gdansk", "Katowice", "Kielce", "Krakow",
  "Lodz", "Lublin", "Olsztyn", "Opole", "Poznan",
  "Rzeszow", "Szczecin", "Warszawa", "Wroclaw", "Zielona Gora",
];

const TARIFFS = [
  { code: "G11", label: "G11 — jednostrefowa" },
  { code: "G12", label: "G12 — dwustrefowa" },
  { code: "G12w", label: "G12w — weekendowa" },
  { code: "G13", label: "G13 — trzystrefowa" },
];

export default function CalculatorForm() {
  const { input, setInput, runCalculation, isLoading } = useCalculatorStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    runCalculation();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Location */}
      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-[var(--text-muted)] mb-2">
          <MapPin size={16} /> Lokalizacja
        </label>
        <select
          value={input.location}
          onChange={(e) => setInput({ location: e.target.value })}
          className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg-card)] px-3 py-2.5 text-[var(--text-secondary)] focus:border-[var(--blue)] focus:outline-none"
        >
          {LOCATIONS.map((loc) => (
            <option key={loc} value={loc}>{loc}</option>
          ))}
        </select>
      </div>

      {/* PV size */}
      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-[var(--text-muted)] mb-2">
          <Sun size={16} /> Moc PV: <span className="text-[var(--green)] font-bold">{input.pv_kwp} kWp</span>
        </label>
        <input
          type="range"
          min={0} max={30} step={0.5}
          value={input.pv_kwp}
          onInput={(e) => setInput({ pv_kwp: Number((e.target as HTMLInputElement).value) })}
          onChange={(e) => setInput({ pv_kwp: Number(e.target.value) })}
          className="w-full accent-[var(--green)]"
        />
        <div className="flex justify-between text-xs text-[var(--text-dim)]">
          <span>0 kWp</span><span>30 kWp</span>
        </div>
      </div>

      {/* Battery */}
      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-[var(--text-muted)] mb-2">
          <Battery size={16} /> Magazyn energii: <span className="text-[var(--blue)] font-bold">{input.battery_kwh} kWh</span>
        </label>
        <input
          type="range"
          min={0} max={30} step={1}
          value={input.battery_kwh}
          onInput={(e) => setInput({ battery_kwh: Number((e.target as HTMLInputElement).value) })}
          onChange={(e) => setInput({ battery_kwh: Number(e.target.value) })}
          className="w-full accent-[var(--blue)]"
        />
        <div className="flex justify-between text-xs text-[var(--text-dim)]">
          <span>0 kWh</span><span>30 kWh</span>
        </div>
      </div>

      {/* Tariff */}
      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-[var(--text-muted)] mb-2">
          <Zap size={16} /> Taryfa
        </label>
        <select
          value={input.tariff}
          onChange={(e) => setInput({ tariff: e.target.value })}
          className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg-card)] px-3 py-2.5 text-[var(--text-secondary)] focus:border-[var(--blue)] focus:outline-none"
        >
          {TARIFFS.map((t) => (
            <option key={t.code} value={t.code}>{t.label}</option>
          ))}
        </select>
      </div>

      {/* Monthly consumption */}
      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-[var(--text-muted)] mb-2">
          Zuzycie miesiecznie: <span className="text-[var(--amber)] font-bold">{Math.round(input.monthly_consumption_kwh).toLocaleString("pl-PL")} kWh</span>
        </label>
        <input
          type="range"
          min={100} max={5000} step={50}
          value={input.monthly_consumption_kwh}
          onInput={(e) => setInput({ monthly_consumption_kwh: Number((e.target as HTMLInputElement).value) })}
          onChange={(e) => setInput({ monthly_consumption_kwh: Number(e.target.value) })}
          className="w-full accent-[var(--amber)]"
        />
        <div className="flex justify-between text-xs text-[var(--text-dim)]">
          <span>100 kWh</span><span>5 000 kWh</span>
        </div>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full rounded-lg bg-[var(--green)] px-4 py-3 font-bold text-[var(--bg-primary)] transition hover:opacity-90 disabled:opacity-50"
      >
        {isLoading ? "Obliczam..." : "Oblicz koszty"}
      </button>
    </form>
  );
}
