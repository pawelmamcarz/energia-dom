from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    cors_origins: list[str] = [
        "http://localhost:3000",
        "https://energia-dom.vercel.app",
    ]
    supabase_url: str = ""
    supabase_key: str = ""

    model_config = {"env_prefix": "ENERGIA_", "env_file": ".env"}


settings = Settings()
