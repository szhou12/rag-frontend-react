import { createFileRoute } from "@tanstack/react-router"
import ChatSessionPage from "@/pages/Chat/ChatSessionPage"
import ConversationPage from "@/pages/Chat/ConversationPage"


export const Route = createFileRoute("/chat/$chatId")({
    component: ConversationPage,
})