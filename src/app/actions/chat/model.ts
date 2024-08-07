"use server";

import prisma from "@/app/lib/prisma";

export const getModelList = async () => {
  const models = await prisma.model.findMany({
    orderBy: { displayOrder: "asc" },
  });

  return models;
};
