# Migration to Chakra UI V3

## Installation
```bash
npm install @chakra-ui/react@3.8.0
npm install @emotion/react
npm install @tanstack/react-query
npm install @tanstack/react-query-devtools
npm install @tanstack/react-router
npm install axios
npm install react-hook-form
npm install react-icons
npm install react-error-boundary
```

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