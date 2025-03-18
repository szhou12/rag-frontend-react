import { createFileRoute } from "@tanstack/react-router"
import { pageSearchSchema } from "@/utils"

import AdminPage from "@/pages/Dashboard/AdminPage"


export const Route = createFileRoute("/dashboard/admin")({
    component: AdminPage,
    validateSearch: (search) => pageSearchSchema.parse(search),
})
