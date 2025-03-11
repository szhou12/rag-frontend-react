import { createFileRoute, redirect } from "@tanstack/react-router"
import { isLoggedIn } from "@/hooks/useAuth"
import LoginStaffPage from "@/pages/Auth/LoginStaffPage"

/**
 * Defines a route for staff login: `/login-staff`.
 * 
 * `beforeLoad` runs BEFORE the component renders.
 * It redirects logged-in users to `/dashboard-home` (staff) to prevent accessing the login page again after logging in.
 */
export const Route = createFileRoute("/login-staff")({
    component: LoginStaffPage,

    beforeLoad: async () => {
        if (isLoggedIn()) {
            throw redirect({ to: "/dashboard" })
        }
    },
})