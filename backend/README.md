## Table of Contents
- [Review Backend Development General Concepts](#review-backend-development-general-concepts)
- [Review `sqlmodel`](#review-sqlmodel)
- [Review `FastAPI`](#review-fastapi)
- [Helpful Links](#helpful-links)
## Review Backend Development General Concepts
1. What is the relationship between a web framework (FastAPI) and a web server (Uvicorn)? Can you use a daily-life analogy to explain it?

2. What is email server for? why would we want to consider using it in a web application?

3. is "sub" a default keyword for JWT? what does it mean?

4. why would we want to encode a JWT as string? in other words, why is encoding necessary?



## Review `sqlmodel`
1. based on my research, `sqlmodel` package is useful when you need to define database models that also serve as data schemas for your application. so my question is: what is the difference between database models and data schemas for a FastAPI application? what purpose do they serve respectively?

2. Consider the following example:
    ```python
    class UserBase(SQLModel):
        email: EmailStr = Field(unique=True, index=True, max_length=255)
        is_active: bool = True
        is_superuser: bool = False
        full_name: str | None = Field(default=None, max_length=255)


    class User(UserBase, table=True):
        id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
        hashed_password: str
        items: list["Item"] = Relationship(back_populates="owner", cascade_delete=True)
    ```
    The User class is the database model. However, it inherits from UserBase. So my question is: what are data fields/attributes being stored in the database exactly?

3. what does Field() do in sqlmodel? when do I want to use it? If an attribute omits it, what is the reason of omitting it?

4. what does it mean to make an attribute index=True? what about unique=True? what purposed do they serve respectively?

5. why don't we make every column index=True for the simplicity and for the convenience of searching?

6. `User` database table will have a column "role" which takes 3 values: client, staff and admin to identify the role of the user. do we need to set index=True for "role"?

7. consider the following design:
    ```python
    class UserBase(SQLModel):
        email: EmailStr = Field(unique=True, index=True, max_length=255)
        role: str = Field(index=True)

    # Database model, database table inferred from class name
    class User(UserBase, table=True):
        id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
        hashed_password: str
    ```
    why is id defined in User database model rather than UserBase? If I were to add a created_at that records the registration date for a user account. where would I put it?

## Review `FastAPI`
1. What is CORS?
    - [Official Doc: CORS (Cross-Origin Resource Sharing)](https://fastapi.tiangolo.com/tutorial/cors/)


## Helpful Links
- [Example use of Pydantic MySQLDsn](https://github.com/pydantic/pydantic/pull/4990)