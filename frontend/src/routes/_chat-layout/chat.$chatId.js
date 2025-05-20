import { createFileRoute } from "@tanstack/react-router"
import ChatSessionPage from "@/pages/Chat/ChatSessionPage"
import Chatbot from "@/pages/Chat/Chatbot"


export const Route = createFileRoute("/c/$chatId")({
    component: Chatbot,
})