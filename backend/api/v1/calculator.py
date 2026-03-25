from fastapi import APIRouter

from backend.calc.engine import run_calculation
from backend.core.constants import PV_YIELD_BY_REGION, TARIFFS
from backend.domain.schemas import (
    CalculatorInput,
    CalculatorResult,
    LocationInfo,
    TariffInfo,
)

router = APIRouter(prefix="/api/v1", tags=["calculator"])

TARIFF_NAMES = {
    "G11": "G11 — jednostrefowa",
    "G12": "G12 — dwustrefowa",
    "G12w": "G12w — weekendowa",
    "G13": "G13 — trzystrefowa",
}


@router.post("/calculate", response_model=CalculatorResult)
async def calculate(inp: CalculatorInput):
    return run_calculation(inp)


@router.get("/tariffs", response_model=list[TariffInfo])
async def get_tariffs():
    return [
        TariffInfo(code=code, name=TARIFF_NAMES.get(code, code), rates=t["rates"])
        for code, t in TARIFFS.items()
    ]


@router.get("/locations", response_model=list[LocationInfo])
async def get_locations():
    return [
        LocationInfo(name=name, lat=r["lat"], lon=r["lon"], yield_kwp=r["yield_kwp"])
        for name, r in sorted(PV_YIELD_BY_REGION.items())
    ]
