import { createFileRoute, redirect } from "@tanstack/react-router"
import { pageSearchSchema } from "@/utils"
import { getUserRole } from "@/hooks/useAuth"

import AdminPage from "@/pages/Dashboard/AdminPage"


export const Route = createFileRoute("/dashboard/admin")({
    component: AdminPage,
    validateSearch: (search) => pageSearchSchema.parse(search),

    // Role check: only admin can access this route
    beforeLoad: async () => {
        // We don't need to check isLoggedIn() here because parent route /_dashboard already does that
        const role = await getUserRole()
        if (role !== "admin") {
            throw redirect({
                to: "/",
            })
        }
    },
})
