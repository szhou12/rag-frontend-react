import { createFileRoute, redirect } from "@tanstack/react-router"
import { isLoggedIn, getUserRole } from "@/hooks/useAuth"
import { DashboardLayout } from "@/layouts/Dashboard/DashboardLayout"


export const Route = createFileRoute("/_dashboard")({
    component: DashboardLayout,

    // NOTE: CANNOT use useAuth hook (user) in beforeLoad fcn
    // bc beforeLoad is not a React component or hook, rather a route loader
    // that runs before the component renders.
    beforeLoad: async () => {
        console.log("Dashboard layout beforeLoad executing");

        if (!isLoggedIn()) {
            throw redirect({
                to: "/login",
            })
        }

        // Role check: only staff and admin can access this route
        const role = await getUserRole()
        if (!role || role === "client") {
            throw redirect({
                to: "/",
            })
        }
    },
})