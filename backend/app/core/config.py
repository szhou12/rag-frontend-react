from pathlib import Path 
import secrets
import warnings
from typing import Annotated, Any, Dict, Literal

from pydantic import (
    AnyUrl,
    BaseModel,
    BeforeValidator,
    EmailStr,
    Field,
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


class EmbedProfileEntry(BaseModel):
    key: str
    provider: str
    language: str

    # allow provider-specific extras inline; collect as `params`
    model_config = {"extra": "allow"}
    params: Dict[str, Any] = Field(default_factory=dict)

    @model_validator(mode="after")
    def _collect_extras(self):
        extras = {k: v for k, v in self.__dict__.items()
                  if k not in {"key", "provider", "language", "params"}}
        if extras:
            self.params.update(extras)
            for k in extras:
                delattr(self, k)
        return self

# builds absolute path starting from where this config.py is located and then go 3 levels up, which is root
REPO_ROOT = Path(__file__).resolve().parents[3]  # back 3 levels up to .../rag-frontend-react
class Settings(BaseSettings):

    # Configuration Metadata
    # model_config loads values from .env and assigns them to the corresponding attributes
    model_config = SettingsConfigDict(
        # env_file="../.env", # Path to .env file - one level up from /backend
        env_file=str(REPO_ROOT / ".env"),
        env_ignore_empty=True, # Ignore empty environment variables
        extra="ignore", # Ignore extra keys that are not explicitly declared
    )

    # Core Settings
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str = secrets.token_urlsafe(32) # Generate a random secret key string (32 chars)
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 8 # token expires in 8 days = 60 minutes * 24 hours * 8 days
    FRONTEND_HOST: str = "http://localhost:5173" # Frontend host URL
    ENVIRONMENT: Literal["local", "staging", "production"] = "local"
    
    ROLE_SCOPES: Dict[str, list[str]] = {
        "client": ["chat"],
        "staff": ["chat", "dashboard"],
        "admin": ["chat", "dashboard", "dashboard:admin"]
    }

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
    
    # MySQL Database Configuration: load values from .env by model_config
    MYSQL_USER: str
    MYSQL_PASSWORD: str
    MYSQL_HOST: str
    MYSQL_PORT: int
    MYSQL_NAME: str

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
            username=self.MYSQL_USER,
            password=self.MYSQL_PASSWORD,
            host=self.MYSQL_HOST,
            port=self.MYSQL_PORT,
            path=self.MYSQL_NAME  # Database name without leading slash
        )
    
    
    # TODO
    # Email Server Configuration

    # Embedder Configuration
    embed_profiles: list[EmbedProfileEntry] = Field(default_factory=list)

    ## from demo_rag/config.py
    # S3
    s3_bucket_name: str = Field(..., env="S3_BUCKET_NAME")

    # Embeddings
    embed_en_model: str = Field("BAAI/bge-small-en-v1.5", env="EMBED_EN_MODEL") # first look at .env for EMBED_EN_MODEL. if not found, use the default value defined here
    embed_zh_model: str = Field("BAAI/bge-small-zh-v1.5", env="EMBED_ZH_MODEL")
    embed_device: str = Field("cpu", env="EMBED_DEVICE")  # "cuda" on GPU nodes
    embed_normalize: bool = Field(True, env="EMBED_NORMALIZE")

    # Chroma
    chroma_host: str = Field(..., env="CHROMA_HOST")
    chroma_port: int = Field(8000, env="CHROMA_PORT")
    chroma_collection_en: str = Field("docs_en", env="CHROMA_COLLECTION_EN")
    chroma_collection_zh: str = Field("docs_zh", env="CHROMA_COLLECTION_ZH")

    # Retrieval
    search_type: str = Field("mmr", env="SEARCH_TYPE")
    search_k: int = Field(5, env="SEARCH_K")
    search_fetch_k: int = Field(20, env="SEARCH_FETCH_K")
    search_lambda_mult: float = Field(0.2, env="SEARCH_LAMBDA_MULT")

    # LLM (Bedrock)
    aws_region: str = Field("us-west-2", env="AWS_REGION")
    bedrock_model_id: str = Field("anthropic.claude-3-5-sonnet-20240620-v1:0", env="BEDROCK_MODEL_ID")
    # Credentials: prefer IAM role. If you must use keys, set envs:
    aws_access_key_id: str | None = Field(None, env="AWS_ACCESS_KEY_ID")
    aws_secret_access_key: str | None = Field(None, env="AWS_SECRET_ACCESS_KEY")

    # Generation
    temperature: float = Field(0.0, env="GEN_TEMPERATURE")
    max_tokens: int = Field(3000, env="GEN_MAX_TOKENS")


# Initialization Load all configurations
settings = Settings()

# NOTE: to print out if env values are loaded here
# in terminal, at backend/ and type: python -c "from app.core.config import settings; print(settings.model_dump())"
