import { createFileRoute } from "@tanstack/react-router"

import AdminPage from "@/pages/Dashboard/AdminPage"

export const Route = createFileRoute("/dashboard/admin")({
    component: AdminPage,
})

