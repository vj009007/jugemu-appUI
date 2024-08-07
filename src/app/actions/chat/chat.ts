"use server";

import { getServerSession } from "next-auth";
import prisma from "@/app/lib/prisma";
import { customAuthOptions } from "@/src/app/lib/customAuthOptions";
import { Model } from "@prisma/client";
import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";

export interface ChatWithModels {
  id: number;
  userId: number;
  createdAt: Date;
  hash: string;
  summary: string | null;
  models: {
    model: Model;
    chatId: number;
    modelId: number;
  }[];
}

export async function initializeChat(
  chatId: string,
  prompt: string,
  llms: string[],
): Promise<string> {
  const session = await getServerSession(customAuthOptions);
  if (!session) {
    throw new Error("Unauthorized");
  }

  const modelsExist = await prisma.model.findMany({
    where: {
      name: {
        in: llms,
      },
    },
  });
  console.log("modelsExist", modelsExist);

  if (modelsExist.length !== llms.length) {
    throw new Error("Some models do not exist in the database.");
  }

  await prisma.chat.create({
    data: {
      userId: Number(session.user.id),
      hash: chatId,
      summary: prompt,
      models: {
        create: llms.map((model) => ({
          model: { connect: { name: model } },
        })),
      },
    },
  });
  const summary = await generateText({
    model: openai("gpt-4o-mini"),
    prompt: "Summarize the following text in less than 5 words: " + prompt,
  });
  // Not create the chat with the generated title as the LLM may take long or even fail sometimes.
  await prisma.chat.update({
    where: { hash: chatId },
    data: { summary: summary.text },
  });
  return summary.text;
}

export async function getChats(): Promise<ChatWithModels[]> {
  const session = await getServerSession(customAuthOptions);
  if (!session) {
    throw new Error("Unauthorized");
  }
  const user = Number(session.user.id);
  return await prisma.chat.findMany({
    where: { userId: user },
    include: {
      models: {
        include: { model: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}
export async function getChatByDate(startDate: Date, endDate: Date) {
  const session = await getServerSession(customAuthOptions);
  if (!session) {
    return new Response("unauthorized", { status: 401 });
  }
  const userId = Number(session.user.id);

  const startOfDay = new Date(startDate);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(endDate);
  endOfDay.setHours(23, 59, 59, 999);

  return await prisma.chat.findMany({
    where: {
      userId,
      createdAt: {
        gte: startOfDay,
        lte: endOfDay,
      },
    },
    include: {
      models: {
        include: { model: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

export const getInitialModelList = async () => {
  const session = await getServerSession(customAuthOptions);
  if (!session) {
    return null;
  }
  const userId = Number(session.user.id);

  // get the most recent message for the user to find the chatId
  const recentMessage = await prisma.message.findFirst({
    where: {
      chat: {
        userId,
      },
    },
    orderBy: { createdAt: "desc" },
    select: {
      chatId: true,
    },
  });

  if (!recentMessage) {
    return null;
  }

  // retrieve models associated with the chatId of most recent message
  const chat = await prisma.chat.findUnique({
    where: {
      id: recentMessage.chatId,
    },
    include: {
      models: {
        include: {
          model: true,
        },
      },
    },
  });

  if (!chat) {
    return null;
  }

  const models = chat.models.map((chatModel) => chatModel.model);

  return models;
};
