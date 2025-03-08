import { createRouter, createRoute, createRootRoute } from '@tanstack/react-router'
import HomePage from '@/pages/HomePage'
import LoginPage from '@/pages/Auth/LoginPage'
import { Route as LoginImport } from './login'


// Create a root route
const rootRoute = createRootRoute()

// Create public routes
const indexRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/',
    component: HomePage,
})

/**
 * Login Route
 * `update()`: modifies the login route object from login.js by adding two key-value pairs (path, getParentRoute)
 */
const loginRoute = LoginImport.update({
    path: '/login',
    getParentRoute: () => rootRoute,
})



// Finally, create the router for all routes
const routeTree = rootRoute.addChildren([
    indexRoute,
    loginRoute,
])
  

export const router = createRouter({ routeTree })