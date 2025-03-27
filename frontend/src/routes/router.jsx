import { createRouter, createRoute, createRootRoute } from '@tanstack/react-router'
import HomePage from '@/pages/HomePage'

import { Route as LoginImport } from './login'
import { Route as LoginStaffImport } from './login-staff'
import { Route as RegisterImport } from './register'

import { Route as DashboardLayoutImport } from './_dashboard-layout'
import { Route as DashboardIndexImport } from './_dashboard-layout/index'
import { Route as AdminImport } from './_dashboard-layout/admin'
import { Route as ScraperImport } from './_dashboard-layout/scraper'
import { Route as UploaderImport } from './_dashboard-layout/uploader'

// import { Route as ChatImport } from './chat'
import { Route as ChatImport } from './_chat-layout'
import { Route as ChatIndexImport } from './_chat-layout/index'
import { Route as ConversationImport } from './_chat-layout/conversation'

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

/**
 * Login Staff Route
 */
const loginStaffRoute = LoginStaffImport.update({
    path: '/login-staff',
    getParentRoute: () => rootRoute,
})

/**
 * Register Route
 */
const registerRoute = RegisterImport.update({
    path: '/register',
    getParentRoute: () => rootRoute,
})

/**
 * Dashboard Layout Route
 */
const dashboardLayoutRoute = DashboardLayoutImport.update({
    id: "/_dashboard", // use id instead of path as layout is only a wrapper
    getParentRoute: () => rootRoute,
})

/**
 * Dashboard Index Route
 */
const dashboardIndexRoute = DashboardIndexImport.update({
    path: "/dashboard/index",
    getParentRoute: () => dashboardLayoutRoute,
})

/**
 * Dashboard Admin Route
 */
const dashboardAdminRoute = AdminImport.update({
    path: "/dashboard/admin",
    getParentRoute: () => dashboardLayoutRoute,
})

/**
 * Dashboard Scraper Route
 */
const dashboardScraperRoute = ScraperImport.update({
    path: "/dashboard/scraper",
    getParentRoute: () => dashboardLayoutRoute,
})

/**
 * Dashboard Uploader Route
 */ 
const dashboardUploaderRoute = UploaderImport.update({
    path: "/dashboard/uploader",
    getParentRoute: () => dashboardLayoutRoute,
})

// TEST UI
// const chatRoute = ChatImport.update({
//     path: "/chat",
//     getParentRoute: () => rootRoute,
// })

/**
 * Chat Route
 */
const chatRoute = ChatImport.update({
    id: "/_chat",
    getParentRoute: () => rootRoute,
})

/**
 * Chat Index Route
 */
const chatIndexRoute = ChatIndexImport.update({
    path: "/chat",
    getParentRoute: () => chatRoute,
})

const conversationRoute = ConversationImport.update({
    path: "/chat/conversation",
    getParentRoute: () => chatRoute,
})


// Finally, create the router for all routes
const routeTree = rootRoute.addChildren([
    indexRoute,

    loginRoute,
    loginStaffRoute,
    registerRoute,

    dashboardLayoutRoute.addChildren([
        dashboardIndexRoute,
        dashboardAdminRoute,
        dashboardScraperRoute,
        dashboardUploaderRoute,
    ]),

    // chatRoute,

    chatRoute.addChildren([
        chatIndexRoute,
        conversationRoute,
    ]),
])
  

export const router = createRouter({ routeTree })