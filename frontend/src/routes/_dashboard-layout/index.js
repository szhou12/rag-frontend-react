import { createFileRoute } from "@tanstack/react-router"

import IndexPage from "@/pages/Dashboard/IndexPage"

export const Route = createFileRoute("/dashboard")({
    component: IndexPage,
})

