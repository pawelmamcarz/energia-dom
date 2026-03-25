from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.api.v1.calculator import router as calculator_router
from backend.core.config import settings

app = FastAPI(
    title="Energia Dom API",
    description="Kalkulator kosztow energii dla domu z PV",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(calculator_router)


@app.get("/health")
async def health():
    return {"status": "ok"}
