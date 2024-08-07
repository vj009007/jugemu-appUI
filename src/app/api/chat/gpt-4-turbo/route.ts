import { handleChatRequest } from "@/src/app/actions/chat/handleRequest";

const MODEL = "gpt-4-turbo";

export async function POST(req: Request) {
  return handleChatRequest(req, MODEL);
}