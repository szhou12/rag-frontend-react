import { createFileRoute } from "@tanstack/react-router"
import { pageSearchSchema } from "@/utils"

import ScraperPage from "@/pages/Dashboard/ScraperPage"

export const Route = createFileRoute("/dashboard/scraper")({
    component: ScraperPage,
    validateSearch: (search) => pageSearchSchema.parse(search),
})