import { handleGroqChatRequest } from "@/src/app/actions/chat/handleRequest";

const MODEL = "llama-3.1-8b-instant";

export async function POST(req: Request) {
  return handleGroqChatRequest(req, MODEL);
}
