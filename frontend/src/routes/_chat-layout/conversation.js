import { createFileRoute } from "@tanstack/react-router"
import ConversationPage from "@/pages/Chat/ConversationPage"


export const Route = createFileRoute("/chat/conversation")({
    component: ConversationPage,
})