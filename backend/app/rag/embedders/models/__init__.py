# Importing a provider module executes its @register(...) decorator.
from .huggingface import *  # noqa: F401

# Enable later as you implement them:
# from .http import *       # noqa: F401
# from .openai import *     # noqa: F401
# from .bedrock import *    # noqa: F401
