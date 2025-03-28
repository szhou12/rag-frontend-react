import { createFileRoute } from "@tanstack/react-router"
import ChatSessionPage from "@/pages/Chat/ChatSessionPage"


export const Route = createFileRoute("/c/$chatId")({
    component: ChatSessionPage,
})