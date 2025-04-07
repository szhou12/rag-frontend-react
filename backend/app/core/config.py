import secrets
import warnings
from typing import Annotated, Any, Literal

from pydantic import (
    AnyUrl,
    BeforeValidator,
    EmailStr,
    HttpUrl,
    computed_field,
    model_validator,
    PostgresDsn,
    MySQLDsn,
)
from pydantic_core import MultiHostUrl
from pydantic_settings import BaseSettings, SettingsConfigDict
from typing_extensions import Self

def parse_cors(v: Any) -> list[str] | str:
    """
    Parse CORS origins input and normalize it into a list of URLs.

    This function processes CORS origins provided in various formats and returns a consistent list of URLs.
    It supports:
      - A single URL as a string.
      - A comma-separated string of URLs.
      - A list of URLs.
    
    Args:
        v (Any): The input CORS origins. Can be a string, a list of strings, or a comma-separated string.

    Returns:
        list[str] | str: A list of URLs if the input is a valid string or list, or the original string if valid.

    Raises:
        ValueError: If the input is not a valid string or list of URLs.

    Example Usage:
        parse_cors("https://example.com")  # Returns: ['https://example.com']
        parse_cors("https://example.com, https://another.com")  # Returns: ['https://example.com', 'https://another.com']
        parse_cors(["https://example.com", "https://another.com"])  # Returns: ['https://example.com', 'https://another.com']
    """
    if isinstance(v, str) and not v.startswith("["):
        return [i.strip() for i in v.split(",")]
    elif isinstance(v, list | str):
        return v
    raise ValueError(v)

class Settings(BaseSettings):

    # Configuration Metadata
    model_config = SettingsConfigDict(
        env_file="../.env", # Path to .env file - go one level up from where you run uvicorn
        env_ignore_empty=True, # Ignore empty environment variables
        extra="ignore", # Ignore extra keys that are not explicitly declared
    )

    # Core Settings
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str = secrets.token_urlsafe(32) # Generate a random secret key string (32 chars)
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 8 # token expires in 8 days = 60 minutes * 24 hours * 8 days
    FRONTEND_HOST: str = "http://localhost:5173" # Frontend host URL
    ENVIRONMENT: Literal["local", "staging", "production"] = "local"

    # CORS Configuration
    ## Specify which domains are allowed to access the backend
    BACKEND_CORS_ORIGINS: Annotated[
        list[AnyUrl] | str, BeforeValidator(parse_cors)
    ] = []

    @computed_field     # Ensure function's returned (computed) value included in JSON output
    @property           # Allow calling as settings.all_cors_origins instead of settings.all_cors_origins()
    def all_cors_origins(self) -> list[str]:
        return [str(origin).rstrip("/") for origin in self.BACKEND_CORS_ORIGINS] + [
            self.FRONTEND_HOST
        ]
    
    # MySQL Database Configuration: load values from .env
    MYSQL_USER: str
    MYSQL_PASSWORD: str
    MYSQL_HOST: str
    MYSQL_PORT: int
    MYSQL_DB: str

    # First Admin Configuration: load values from .env
    FIRST_SUPERUSER: EmailStr
    FIRST_SUPERUSER_PASSWORD: str

    @computed_field
    @property
    def SQLALCHEMY_DATABASE_URI(self) -> MySQLDsn:
        """
        Builds the MySQL database connection URI for SQLAlchemy.
        
        Returns:
            MySQLDsn: Connection URI string
            Example: 'mysql+pymysql://root:password@localhost:3306/test_react'
        """
        return MySQLDsn.build(
            scheme="mysql+pymysql", # MySQL driver
            user=self.MYSQL_USER,
            password=self.MYSQL_PASSWORD,
            host=self.MYSQL_HOST,
            port=str(self.MYSQL_PORT),
            path=f"/{self.MYSQL_DB}"  # Important: Include '/' before DB name
        )
    
    
    # TODO
    # Email Server Configuration

# Initialization Load all configurations
settings = Settings()


