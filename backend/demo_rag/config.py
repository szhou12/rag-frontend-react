from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file="../../.env",  # Go up two levels to reach root .env
        env_ignore_empty=True,
        extra="ignore",
    )

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

settings = Settings()
