# Tariff rates (PLN/kWh) - Polish energy tariffs 2025/2026
TARIFFS = {
    "G11": {
        "rates": {"flat": 0.65},
        "peak_ratio": 1.0,  # all hours same rate
    },
    "G12": {
        "rates": {"peak": 0.72, "offpeak": 0.43},
        "peak_ratio": 0.40,  # 40% peak hours
    },
    "G12w": {
        "rates": {"peak": 0.72, "offpeak": 0.43},
        "peak_ratio": 0.35,  # 35% peak (weekends offpeak)
    },
    "G13": {
        "rates": {"peak": 0.85, "shoulder": 0.65, "offpeak": 0.38},
        "peak_ratio": 0.25,
        "shoulder_ratio": 0.35,
    },
}

# Net-metering return ratio (prosument)
NET_METERING_RETURN = 0.80

# Monthly PV production profile (Jan-Dec), normalized fractions summing to 1.0
# Derived from real Fusion Solar data (Jesionowa, central Poland):
# Jan:190, Feb:378, Mar:1494, Apr:2645, May:2602, Jun:2676, Jul:2304, Aug:2478, Sep:1345, Oct:546, Nov:272, Dec:154
_RAW_PV = [190, 378, 1494, 2645, 2602, 2676, 2304, 2478, 1345, 546, 272, 154]
_PV_TOTAL = sum(_RAW_PV)
MONTHLY_PV_PROFILE = [v / _PV_TOTAL for v in _RAW_PV]

# Monthly consumption profile (Jan-Dec), normalized fractions
# Derived from real data: higher in winter (HP + heating), lower in summer
_RAW_CONSUMPTION = [4673, 3038, 2280, 2300, 2300, 1935, 1736, 2198, 1581, 2118, 3061, 3327]
_CONS_TOTAL = sum(_RAW_CONSUMPTION)
MONTHLY_CONSUMPTION_PROFILE = [v / _CONS_TOTAL for v in _RAW_CONSUMPTION]

# Annual PV yield per kWp by region (kWh/kWp/year)
# Source: PVGIS typical values for Poland
PV_YIELD_BY_REGION = {
    "Warszawa": {"lat": 52.23, "lon": 21.01, "yield_kwp": 1020},
    "Krakow": {"lat": 50.06, "lon": 19.94, "yield_kwp": 1030},
    "Wroclaw": {"lat": 51.11, "lon": 17.04, "yield_kwp": 1050},
    "Poznan": {"lat": 52.41, "lon": 16.93, "yield_kwp": 1010},
    "Gdansk": {"lat": 54.35, "lon": 18.65, "yield_kwp": 960},
    "Szczecin": {"lat": 53.43, "lon": 14.55, "yield_kwp": 980},
    "Lublin": {"lat": 51.25, "lon": 22.57, "yield_kwp": 1040},
    "Katowice": {"lat": 50.26, "lon": 19.03, "yield_kwp": 1020},
    "Bialystok": {"lat": 53.13, "lon": 23.16, "yield_kwp": 970},
    "Rzeszow": {"lat": 50.04, "lon": 22.00, "yield_kwp": 1050},
    "Opole": {"lat": 50.67, "lon": 17.93, "yield_kwp": 1045},
    "Zielona Gora": {"lat": 51.94, "lon": 15.51, "yield_kwp": 1030},
    "Kielce": {"lat": 50.87, "lon": 20.63, "yield_kwp": 1035},
    "Olsztyn": {"lat": 53.78, "lon": 20.49, "yield_kwp": 950},
    "Lodz": {"lat": 51.75, "lon": 19.47, "yield_kwp": 1015},
}

# Default values for MVP
DEFAULT_LOCATION = "Wroclaw"
DEFAULT_PV_KWP = 10.0
DEFAULT_BATTERY_KWH = 0.0
DEFAULT_MONTHLY_CONSUMPTION = 500  # kWh/month
DEFAULT_TARIFF = "G12w"
