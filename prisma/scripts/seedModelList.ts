import prisma from "@/src/app/lib/prisma";

async function main() {
  // UPSERT

  // WRITE
  // const modelArr = [
  //   {
  //     id: 9,
  //     displayOrder: 8,
  //     provider: "Groq",
  //     modalDisplayOrder: 12,
  //     name: "llama-3.1-8b-instant",
  //     displayName: "Llama-3.1 8B",
  //   },
  //   {
  //     id: 10,
  //     displayOrder: 13,
  //     provider: "Groq",
  //     modalDisplayOrder: 13,
  //     name: "llama3-70b-8192",
  //     displayName: "Llama-3 70B",
  //   },
  //   {
  //     id: 11,
  //     displayOrder: 14,
  //     provider: "Groq",
  //     modalDisplayOrder: 14,
  //     name: "llama3-8b-8192",
  //     displayName: "Llama-3 8B",
  //   },
  //   {
  //     id: 12,
  //     displayOrder: 9,
  //     provider: "Groq",
  //     modalDisplayOrder: 15,
  //     name: "mixtral-8x7b-32768",
  //     displayName: "Mixtral 8x7B",
  //   },
  //   {
  //     id: 13,
  //     displayOrder: 6,
  //     provider: "Anthropic",
  //     modalDisplayOrder: 6,
  //     name: "claude-3-opus-20240229",
  //     displayName: "Claude-3 Opus",
  //   },
  //   {
  //     id: 14,
  //     displayOrder: 11,
  //     provider: "Anthropic",
  //     modalDisplayOrder: 7,
  //     name: "claude-3-sonnet-20240229",
  //     displayName: "Claude-3 Sonnet",
  //   },
  //   {
  //     id: 15,
  //     displayOrder: 12,
  //     provider: "Anthropic",
  //     modalDisplayOrder: 8,
  //     name: "claude-3-haiku-20240307",
  //     displayName: "Claude-3 Haiku",
  //   },
  //   {
  //     id: 16,
  //     displayOrder: 3,
  //     provider: "Google",
  //     modalDisplayOrder: 9,
  //     name: "gemini-1.5-pro",
  //     displayName: "Gemini-1.5 Pro",
  //   },
  //   {
  //     id: 17,
  //     displayOrder: 10,
  //     provider: "Groq",
  //     modalDisplayOrder: 17,
  //     name: "gemma2-9b-it",
  //     displayName: "Gemma-2 9B",
  //   },
  //   {
  //     id: 18,
  //     displayOrder: 15,
  //     provider: "Groq",
  //     modalDisplayOrder: 16,
  //     name: "gemma-7b-it",
  //     displayName: "Gemma-7B",
  //   },
  // ];

  // for (const model of modelArr) {
  //   await prisma.model.create({
  //     data: model,
  //   });
  // }

  // console.log("Models created successfully");

  const updates = [
    // {
    //   id: 6,

    //   modalDisplayOrder: 5,
    // },
    // {
    //   id: 7,

    //   modalDisplayOrder: 10,
    // },
    {
      id: 2,

      modalDisplayOrder: 1000,
    },
  ];

  for (const update of updates) {
    const updatedVal = await prisma.model.update({
      where: { id: update.id },
      data: {
        modalDisplayOrder: update.modalDisplayOrder,
      },
    });
    console.log(updatedVal);
  }

  console.log("updated");

  // const fetchModels = await prisma.model.findMany();
  // console.log(fetchModels);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
