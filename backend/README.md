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

5. why don't we make ALL columns index=True for the simplicity and for the convenience of searching?

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

8. what does Session from SQLModel do?



## Review `FastAPI`
1. What is CORS?
    - [Official Doc: CORS (Cross-Origin Resource Sharing)](https://fastapi.tiangolo.com/tutorial/cors/)

2. Explain what each instruction is doing:
    ```python
    origins = [
        "http://localhost:5173", 
    ]
    app.add_middleware(
        CORSMiddleware,
        allow_origins=origins, # specify what frontend URLs can send requests to backend
        allow_credentials=True, # allow credentials like JWT tokens
        allow_methods=["*"], # allow all HTTP methods GET, POST, ...
        allow_headers=["*"], # allow all kinds of HTTP headers sent out in requests
    )
    ```

3. What does `Annotated` do? Can you explain to me how `Annotated` works in the following example?
    ```python
    def get_db() -> Generator[Session, None, None]:
        with Session(engine) as session:
            yield session

    SessionDep = Annotated([Session, Depends(get_db)])
    ```

4. how to understand `Generator[Session, None, None]`?

5. Why does `get_db()` return a `Generator` instead of simply yielding a Session since it only has a yieldType?

6. How to understand `SessionDep = Annotated([Session, Depends(get_db)])`?
    - type = Session, metadata = Depends(get_db)
    - Meaning: `SessionDep` is `Session` type, produced only by a specific function `get_db()`.
    - when FastAPI sees a variable declared as `SessionDep`, it will call `get_db()` to produce a `Session` object.

7. please explain to me the following code snippet:
    ```python
    oauth2_scheme = OAuth2PasswordBearer(tokenUrl="xxx")
    ```
    - OAuth2PasswordBearer = OAuth2.0 + Password + Bearer
        - OAuth2.0 framework: overall security protocol adopted for "security checks" and "gain access".
        - Password: How a user pass "security checks" and prove their identity - Use their passwords. Per FastAPI, the user MUST send `(username, password)` as form data for validation. It MUST be named as `username`, CANNOT be replaced by `email`!
        - Bearer: Token type that user will get after pass. HTTP request's header includes an Authorization header that contains a Bearer token (often JWT). i.e., Header has `Authorization: Bearer <token>`
    - tokenUrl: Frontend POST request sends to this address to generate a Bearer token.
    - Token types introduction: [Token types | Google Cloud](https://cloud.google.com/docs/authentication/token-types)





## Helpful Links
- [Example use of Pydantic MySQLDsn](https://github.com/pydantic/pydantic/pull/4990)