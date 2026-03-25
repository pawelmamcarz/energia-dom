from backend.core.constants import (
    MONTHLY_CONSUMPTION_PROFILE,
    NET_METERING_RETURN,
)
from backend.domain.schemas import CalculatorInput, CalculatorResult, MonthlyResult

from .cost import calculate_annual_cost_no_pv, calculate_monthly_cost
from .pv_production import distribute_monthly, estimate_annual_pv
from .self_consumption import estimate_self_consumption

MONTH_NAMES = [
    "Sty", "Lut", "Mar", "Kwi", "Maj", "Cze",
    "Lip", "Sie", "Wrz", "Paz", "Lis", "Gru",
]


def run_calculation(inp: CalculatorInput) -> CalculatorResult:
    """Run the full energy cost calculation."""
    # 1. Distribute annual consumption across months
    annual_consumption = inp.monthly_consumption_kwh * 12
    monthly_consumption = [
        round(annual_consumption * frac, 1)
        for frac in MONTHLY_CONSUMPTION_PROFILE
    ]

    # 2. Estimate PV production
    annual_pv = estimate_annual_pv(inp.location, inp.pv_kwp)
    monthly_pv = distribute_monthly(annual_pv)

    # 3. Self-consumption and export
    self_consumed, exported = estimate_self_consumption(
        monthly_consumption, monthly_pv, inp.battery_kwh
    )

    # 4. Monthly calculations
    monthly_results = []
    total_cost_net = 0.0
    total_cost_gross = 0.0
    total_nm_credit_pln = 0.0
    total_grid_import = 0.0
    total_grid_export = 0.0
    total_nm_credit_kwh = 0.0
    total_self_consumed = 0.0

    for i in range(12):
        grid_import = max(0, monthly_consumption[i] - self_consumed[i])
        grid_export = exported[i]
        nm_credit_kwh = round(grid_export * NET_METERING_RETURN, 1)

        cost_gross, nm_credit_pln, cost_net = calculate_monthly_cost(
            grid_import, nm_credit_kwh, inp.tariff
        )

        monthly_results.append(
            MonthlyResult(
                month=MONTH_NAMES[i],
                pv_production=monthly_pv[i],
                consumption=monthly_consumption[i],
                self_consumed=self_consumed[i],
                grid_import=round(grid_import, 1),
                grid_export=grid_export,
                nm_credit_kwh=nm_credit_kwh,
                cost_gross=cost_gross,
                nm_credit_pln=nm_credit_pln,
                cost_net=cost_net,
            )
        )

        total_cost_net += cost_net
        total_cost_gross += cost_gross
        total_nm_credit_pln += nm_credit_pln
        total_grid_import += grid_import
        total_grid_export += grid_export
        total_nm_credit_kwh += nm_credit_kwh
        total_self_consumed += self_consumed[i]

    # 5. Summaries
    total_pv = sum(monthly_pv)
    cost_no_pv = calculate_annual_cost_no_pv(annual_consumption, inp.tariff)

    self_consumption_ratio = (
        round(total_self_consumed / total_pv, 3) if total_pv > 0 else 0.0
    )
    pv_coverage_ratio = (
        round(total_pv / annual_consumption, 3) if annual_consumption > 0 else 0.0
    )

    return CalculatorResult(
        annual_cost_with_pv=round(total_cost_net, 0),
        annual_cost_without_pv=round(cost_no_pv, 0),
        annual_savings=round(cost_no_pv - total_cost_net, 0),
        annual_pv_production=round(total_pv, 0),
        annual_consumption=round(annual_consumption, 0),
        annual_grid_import=round(total_grid_import, 0),
        annual_grid_export=round(total_grid_export, 0),
        annual_nm_credit_kwh=round(total_nm_credit_kwh, 0),
        self_consumption_ratio=self_consumption_ratio,
        pv_coverage_ratio=pv_coverage_ratio,
        monthly=monthly_results,
        location=inp.location,
        pv_kwp=inp.pv_kwp,
        battery_kwh=inp.battery_kwh,
        tariff=inp.tariff,
    )
