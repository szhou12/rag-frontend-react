"""
Generic bootstrap: iterate profiles from Settings, adapt, build, configure.
No branching per provider/language here.
"""

from app.core.config import settings  # app-wide Settings
from .models import *              # ensure models register
from .registry import get_adapter
from .profile import EmbedProfile
from .provider import EmbedderProvider

def configure_embedders_from_settings() -> None:
    for raw in settings.embed_profiles:
        profile = EmbedProfile(
            key=raw.key,
            provider=raw.provider,
            language=raw.language,
            params=raw.params,
        )
        adapter = get_adapter(profile.provider)
        kwargs = adapter(settings, profile)     # resolve defaults + secrets
        EmbedderProvider.configure(profile.key, provider=profile.provider, **kwargs)
