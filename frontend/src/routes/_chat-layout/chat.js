import { createFileRoute } from "@tanstack/react-router"
import HomePage from "@/pages/Chat/HomePage"

export const Route = createFileRoute("/chat")({
    component: HomePage,
})
