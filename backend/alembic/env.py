import sys
import os
from pathlib import Path
from logging.config import fileConfig

from sqlalchemy import engine_from_config
from sqlalchemy import pool

from alembic import context

# alembic/ is parallel to app/
# to use modules from app/, need to add parent dir backend/ to Python search path so it can find app/
# if alembic/ inside app/, remove this line
# sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
sys.path.append(str(Path(__file__).resolve().parent.parent))

# this is the Alembic Config object, which provides
# access to the values within the .ini file in use.
config = context.config

# Interpret the config file for Python logging.
# This line sets up loggers basically.
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

from app.models import SQLModel # noqa
from app.core.config import settings # noqa

# add your model's MetaData object here
# for 'autogenerate' support
# from myapp import mymodel
# target_metadata = mymodel.Base.metadata
# target_metadata tells Alembic what DB tables to expect when generating migrations
target_metadata = SQLModel.metadata


# other values from the config, defined by the needs of env.py,
# can be acquired:
# my_important_option = config.get_main_option("my_important_option")
# ... etc.

def get_url():
    return str(settings.SQLALCHEMY_DATABASE_URI)


def run_migrations_offline() -> None:
    """Run migrations in 'offline' mode.

    This configures the context with just a URL
    and not an Engine, though an Engine is acceptable
    here as well.  By skipping the Engine creation
    we don't even need a DBAPI to be available.

    Calls to context.execute() here emit the given string to the
    script output.

    What happens: Alembic does NOT connect to DB and applies updates.
    Instead, it writes table updates as SQL statements and saves them to a file.
    Useful when need to send out table updates for review by other teams before applying them to DB.

    """
    url = get_url() # DB connection URL
    context.configure(
        url=url,
        target_metadata=target_metadata, # Alembic compares this to the current DB tables to decide what updates are needed.
        literal_binds=True, # SQL queries in migration files contain actual values, not placeholders.
        dialect_opts={"paramstyle": "named"}, # use named-style placeholders in SQL queries
        compare_type=True, # detect column type changes when updating
    )

    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    """Run migrations in 'online' mode.

    In this scenario we need to create an Engine
    and associate a connection with the context.

    What happens: Alembic actually connects to DB on Lightsail server and applies table updates.

    """
    configuration = config.get_section(config.config_ini_section)
    configuration['sqlalchemy.url'] = get_url()
    connectable = engine_from_config(
        configuration,
        prefix='sqlalchemy.',
        poolclass=pool.NullPool,
    )

    with connectable.connect() as connection:
        context.configure(
            connection=connection, target_metadata=target_metadata, compare_type=True
        )

        with context.begin_transaction():
            context.run_migrations()

# online mode command: alembic upgrade head
# offline mode command: alembic upgrade head --sql
if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
