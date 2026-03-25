from pydantic import BaseModel, Field


class CalculatorInput(BaseModel):
    location: str = Field(description="City name from available locations")
    pv_kwp: float = Field(ge=0, le=50, description="PV system size in kWp")
    battery_kwh: float = Field(ge=0, le=50, description="Battery storage in kWh")
    tariff: str = Field(description="Tariff code: G11, G12, G12w, G13")
    monthly_consumption_kwh: float = Field(
        ge=50, le=10000, description="Average monthly consumption in kWh"
    )


class MonthlyResult(BaseModel):
    month: str
    pv_production: float
    consumption: float
    self_consumed: float
    grid_import: float
    grid_export: float
    nm_credit_kwh: float
    cost_gross: float
    nm_credit_pln: float
    cost_net: float


class CalculatorResult(BaseModel):
    # Annual totals
    annual_cost_with_pv: float
    annual_cost_without_pv: float
    annual_savings: float
    annual_pv_production: float
    annual_consumption: float
    annual_grid_import: float
    annual_grid_export: float
    annual_nm_credit_kwh: float
    self_consumption_ratio: float
    pv_coverage_ratio: float

    # Monthly breakdown
    monthly: list[MonthlyResult]

    # Input echo (for display)
    location: str
    pv_kwp: float
    battery_kwh: float
    tariff: str


class TariffInfo(BaseModel):
    code: str
    name: str
    rates: dict[str, float]


class LocationInfo(BaseModel):
    name: str
    lat: float
    lon: float
    yield_kwp: int
