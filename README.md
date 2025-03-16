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
npx @chakra-ui/cli snippet add select
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