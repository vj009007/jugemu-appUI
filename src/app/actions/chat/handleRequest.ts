import { openai, createOpenAI as createGroq } from "@ai-sdk/openai";
import { anthropic } from "@ai-sdk/anthropic";
import { google } from "@ai-sdk/google";
import { streamText } from "ai";
import { createMessage } from "@/src/app/actions/chat/history";
import { isUserWithinQuota } from "@/src/app/actions/paywall";

// openai
// TODO: Unify the handleChatRequest, handleAnthropicChatRequest, handleGoogleChatRequest, and handleGroqChatRequest functions
export async function handleChatRequest(req: Request, MODEL: string) {
  const url = new URL(req.url);
  const hash = url.searchParams.get("chatId");
  const { messages } = await req.json();

  if (!hash || !messages) {
    return new Response("missing required parameters", { status: 400 });
  }
  if (!(await isUserWithinQuota())) {
    return new Response("quota exceeded", { status: 402 });
  }

  const result = await streamText({
    model: openai(MODEL),
    messages,
    async onFinish({ text: generated, usage }) {
      const query = messages[messages.length - 1].content;
      await createMessage(
        hash,
        MODEL,
        query,
        generated,
        usage.promptTokens,
        usage.completionTokens,
      );
    },
  });

  return result.toAIStreamResponse();
}

// anthropic
export async function handleAnthropicChatRequest(req: Request, MODEL: string) {
  const url = new URL(req.url);
  const hash = url.searchParams.get("chatId");
  const { messages } = await req.json();

  if (!hash || !messages) {
    return new Response("missing required parameters", { status: 400 });
  }

  const result = await streamText({
    model: anthropic(MODEL),
    messages,
    async onFinish({ text: generated, usage }) {
      const query = messages[messages.length - 1].content;
      await createMessage(
        hash,
        MODEL,
        query,
        generated,
        usage.promptTokens,
        usage.completionTokens,
      );
    },
  });

  return result.toAIStreamResponse();
}

// google
export async function handleGoogleChatRequest(req: Request, MODEL: string) {
  const url = new URL(req.url);
  const hash = url.searchParams.get("chatId");
  const { messages } = await req.json();

  if (!hash || !messages) {
    return new Response("missing required parameters", { status: 400 });
  }

  //FIXME: hack since db name for gemini is 'gemini-1.5-flash' but the sdk requires 'models/gemini-1.5-flash'
  const extractedModel = MODEL.split("/")[1];

  const result = await streamText({
    model: google(MODEL),
    messages,
    async onFinish({ text: generated, usage }) {
      const query = messages[messages.length - 1].content;
      await createMessage(
        hash,
        extractedModel,
        query,
        generated,
        usage.promptTokens,
        usage.completionTokens,
      );
    },
  });

  return result.toAIStreamResponse();
}

// groq
export async function handleGroqChatRequest(req: Request, MODEL: string) {
  const url = new URL(req.url);
  const hash = url.searchParams.get("chatId");
  const { messages } = await req.json();

  if (!hash || !messages) {
    return new Response("missing required parameters", { status: 400 });
  }

  const groq = createGroq({
    baseURL: "https://api.groq.com/openai/v1",
    apiKey: process.env.GROQ_API_KEY,
  });

  const result = await streamText({
    model: groq(MODEL),
    messages,
    async onFinish({ text: generated, usage }) {
      const query = messages[messages.length - 1].content;
      await createMessage(
        hash,
        MODEL,
        query,
        generated,
        usage.promptTokens,
        usage.completionTokens,
      );
    },
  });

  return result.toAIStreamResponse();
}
