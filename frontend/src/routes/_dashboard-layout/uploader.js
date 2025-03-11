import { createFileRoute } from "@tanstack/react-router"

import UploaderPage from "@/pages/Dashboard/UploaderPage"

export const Route = createFileRoute("/dashboard/uploader")({
    component: UploaderPage,
})
