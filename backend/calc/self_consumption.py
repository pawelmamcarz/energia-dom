def estimate_self_consumption(
    monthly_consumption: list[float],
    monthly_pv: list[float],
    battery_kwh: float,
) -> tuple[list[float], list[float]]:
    """
    Estimate monthly self-consumption and export.

    Returns (self_consumed_per_month, exported_per_month).

    Without battery: self_consumed = min(consumption, pv)
    With battery: battery shifts some export to self-consumption.
    Battery bonus per month = battery_kwh * 30 days * 0.8 utilization, capped at available export.
    """
    self_consumed = []
    exported = []

    for cons, pv in zip(monthly_consumption, monthly_pv):
        # Base: direct self-consumption
        direct = min(cons, pv)
        surplus = max(0, pv - cons)

        # Battery shifts surplus to self-consumption
        if battery_kwh > 0 and surplus > 0:
            battery_monthly_capacity = battery_kwh * 30 * 0.8
            from_battery = min(surplus, battery_monthly_capacity)
            direct += from_battery
            surplus -= from_battery

        self_consumed.append(round(direct, 1))
        exported.append(round(surplus, 1))

    return self_consumed, exported
