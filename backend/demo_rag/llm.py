from langchain_aws import ChatBedrock
# from .config import settings
from app.core.config import settings

def build_llm():
    # Prefer IAM role on EC2/ECS/EKS. Keys are optional fallbacks.
    kwargs = dict(
        model_id=settings.bedrock_model_id,
        region_name=settings.aws_region,
        model_kwargs={"temperature": settings.temperature},
        max_tokens=settings.max_tokens,
        stop=["<END_OF_RESPONSE>"]
    )
    if settings.aws_access_key_id and settings.aws_secret_access_key:
        kwargs.update(
            aws_access_key_id=settings.aws_access_key_id,
            aws_secret_access_key=settings.aws_secret_access_key,
        )
    return ChatBedrock(**kwargs)
