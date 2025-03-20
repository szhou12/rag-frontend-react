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
```
### Notes
- Chakra UI `3.8.0` can't use `FileUpload`.

## React Folder Naming & Structure
```
src/
|
├── components/           # Shared, reusable UI components
│   ├── Common/             
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
