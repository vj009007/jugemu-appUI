import { initializeChat } from "@/app/actions/chat/chat";

export async function POST (req: Request) {
    const { chatId, promptValue, llms } = await req.json();
    const summary = await initializeChat(chatId, promptValue, llms);
    return new Response(summary);
}