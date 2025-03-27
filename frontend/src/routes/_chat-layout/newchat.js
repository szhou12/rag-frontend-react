import { createFileRoute } from "@tanstack/react-router"
import ChatPage from "@/pages/Chat/ChatPage"

export const Route = createFileRoute("/chat")({
    component: ChatPage,
})