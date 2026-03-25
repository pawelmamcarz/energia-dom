import type {
  CalculatorInput,
  CalculatorResult,
  LocationInfo,
  TariffInfo,
} from "./types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "/api/v1";

async function fetchJSON<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${url}`, options);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API error ${res.status}: ${text}`);
  }
  return res.json();
}

export async function calculate(
  input: CalculatorInput,
): Promise<CalculatorResult> {
  return fetchJSON<CalculatorResult>("/calculate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
}

export async function getTariffs(): Promise<TariffInfo[]> {
  return fetchJSON<TariffInfo[]>("/tariffs");
}

export async function getLocations(): Promise<LocationInfo[]> {
  return fetchJSON<LocationInfo[]>("/locations");
}
