import { createFileRoute, redirect } from "@tanstack/react-router"
import { isLoggedIn } from "@/hooks/useAuth"
import LoginPage from "@/pages/Auth/LoginPage"

/**
 * Defines a route for client login: `/login`.
 * 
 * `beforeLoad` runs BEFORE the component renders.
 * It redirects logged-in users to `/chat` (client) to prevent accessing the login page again after logging in.
 */
export const Route = createFileRoute("/login")({
    component: LoginPage,

    beforeLoad: async () => {
        if (isLoggedIn()) {
            throw redirect({
                to: "/chat",
            })
        }
    },
})