import { handleGoogleChatRequest } from "@/src/app/actions/chat/handleRequest";

const MODEL = "models/gemini-1.5-pro";

export async function POST(req: Request) {
  return handleGoogleChatRequest(req, MODEL);
}
