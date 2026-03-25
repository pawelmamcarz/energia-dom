// Województwa z uzyskiem PV i domyślnym sprzedawcą
export const REGIONS = [
  { code: "dolnoslaskie", name: "Dolnoslaskie", yield_kwp: 1050, seller: "Tauron" },
  { code: "kujawsko-pomorskie", name: "Kujawsko-pomorskie", yield_kwp: 1000, seller: "Enea" },
  { code: "lubelskie", name: "Lubelskie", yield_kwp: 1040, seller: "PGE" },
  { code: "lubuskie", name: "Lubuskie", yield_kwp: 1030, seller: "Enea" },
  { code: "lodzkie", name: "Lodzkie", yield_kwp: 1015, seller: "PGE" },
  { code: "malopolskie", name: "Malopolskie", yield_kwp: 1030, seller: "Tauron" },
  { code: "mazowieckie", name: "Mazowieckie", yield_kwp: 1020, seller: "PGE" },
  { code: "opolskie", name: "Opolskie", yield_kwp: 1045, seller: "Tauron" },
  { code: "podkarpackie", name: "Podkarpackie", yield_kwp: 1050, seller: "PGE" },
  { code: "podlaskie", name: "Podlaskie", yield_kwp: 970, seller: "PGE" },
  { code: "pomorskie", name: "Pomorskie", yield_kwp: 960, seller: "Energa" },
  { code: "slaskie", name: "Slaskie", yield_kwp: 1020, seller: "Tauron" },
  { code: "swietokrzyskie", name: "Swietokrzyskie", yield_kwp: 1035, seller: "PGE" },
  { code: "warminsko-mazurskie", name: "Warminsko-mazurskie", yield_kwp: 950, seller: "PGE" },
  { code: "wielkopolskie", name: "Wielkopolskie", yield_kwp: 1010, seller: "Enea" },
  { code: "zachodniopomorskie", name: "Zachodniopomorskie", yield_kwp: 980, seller: "Enea" },
] as const;

export type RegionCode = (typeof REGIONS)[number]["code"];

// Sprzedawcy energii z ich taryfami
export const SELLERS: Record<
  string,
  { name: string; tariffs: string[] }
> = {
  PGE: { name: "PGE Obrót", tariffs: ["G11", "G12", "G12w", "G13", "dynamiczna"] },
  Tauron: { name: "Tauron Sprzedaż", tariffs: ["G11", "G12", "G12w", "dynamiczna"] },
  Enea: { name: "Enea S.A.", tariffs: ["G11", "G12", "G12w", "dynamiczna"] },
  Energa: { name: "Energa Obrót", tariffs: ["G11", "G12", "G12w", "G13", "dynamiczna"] },
};

// Taryfy z cenami (PLN/kWh brutto z dystrybucją)
export const TARIFFS: Record<
  string,
  { label: string; rates: Record<string, number>; peak_ratio: number }
> = {
  G11: {
    label: "G11 — jednostrefowa",
    rates: { flat: 0.65 },
    peak_ratio: 1.0,
  },
  G12: {
    label: "G12 — dwustrefowa",
    rates: { peak: 0.72, offpeak: 0.43 },
    peak_ratio: 0.40,
  },
  G12w: {
    label: "G12w — weekendowa",
    rates: { peak: 0.72, offpeak: 0.43 },
    peak_ratio: 0.35,
  },
  G13: {
    label: "G13 — trzystrefowa",
    rates: { peak: 0.85, shoulder: 0.65, offpeak: 0.38 },
    peak_ratio: 0.25,
  },
  dynamiczna: {
    label: "Dynamiczna (ceny godzinowe TGE)",
    rates: { peak: 0.95, day: 0.45, offpeak: 0.25 },
    peak_ratio: 0.20,
  },
};

// Net-metering
export const NET_METERING_RETURN = 0.80;

// Profil produkcji PV (Sty-Gru), znormalizowany do sumy = 1.0
// Z realnych danych Fusion Solar (centralna Polska)
const RAW_PV = [190, 378, 1494, 2645, 2602, 2676, 2304, 2478, 1345, 546, 272, 154];
const PV_TOTAL = RAW_PV.reduce((a, b) => a + b, 0);
export const MONTHLY_PV_PROFILE = RAW_PV.map((v) => v / PV_TOTAL);

// Profil zużycia (Sty-Gru), znormalizowany
const RAW_CONSUMPTION = [4673, 3038, 2280, 2300, 2300, 1935, 1736, 2198, 1581, 2118, 3061, 3327];
const CONS_TOTAL = RAW_CONSUMPTION.reduce((a, b) => a + b, 0);
export const MONTHLY_CONSUMPTION_PROFILE = RAW_CONSUMPTION.map((v) => v / CONS_TOTAL);

export const MONTH_NAMES = [
  "Sty", "Lut", "Mar", "Kwi", "Maj", "Cze",
  "Lip", "Sie", "Wrz", "Paz", "Lis", "Gru",
];
