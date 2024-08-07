import { handleGroqChatRequest } from "@/src/app/actions/chat/handleRequest";

const MODEL = "llama-3.1-70b-versatile";

export async function POST(req: Request) {
  return handleGroqChatRequest(req, MODEL);
}
