from backend.core.constants import MONTHLY_PV_PROFILE, PV_YIELD_BY_REGION


def estimate_annual_pv(location: str, pv_kwp: float) -> float:
    """Estimate annual PV production in kWh based on location and system size."""
    region = PV_YIELD_BY_REGION.get(location)
    if not region:
        yield_per_kwp = 1020  # fallback: Poland average
    else:
        yield_per_kwp = region["yield_kwp"]
    return pv_kwp * yield_per_kwp


def distribute_monthly(annual_kwh: float) -> list[float]:
    """Distribute annual PV production across 12 months (Jan-Dec)."""
    return [round(annual_kwh * frac, 1) for frac in MONTHLY_PV_PROFILE]
