import { createRouter, createRoute, createRootRoute } from '@tanstack/react-router'
import HomePage from '@/pages/HomePage'

// Create a root route
const rootRoute = createRootRoute()

// Create public routes
const indexRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/',
    component: HomePage,
})


// Finally, create the router for all routes
const routeTree = rootRoute.addChildren([
    indexRoute,
])
  

export const router = createRouter({ routeTree })