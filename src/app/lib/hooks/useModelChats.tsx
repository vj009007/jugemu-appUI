import { Model } from "@prisma/client";
import { useChat } from "ai/react";
import { useMemo } from "react";

type Chat = ReturnType<typeof useChat> & {
  modelId: number;
  name: Model["name"];
  displayName: Model["displayName"];
};

type Chats = {
  [key: string]: Chat;
};

export function useModelChats(models: Model[], chatId: string): Chats {
  {
    /*
    needed to declare each useChat separately, can't nest a hook inside a callbackFn like a .map or something, so did the following for now:
      1. declare useChat for each model individually
      2. manually add them into an array
      3. push add'l data into the 'chats' object

      todo (when time permits): don't think we need to declare all chats initially, should maybe instantiate when a user selects that specific model.
    
    */
  }
  // console.log("number of models", models.length);

  const chat1 = useChat({
    api: `/api/chat/${models[0].name}?chatId=${chatId}`,
  });
  const chat2 = useChat({
    api: `/api/chat/${models[1].name}?chatId=${chatId}`,
  });
  const chat3 = useChat({
    api: `/api/chat/${models[2].name}?chatId=${chatId}`,
  });
  const chat4 = useChat({
    api: `/api/chat/${models[3].name}?chatId=${chatId}`,
  });
  const chat5 = useChat({
    api: `/api/chat/${models[4].name}?chatId=${chatId}`,
  });
  const chat6 = useChat({
    api: `/api/chat/${models[5].name}?chatId=${chatId}`,
  });
  const chat7 = useChat({
    api: `/api/chat/${models[6].name}?chatId=${chatId}`,
  });
  const chat8 = useChat({
    api: `/api/chat/${models[7].name}?chatId=${chatId}`,
  });
  const chat9 = useChat({
    api: `/api/chat/${models[8].name}?chatId=${chatId}`,
  });
  const chat10 = useChat({
    api: `/api/chat/${models[9].name}?chatId=${chatId}`,
  });
  const chat11 = useChat({
    api: `/api/chat/${models[10].name}?chatId=${chatId}`,
  });
  const chat12 = useChat({
    api: `/api/chat/${models[11].name}?chatId=${chatId}`,
  });
  const chat13 = useChat({
    api: `/api/chat/${models[12].name}?chatId=${chatId}`,
  });
  const chat14 = useChat({
    api: `/api/chat/${models[13].name}?chatId=${chatId}`,
  });
  const chat15 = useChat({
    api: `/api/chat/${models[14].name}?chatId=${chatId}`,
  });
  const chat16 = useChat({
    api: `/api/chat/${models[15].name}?chatId=${chatId}`,
  });
  const chat17 = useChat({
    api: `/api/chat/${models[16].name}?chatId=${chatId}`,
  });
  const chat18 = useChat({
    api: `/api/chat/${models[17].name}?chatId=${chatId}`,
  });

  // array of all chat hooks
  const chatHooks = [
    chat1,
    chat2,
    chat3,
    chat4,
    chat5,
    chat6,
    chat7,
    chat8,
    chat9,
    chat10,
    chat11,
    chat12,
    chat13,
    chat14,
    chat15,
    chat16,
    chat17,
    chat18,
  ];

  // combine the chat hooks with the model information
  const chats = useMemo(() => {
    return models.reduce<Chats>((acc, model, index) => {
      acc[model.name] = {
        ...chatHooks[index],
        modelId: model.id,
        name: model.name,
        displayName: model.displayName,
      };

      return acc;
    }, {});
  }, [
    models,
    chat1,
    chat2,
    chat3,
    chat4,
    chat5,
    chat6,
    chat7,
    chat8,
    chat9,
    chat10,
    chat11,
    chat12,
    chat13,
    chat14,
    chat15,
    chat16,
    chat17,
    chat18,
  ]);

  return chats;
}
