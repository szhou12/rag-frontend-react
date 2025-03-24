import { createFileRoute, redirect } from "@tanstack/react-router"
import { isLoggedIn } from "@/hooks/useAuth"
import { DashboardLayout } from "@/layouts/Dashboard/DashboardLayout"

export const Route = createFileRoute("/_dashboard")({
    component: DashboardLayout,

    beforeLoad: async () => {
        if (!isLoggedIn()) {
            throw redirect({
                to: "/login-staff",
            })
        }
    },
})