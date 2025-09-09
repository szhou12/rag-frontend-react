# Migration to Chakra UI V3

## Installation
```bash
npx @chakra-ui/cli snippet add # create /ui under /components. Remember to add Provider to main.jsx

# npm install @chakra-ui/react@^3.8.0
npm install @chakra-ui/react@^3.13.0
npm install @emotion/react
npm install @tanstack/react-query
npm install @tanstack/react-query-devtools
npm install @tanstack/react-router
npm install axios
npm install react-hook-form
npm install react-icons
npm install react-error-boundary
npm install framer-motion
npm install zod
npm install uuid
npm install jwt-decode
npm install eventsource-parser
npm install use-immer
npm install react-markdown
```
### Notes
- Chakra UI `3.8.0` can't use `FileUpload`.

## New Clone from Remote
### Add `.env` in root directory
### `/backend`
1. create a new virtual environment: `uv venv --python 3.13`
2. activate the virtual environment: `source .venv/bin/activate`
3. re-install dependencies: `uv sync`
4. run the server: `uv run main.py`

### `/frontend`
1. re-install dependencies: `npm install`
2. run the development server: `npm run dev`


## React Folder Naming & Structure
```
src/
|
├── components/           # Shared, reusable UI components
│   ├── Common/
│   ├── Chat/
│   │   ├── ChatTab.jsx      # historic converasation tab on Sidebar
│   │   └── ChatMessage.jsx  # a single message in current conversation       
│   └── ui/
|
├── features/             # Self-contained feature modules. Specific to business logic.
│   ├── Auth/
│   │   ├── LoginForm.jsx 
│   │   ├── LoginStaffForm.jsx 
│   │   └── RegisterForm.jsx
│   │
│   ├── Chat/ 
│   │
│   └── Dashboard/
│
├── pages/                # Whole web page layouts
│   ├── HomePage.jsx 
│   ├── Auth/
│   ├── Chat/             
│   └── Dashboard/
│
├── layouts/                   # Reusable layouts
│   ├── Common/                # reusable layouts used by > 2 components 
│   │   └── SidebarLayout.jsx    # used by both Dashboard and Chat
│   ├── Auth/   
│   ├── Chat/             
│   └── Dashboard/
|
├── hooks/                # Custom React hooks
|
├── routes/               # Centralized routing definitions for TanStack Router
|
├── services/             # API services and backend communication
|
├── utils/                # Utility functions/helpers
|
├── App.jsx               # Main app component
├── main.jsx              # Entry point
└── theme.jsx             # design theme



/app
├── main.py             # FastAPI app entrypoint
|
├── api/                # [Controllers]: API routes CRUD operations
│   ├── routes/      
│   │   ├── auth.py  
│   │   ├── users.py
│   │   └── uploads.py
│   ├── deps.py         # for shared Depends()
│   └── main.py         # Include routers & setup
│
|
├── schemas/            # [Views]: Pydantic schemas sent from / returned to API
│   ├── auth.py
│   ├── user.py
│   └── upload.py
|
|
├── crud/               # [Models]: DB CRUD operations - direct interaction with DB
│   ├── user.py
│   └── upload.py
|
├── models/             # [Models]: SQLModel ORM models (database tables)
│   ├── user.py
│   └── upload.py
│
|
├── core/               # Core config, security, utils (app-wide logic)
│   ├── config.py       # Settings, env management
│   ├── security.py     # Auth, JWT, password hashing
│   └── logger.py
│
├── services/           # Business logic (RAG)
│   ├── chat_service.py
│   └── file_service.py
│
└── db/                 # Database session, migrations
    ├── session.py
    └── init_db.py

```

## Chakra UI V3 Code Snippets
```bash
npx @chakra-ui/cli snippet add checkbox
npx @chakra-ui/cli snippet add select
npx @chakra-ui/cli snippet add switch
npx @chakra-ui/cli snippet add avatar
npx @chakra-ui/cli snippet add prose
```

## TODO After Backend Setup
- `hooks/useAuth.js`
    1. implement `UsersService` + update `signUpMutation`
    2. implement `LoginService` + update `login`, `loginMutation`
    3. `const { data: user } = useQuery({...})` currently NOT executing. Need to fix it!!!
    3. replace localStorage with HTTP-only cookies
- `LoginForm.jsx`
    1. After backend setup, implement actual API call (in `useAuth.js`) to backend.
    2. implement `Remember me` checkbox.
    3. implement `forgot password` link.
- `RegisterForm.jsx`
    1. Add `<PasswordStrengthMeter>` to show password strength.
- `UsersTable.jsx`
    1. update `getUsersQueryOptions`: API call to fetch users data from backend
- `AddUser.jsx`
    1. update `UsersService.createUser` to use backend API.
- `DeleteUser.jsx`
    1. update `deleteUser` to use backend API.
- `EditUser.jsx`
    1. update `UsersService.updateUser` to send backend API.
- `WebpagesTable.jsx`
    1. update `getWebpagesQueryOptions`: API call to fetch webpages data from backend
- `AddWebpage.jsx`
    1. update `WebpagesService.createWebpage` to use backend API.
    2. NOTE: useForm data fields are different from data fields stored in backend!
    ```json
    // frontend form data:
    {
        url: "",
        pages: 1, // not stored in backend
        language: "",
        refresh_frequency: 0,
        auto_download: false,
    }
    // backend data (presented on table):
    {
        id: 1,
        url: "example.com",
        date_updated: "2024-01-01", // added by backend
        language: "en",
        refresh_frequency: 0,
        auto_download: false,
    }
    ```
- `DeleteWebpage.jsx`
    1. update `deleteWebpage` to use backend API.
- `EditWebpage.jsx`
    1. update `WebpagesService.updateWebpage` to use backend API.
- `FilesTable.jsx`
    1. update `getFilesQueryOptions`: API call to fetch files data from backend
- `AddFile.jsx`
    1. update `FilesService.createFile` to use backend API.
- `DeleteFile.jsx`
    1. update `deleteFile` to use backend API.
- Chat Pages Milestones
    - At `IndexPage.jsx`, when user either clicks a predefined prompt or types in the Textarea, triggers two actions: 1. Sidebar adds a new chat tab noting this new chat session. 2. Redirect to `ChatSessionPage.jsx` with the new chat session ID.
    - At `ChatSessionPage.jsx`, when user types in the Textarea, no new chat session create, continue the existing chat session.
    
## Backend
1. Create a new conda environment
```bash
$ makdir backend
$ cd backend
$ conda create --name fastapi-react-py3.13 python=3.13
$ conda env remove -n fastapi-react-py3.13
```
2. Select this Conda Env in Cursor
    1. Open Command Palette: `Cmd+Shift+P`
    2. Type and Select: `Python: Select Interpreter`
    3. Select the Conda Env: `fastapi-react-py3.13`
    4. Start a new terminal to check the new env is activated

## Backend Management by UV
1. [uv](https://docs.astral.sh/uv/) for creating a virtual envionment and manage dependencies.
    - [uv for EVERYTHING: How to use uv for Python, venv, and project management](https://www.youtube.com/watch?v=zgSQr0d5EVg&ab_channel=MattPalmer)
    - [Start Using UV Python Package Manager for Better Dependency Management](https://medium.com/@gnetkov/start-using-uv-python-package-manager-for-better-dependency-management-183e7e428760)
2. `uv` QuickStart
    1. STEP 0: Once installed `uv`, add Python 3.13 to `uv` cache `$ uv python install 3.13` (Only need once).
    2. STEP 1: `uv` to configure a `/backend` directory under `/project-dir`
    ```bash
    (project-dir) $ uv init backend
    ```
    3. STEP 2: `uv` to create a virtual environment in `/backend`. NOTE: Different projects can have the same default environment name under their directory without conflict. So for convenience, use the default environment name `venv`. The newly created virtual environment will contain a `.gitignore` that excludes the whole environment directory.
    ```bash
    # Init with default environment name
    (backend) $ uv venv --python 3.13

    # Remove the environment (deactivate it first)
    (backend) $ rm -rf .venv

    # Optionally, init with a custom environment name.
    (backend) $ uv venv [custom-env-name] --python 3.13

    # Remove the environment with a custom name
    (backend) $ rm -rf [custom-env-name]
    ```
    4. STEP 3: Activate the environment
    ```bash
    # default environment name
    (backend) $ source .venv/bin/activate

    # custom environment name
    (backend) $ source [custom-env-name]/bin/activate
    ```
    5. STEP 4: Install dependencies. `pyproject.toml` lists all installed dependencies.
    ```bash
    # install a dependency
    (backend) $ uv add [dependency-name]
    # Or
    (backend) $ uv pip install [dependency-name]

    # remove a dependency
    (backend) $ uv remove [dependency-name]

    # if you manually add/remove dependencies in pyproject.toml, make uv aware of the change
    (backend) $ uv sync
    ```
3. `pyproject.toml`: lists all installed dependencies.

## Backend Dependencies
Under `/backend`:
```bash
uv export --format requirements-txt > requirements.txt
```

```
# /backend
$ uv run main.py

# /frontend
$ npm run dev

# /backend

```


## Chat Data Structure
### Backend (MongoDB) Data Structure
Status = "pending"

Cases covered:
1. Fresh conversation from HomePage: User just submitted initial message, no AI response yet
2. Network failure during AI response: AI was generating but connection dropped
3. Server error during AI generation: Backend crashed while processing AI response
4. User closed browser mid-generation: User left page while AI was responding
5. API timeout: AI service took too long to respond
6. Incomplete AI streaming: Streaming started but didn't complete successfully

Key characteristic: Last message in database has role: 'user' and no corresponding assistant response.

Status = "complete"

Cases covered:
1. Normal completed conversation: User message → AI response cycle finished successfully
2. AI response with error: AI failed but we saved an error message as assistant response
3. User sent multiple messages: All previous exchanges are complete, ready for new input
4. Conversation loaded from history: All past exchanges are finished

Key characteristic: Last message in database has role: 'assistant' (even if it's an error message)
```jsx
{
    _id: ObjectId,                          // MongoDB auto-generated ID
    conversationId: string,                 // UUID for frontend reference
    userId: ObjectId,                       // ID of user who owns this chat. Obtained in backend from JWT token
    title: string,                          // Chat title (derived from first message)
    status: 'pending' | 'complete',          // UI state - is conversation being generated
    createdAt: Date,                        // When conversation was created
    updatedAt: Date,                        // Last message timestamp
    messages: [                             // Ordered from old to recent
        {
            role: 'user' | 'assistant',     // Who sent the message: user=human, assistant=AI
            content: string,                // Message text
            timestamp: Date,                // When message was sent
            sources: []                     // Document references (empty for user messages)
        }
    ]
}
```
### Frontend Data Structure
```jsx
// Conversation-level state (if needed)
const conversation = {
    id: string,                             // conversationId from backend
    title: string,
    createdAt: Date,
    updatedAt: Date
}

// Messages array state (main working data)
const messages = [                          // Ordered from old to recent
    {
        role: 'user' | 'assistant',         // Who sent the message
        content: string,                    // Message text
        timestamp: Date,                    // When message was sent
        sources: [],                        // Document references
        loading: boolean,                   // UI state - is message being generated
        error: boolean                      // UI state - did generation fail
    }
]
```

Workflow Logic:
- Scenario 1: Creating New Conversation from HomePage
    - Frontend (HomePage):
        1. User types message or selects predefined prompt
        2. Call API `ChatService.createConversation({ initialMessage })`
        3. On success, navigate to `/chat/$chatId`
    - Backend API:
        1. Extract `userId` from JWT token
        2. Create conversation document with:
            - `userId` (from token)
            - `initialMessage` (user's message)
            - `status`: 'pending'
            - Single message with role: 'user'
        3. Return `{ chatId }`
    - Frontend (ConversationPage):
        1. Load conversation by `chatId`
        2. Check conversation.status === 'pending'
        3. If pending → automatically send last user message to AI
        4. Stream AI response and update status: 'complete'
- Scenario 2: Continuing Existing Conversation (from Sidebar)
    - Frontend (Sidebar):
        1. User clicks an existing conversation
        2. Navigate to `/chat/$chatId`
    - Frontend (ConversationPage):
        1. Load conversation by `chatId`
        2, Check conversation.status === 'complete'
        3. If complete → just display existing messages
        4. Wait for user to type new message

### Frontend components
```
/pages/Chat: HomePage, ConversationPage
/routes/_chat_layout: chat, chat.$chatId
/layouts/Chat: ThreeLayerLayout, ChatPageLayout
/components/Chat: Sidebar, Navbar, /contentbottom, /contentmain, /sidebarbottom, /sidebarmain, /sidebartop
```

