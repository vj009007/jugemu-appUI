import { handleAnthropicChatRequest } from "@/src/app/actions/chat/handleRequest";

const MODEL = "claude-3-sonnet-20240229";

export async function POST(req: Request) {
  return handleAnthropicChatRequest(req, MODEL);
}
