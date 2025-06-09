import { createFileRoute } from "@tanstack/react-router"
import Chatbot from "@/pages/Chat/Chatbot"

export const Route = createFileRoute("/chat")({
    component: Chatbot,
})
