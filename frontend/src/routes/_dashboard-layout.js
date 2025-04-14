import { createFileRoute, redirect } from "@tanstack/react-router"
import { isLoggedIn, getUserRole } from "@/hooks/useAuth"
import { DashboardLayout } from "@/layouts/Dashboard/DashboardLayout"


export const Route = createFileRoute("/_dashboard")({
    component: DashboardLayout,

    // TODO: add RBAC check here
    // NOTE: CANNOT use useAuth hook (user) in beforeLoad fcn
    // bc beforeLoad is not a React component or hook, rather a route loader
    // that runs before the component renders.
    beforeLoad: async () => {
        if (!isLoggedIn()) {
            throw redirect({
                to: "/login-staff",
            })
        }

        const role = await getUserRole()
        if (!role || role === "client") {
            throw redirect({
                to: "/",
            })
        }
    },
})