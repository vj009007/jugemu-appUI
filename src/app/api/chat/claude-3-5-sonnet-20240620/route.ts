import { handleAnthropicChatRequest } from "@/src/app/actions/chat/handleRequest";

const MODEL = "claude-3-5-sonnet-20240620";

export async function POST(req: Request) {
  return handleAnthropicChatRequest(req, MODEL);
}
