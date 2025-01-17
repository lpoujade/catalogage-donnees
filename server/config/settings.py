from typing import Literal

from pydantic import BaseSettings
from sqlalchemy.engine.url import make_url

ServerMode = Literal["local", "live"]


class Settings(BaseSettings):
    # For usage, see: https://pydantic-docs.helpmanual.io/usage/settings/

    server_mode: ServerMode = "local"
    database_url: str = "postgresql+asyncpg://localhost:5432/catalogage"
    host: str = "localhost"
    port: int = 3579
    docs_url: str = "/docs"
    sql_debug: bool = False
    testing: bool = False

    class Config:
        env_prefix = "app_"
        env_file = ".env"

    @property
    def test_database_url(self) -> str:
        url = make_url(self.database_url)
        url = url.set(database=f"{url.database}-test")
        return str(url)

    @property
    def sync_test_database_url(self) -> str:
        url = make_url(self.test_database_url)
        url = url.set(
            drivername="postgresql",  # Test database setup uses sync engine
        )
        return str(url)

    @property
    def env_database_url(self) -> str:
        return self.test_database_url if self.testing else self.database_url
