"use server";

import { getServerSession } from "next-auth";
import { customAuthOptions } from "@/src/app/lib/customAuthOptions";
import prisma from "@/app/lib/prisma";

export async function createMessage(
  hash: string,
  model: string,
  sent: string,
  response: string,
  tokensIn: number,
  tokensOut: number,
) {
  const session = await getServerSession(customAuthOptions);
  if (!session) {
    return new Response("unauthorized", { status: 401 });
  }
  const userId = Number(session.user.id);

  await prisma.chat.upsert({
    where: { hash: hash },
    update: {}, // No update needed if the record already exists
    create: {
      userId,
      hash: hash,
    },
  });

  // FIXME: Inefficient query to populate chat models
  const chat = await prisma.chat.findUnique({
    where: { hash: hash },
  });

  const chatId = chat?.id;

  if (chatId) {
    await prisma.chatModel
      .create({
        data: {
          chat: { connect: { id: chatId } },
          model: { connect: { name: model } },
        },
      })
      .catch(() => {});
  }

  // const existingModel = await prisma.model.findUnique({
  //   where: { name: model },
  // });
  // console.log("existingmodel", existingModel);
  // if (!existingModel) {
  //   throw new Error(`Model with name '${model}' does not exist.`);
  // }

  await prisma.message
    .create({
      data: {
        content: sent,
        sender: "user",
        tokensIn,
        chat: { connect: { hash } },
        model: { connect: { name: model } },
      },
      select: null,
    })
    .catch(console.error);
  await prisma.message
    .create({
      data: {
        content: response,
        sender: "assistant",
        tokensOut,
        chat: { connect: { hash } },
        model: { connect: { name: model } },
      },
      select: null,
    })
    .catch(console.error);
}

export async function getMessages(chatId: string) {
  const session = await getServerSession(customAuthOptions);
  if (!session) {
    throw new Error("unauthorized");
  }
  const userId = Number(session.user.id);

  return await prisma.message.findMany({
    where: {
      chat: {
        hash: chatId,
        OR: [{ userId }, { shared: true }],
      },
    },
    include: {
      model: true,
    },
    orderBy: { createdAt: "asc" },
  });
}

export async function getTitle(chatId: string) {
  const session = await getServerSession(customAuthOptions);
  if (!session) {
    throw new Error("unauthorized");
  }
  const userId = Number(session.user.id);

  const chat = await prisma.chat.findUnique({
    where: {
      hash: chatId,
      userId,
    },
  });

  return chat?.summary;
}

export async function deleteAllChats() {
  const session = await getServerSession(customAuthOptions);
  if (!session) {
    return new Response("unauthorized", { status: 401 });
  }
  const userId = Number(session.user.id);

  // Delete all chats and cascade delete related messages and Chat Models
  await prisma.chat.deleteMany({
    where: { userId },
  });

  return new Response("All chats deleted", { status: 200 });
}
