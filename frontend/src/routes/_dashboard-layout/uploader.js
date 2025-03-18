import { createFileRoute } from "@tanstack/react-router"
import { pageSearchSchema } from "@/utils"

import UploaderPage from "@/pages/Dashboard/UploaderPage"


export const Route = createFileRoute("/dashboard/uploader")({
    component: UploaderPage,
    validateSearch: (search) => pageSearchSchema.parse(search),
})
