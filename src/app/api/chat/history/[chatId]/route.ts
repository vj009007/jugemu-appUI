import { getMessages, getTitle } from "@/app/actions/chat/history";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest, context: { params: { chatId: string } }) {
  try {
    const result = await getMessages(context.params.chatId);
    const title = await getTitle(context.params.chatId);
    const response = {
      messages: result,
      title: title
    };
    return new Response(JSON.stringify(response), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Bad Request' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}