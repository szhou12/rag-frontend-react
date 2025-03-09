import { createFileRoute, redirect } from "@tanstack/react-router"
import { isLoggedIn } from "@/hooks/useAuth"
import RegisterPage from "@/pages/Auth/RegisterPage"

/**
 * Defines a route for client registration: `/register`.
 * 
 * `beforeLoad` runs BEFORE the component renders.
 * It redirects logged-in users to `/chat` (client) to prevent accessing the login page again after logging in.
 */
export const Route = createFileRoute("/register")({
    component: RegisterPage,

    beforeLoad: async () => {
        if (isLoggedIn()) {
            throw redirect({ to: "/chat" })
        }
    }
})