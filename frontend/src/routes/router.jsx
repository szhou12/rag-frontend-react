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

import { Route as ChatLayoutImport } from './_chat-layout'
import { Route as NewChatImport } from './_chat-layout/newchat'
import { Route as ChatSessionImport } from './_chat-layout/chat-session'

// import { Route as ChatIndexImport } from './_chat-layout/index'
// import { Route as ChatIdImport } from './_chat-layout/chat-id'


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


/**
 * Chat Layout Route
 */
const chatLayoutRoute = ChatLayoutImport.update({
    id: "/_chat", // will not show in URL
    getParentRoute: () => rootRoute,
})

/**
 * New Chat Route
 */
const newChatRoute = NewChatImport.update({
    path: "/chat",
    getParentRoute: () => chatLayoutRoute,
})

/**
 * Chat Session (existing chat) Route
 */
const chatSessionRoute = ChatSessionImport.update({
    path: "/c/$chatId",
    getParentRoute: () => chatLayoutRoute,
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

    chatLayoutRoute.addChildren([
        newChatRoute,
        chatSessionRoute,
    ]),
])
  

export const router = createRouter({ routeTree })