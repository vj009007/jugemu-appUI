import { handleGroqChatRequest } from "@/src/app/actions/chat/handleRequest";

const MODEL = "mixtral-8x7b-32768";

export async function POST(req: Request) {
  return handleGroqChatRequest(req, MODEL);
}
