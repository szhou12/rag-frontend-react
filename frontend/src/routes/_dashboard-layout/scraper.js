import { createFileRoute } from "@tanstack/react-router"

import ScraperPage from "@/pages/Dashboard/ScraperPage"

export const Route = createFileRoute("/dashboard/scraper")({
    component: ScraperPage,
})