import { handleGroqChatRequest } from "@/src/app/actions/chat/handleRequest";

const MODEL = "llama-3-70b-8192";

export async function POST(req: Request) {
  return handleGroqChatRequest(req, MODEL);
}
