import { createRouter, createRoute, createRootRoute } from '@tanstack/react-router'
import HomePage from '@/pages/HomePage'
import LoginPage from '@/pages/Auth/LoginPage'

// Create a root route
const rootRoute = createRootRoute()

// Create public routes
const indexRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/',
    component: HomePage,
})

/*
 Login and Register routes
*/
const loginRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/login',
    component: LoginPage,
})



// Finally, create the router for all routes
const routeTree = rootRoute.addChildren([
    indexRoute,
    loginRoute,
])
  

export const router = createRouter({ routeTree })