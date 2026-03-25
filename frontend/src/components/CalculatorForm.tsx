"use client";

import { useState } from "react";
import { useCalculatorStore } from "@/store/calculator";
import { REGIONS, SELLERS, TARIFFS } from "@/lib/constants";
import { Sun, Battery, Zap, MapPin, Building2 } from "lucide-react";

export default function CalculatorForm() {
  const runCalculation = useCalculatorStore((s) => s.runCalculation);

  const [region, setRegion] = useState("dolnoslaskie");
  const [seller, setSeller] = useState("Tauron");
  const [tariff, setTariff] = useState("G12w");
  const [pvKwp, setPvKwp] = useState(10);
  const [batteryKwh, setBatteryKwh] = useState(0);
  const [consumption, setConsumption] = useState(500);

  // When region changes, update seller to default for that region
  const handleRegionChange = (code: string) => {
    setRegion(code);
    const reg = REGIONS.find((r) => r.code === code);
    if (reg) {
      setSeller(reg.seller);
      // Check if current tariff is available for new seller
      const available = SELLERS[reg.seller]?.tariffs ?? [];
      if (!available.includes(tariff)) {
        setTariff(available[0] ?? "G11");
      }
    }
  };

  // When seller changes, check tariff availability
  const handleSellerChange = (s: string) => {
    setSeller(s);
    const available = SELLERS[s]?.tariffs ?? [];
    if (!available.includes(tariff)) {
      setTariff(available[0] ?? "G11");
    }
  };

  const availableTariffs = SELLERS[seller]?.tariffs ?? Object.keys(TARIFFS);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    runCalculation({
      region,
      seller,
      pv_kwp: pvKwp,
      battery_kwh: batteryKwh,
      tariff,
      monthly_consumption_kwh: consumption,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Region (województwo) */}
      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-[var(--text-muted)] mb-2">
          <MapPin size={16} /> Wojewodztwo
        </label>
        <select
          value={region}
          onChange={(e) => handleRegionChange(e.target.value)}
          className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg-card)] px-3 py-2.5 text-[var(--text-secondary)] focus:border-[var(--blue)] focus:outline-none"
        >
          {REGIONS.map((r) => (
            <option key={r.code} value={r.code}>
              {r.name} ({r.yield_kwp} kWh/kWp)
            </option>
          ))}
        </select>
      </div>

      {/* Seller (sprzedawca) */}
      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-[var(--text-muted)] mb-2">
          <Building2 size={16} /> Sprzedawca energii
        </label>
        <select
          value={seller}
          onChange={(e) => handleSellerChange(e.target.value)}
          className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg-card)] px-3 py-2.5 text-[var(--text-secondary)] focus:border-[var(--blue)] focus:outline-none"
        >
          {Object.entries(SELLERS).map(([key, s]) => (
            <option key={key} value={key}>
              {s.name}
            </option>
          ))}
        </select>
      </div>

      {/* Tariff */}
      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-[var(--text-muted)] mb-2">
          <Zap size={16} /> Taryfa
        </label>
        <select
          value={tariff}
          onChange={(e) => setTariff(e.target.value)}
          className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg-card)] px-3 py-2.5 text-[var(--text-secondary)] focus:border-[var(--blue)] focus:outline-none"
        >
          {availableTariffs.map((code) => (
            <option key={code} value={code}>
              {TARIFFS[code]?.label ?? code}
            </option>
          ))}
        </select>
      </div>

      {/* PV size */}
      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-[var(--text-muted)] mb-2">
          <Sun size={16} /> Moc PV:{" "}
          <span className="text-[var(--green)] font-bold">{pvKwp} kWp</span>
        </label>
        <input
          type="range"
          min={0}
          max={30}
          step={0.5}
          value={pvKwp}
          onInput={(e) => setPvKwp(Number((e.target as HTMLInputElement).value))}
          className="w-full accent-[var(--green)]"
        />
        <div className="flex justify-between text-xs text-[var(--text-dim)]">
          <span>0 kWp</span>
          <span>30 kWp</span>
        </div>
      </div>

      {/* Battery */}
      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-[var(--text-muted)] mb-2">
          <Battery size={16} /> Magazyn energii:{" "}
          <span className="text-[var(--blue)] font-bold">{batteryKwh} kWh</span>
        </label>
        <input
          type="range"
          min={0}
          max={30}
          step={1}
          value={batteryKwh}
          onInput={(e) =>
            setBatteryKwh(Number((e.target as HTMLInputElement).value))
          }
          className="w-full accent-[var(--blue)]"
        />
        <div className="flex justify-between text-xs text-[var(--text-dim)]">
          <span>0 kWh</span>
          <span>30 kWh</span>
        </div>
      </div>

      {/* Monthly consumption */}
      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-[var(--text-muted)] mb-2">
          Zuzycie miesiecznie:{" "}
          <span className="text-[var(--amber)] font-bold">
            {consumption.toLocaleString("pl-PL")} kWh
          </span>
        </label>
        <input
          type="range"
          min={100}
          max={5000}
          step={50}
          value={consumption}
          onInput={(e) =>
            setConsumption(Number((e.target as HTMLInputElement).value))
          }
          className="w-full accent-[var(--amber)]"
        />
        <div className="flex justify-between text-xs text-[var(--text-dim)]">
          <span>100 kWh</span>
          <span>5 000 kWh</span>
        </div>
      </div>

      {/* Submit */}
      <button
        type="submit"
        className="w-full rounded-lg bg-[var(--green)] px-4 py-3 font-bold text-[var(--bg-primary)] transition hover:opacity-90"
      >
        Oblicz koszty
      </button>
    </form>
  );
}
