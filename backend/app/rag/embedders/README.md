# Workflow
```
.env → Settings.embed_profiles → EmbedProfile
        ↓
bootstrap.py (generic loop) # Bootstrap过程指的是加载一系列递归的初始化代码块, "做所有其他东西都依赖的启动工作，从几乎一无所有开始"
        ↓
registry.get_adapter(provider)
        ↓
adapter(settings, profile) → kwargs
        ↓
registry.get_builder(provider)(**kwargs)
        ↓
EmbedderProvider.configure(key, instance)


.env (JSON string)
   ↓ JSON parsed to Pydantic model ProfileEntry
Settings.embed_profiles -> List[ProfileEntry]
   ↓ (bootstrap.py converts)
EmbedProfile(key, provider, language, params)
   ↓
adapter(settings, profile) -> kwargs
   ↓
builder(**kwargs) -> EmbeddingClient
   ↓
EmbedderProvider.configure(key, instance)

```

## Directory Structure
```
app/
  rag/
    embedders/
      __init__.py
      bootstrap.py
      protocol.py
      profile.py
      provider.py
      registry.py
      util.py
      models/
        __init__.py
        huggingface.py
        openai.py        # <-- add new, optional stub (enable when ready)

```