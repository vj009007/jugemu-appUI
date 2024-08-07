import { handleAnthropicChatRequest } from "@/src/app/actions/chat/handleRequest";

const MODEL = "claude-3-haiku-20240307";

export async function POST(req: Request) {
  return handleAnthropicChatRequest(req, MODEL);
}
