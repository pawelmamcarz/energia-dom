from backend.core.constants import NET_METERING_RETURN, TARIFFS


def get_blended_rate(tariff: str) -> float:
    """Calculate blended electricity rate for a tariff."""
    t = TARIFFS.get(tariff, TARIFFS["G12w"])
    rates = t["rates"]

    if "flat" in rates:
        return rates["flat"]

    if "shoulder" in rates:
        # G13: three zones
        peak_r = t["peak_ratio"]
        shoulder_r = t.get("shoulder_ratio", 0.35)
        offpeak_r = 1.0 - peak_r - shoulder_r
        return (
            rates["peak"] * peak_r
            + rates["shoulder"] * shoulder_r
            + rates["offpeak"] * offpeak_r
        )

    # G12, G12w: two zones
    peak_r = t["peak_ratio"]
    return rates["peak"] * peak_r + rates["offpeak"] * (1.0 - peak_r)


def calculate_monthly_cost(
    grid_import: float,
    nm_credit_kwh: float,
    tariff: str,
) -> tuple[float, float, float]:
    """
    Calculate monthly cost with net-metering.

    Returns (cost_gross, nm_credit_pln, cost_net).
    """
    rate = get_blended_rate(tariff)
    cost_gross = round(grid_import * rate, 1)
    nm_credit_pln = round(nm_credit_kwh * rate, 1)
    cost_net = round(cost_gross - nm_credit_pln, 1)
    return cost_gross, nm_credit_pln, cost_net


def calculate_annual_cost_no_pv(annual_consumption: float, tariff: str) -> float:
    """Cost if all energy came from the grid (no PV)."""
    rate = get_blended_rate(tariff)
    return round(annual_consumption * rate, 1)
