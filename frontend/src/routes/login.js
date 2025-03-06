import { createFileRoute, redirect } from "@tanstack/react-router"
import { isLoggedIn } from "@/hooks/useAuth"
import LoginForm from "@/features/LoginForm"

/**
 * Defines a route for `/login`.
 * 
 * `beforeLoad` runs BEFORE the component renders.
 * It redirects logged-in users to `/chat` (client) or `/dashboard` (staff) to prevent accessing the login page again after logging in.
 */
export const loginRoute = createFileRoute("/login")({
    component: LoginForm,

    beforeLoad: async () => {
        if (isLoggedIn()) {
            // TODO: redirect to role-based home page - client->chat, staff->dashboard
            throw redirect({
                to: "/",
            })
        }
    },
})