import { createFileRoute } from "@tanstack/react-router"
import IndexPage from "@/pages/Chat/IndexPage"



export const Route = createFileRoute("/chat")({
    component: IndexPage,
})