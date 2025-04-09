# Migration to Chakra UI V3

## Installation
```bash
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
```
### Notes
- Chakra UI `3.8.0` can't use `FileUpload`.

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
```

## Chakra UI V3 Code Snippets
```bash
npx @chakra-ui/cli snippet add checkbox
npx @chakra-ui/cli snippet add select
npx @chakra-ui/cli snippet add switch
npx @chakra-ui/cli snippet add avatar
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