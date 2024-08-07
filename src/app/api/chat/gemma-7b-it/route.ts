import { handleGroqChatRequest } from "@/src/app/actions/chat/handleRequest";

const MODEL = "gemma-7b-it";

export async function POST(req: Request) {
  return handleGroqChatRequest(req, MODEL);
}
