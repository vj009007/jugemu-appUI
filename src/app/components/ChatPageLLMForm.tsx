"use client";

import { useChat } from "ai/react";
import React, { useEffect, useRef, useState } from "react";
import { Button } from "./Button";
import { Textarea } from "./TextArea";
import { SvgIcon } from "./SvgIcon";
import Image from "next/image";
import { useSession } from "next-auth/react";
import SignInModal from "./Modals/SignInModal";
import { useSignIn } from "@/app/lib/hooks/use-sign-in";
import { usePayment } from "@/app/lib/hooks/usePayment";

const FREE_USER_FIRST_POPUP_THRESHOLD: number =
  Number(process.env.NEXT_PUBLIC_FREE_USER_FIRST_POPUP_THRESHOLD) || 10;
const FREE_USER_EVERYTIME_POPUP_THRESHOLD: number =
  Number(process.env.NEXT_PUBLIC_FREE_USER_EVERYTIME_POPUP_THRESHOLD) || 20;
const FREE_USER_QUOTA_THRESHOLD: number =
  Number(process.env.NEXT_PUBLIC_FREE_USER_QUOTA_THRESHOLD) || 30;

import { Model } from "@prisma/client";
import { initializeChat } from "../actions/chat/chat";
import { useModelChats } from "../lib/hooks/useModelChats";
import { cn } from "../utils/utils";
import ChatWindow from "./ChatWindow";

type ChatPageLLMFormProps = {
  chatId: string;
  modelList: Model[];
};

const ChatPageLLMForm = ({ chatId, modelList }: ChatPageLLMFormProps) => {
  const chats = useModelChats(modelList, chatId);
  const { status } = useSession();
  const signInState = useSignIn();

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [promptValue, setPromptValue] = useState<string>("");
  const [selectedModels, setSelectedModels] = useState<Model[]>([]);
  const { messages, setMessages } = useChat({});
  const [isTheFirstMessage, setIsTheFirstMessage] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [displayPaywallPopup, setDisplayPaywallPopup] = useState(false);
  const [seenFirstPaywallPopup, setSeenFirstPaywallPopup] = useState(false);
  const [hasExceededQuota, setHasExceededQuota] = useState(false);
  const { onOpen: openPlanSelection } = usePayment();
  const [chatTitle, setChatTitle] = useState("Start the chat");
  //const [selectedModels, setSelectedModels] = useState<Model[]>([]);

  const sortedModelList = [...modelList].sort(
    (a, b) => a.modalDisplayOrder! - b.modalDisplayOrder!,
  );

  const toggleModal = (): void => {
    setIsModalOpen(!isModalOpen);
  };

  const handleButtonClick = (model: Model): void => {
    if (selectedModels.includes(model)) {
      setSelectedModels(selectedModels.filter((item) => item !== model));
    } else if (selectedModels.length < 3) {
      setSelectedModels([...selectedModels, model]);
    }
  };

  const initializeChat = async (
    chatId: string,
    promptValue: string,
    llms: string[],
  ) => {
    const response = await fetch("/api/chat", {
      method: "POST",
      body: JSON.stringify({ chatId, promptValue, llms: llms }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.ok) {
      setChatTitle(await response.text());
    }
  };
  const setPaywallStates = async () => {
    const quotaResponse = await fetch("/api/quota");
    const quotaText = await quotaResponse.text();
    const messagesCount: number = Number(quotaText);
    if (
      messagesCount >= FREE_USER_FIRST_POPUP_THRESHOLD &&
      !seenFirstPaywallPopup
    ) {
      setDisplayPaywallPopup(true);
      setSeenFirstPaywallPopup(true);
    }
    if (messagesCount >= FREE_USER_EVERYTIME_POPUP_THRESHOLD) {
      setDisplayPaywallPopup(true);
    }
    if (messagesCount >= FREE_USER_QUOTA_THRESHOLD) {
      setHasExceededQuota(true);
    }
  };
  const handleSubmit = async (
    e?: React.FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    e?.preventDefault();

    if (status !== "authenticated") {
      signInState.onOpen();
      return;
    }

    if (hasExceededQuota) {
      openPlanSelection();
      return;
    }

    if (displayPaywallPopup) {
      setDisplayPaywallPopup(false);
      openPlanSelection();
      return;
    }

    setIsSubmitting(true);
    try {
      if (isTheFirstMessage) {
        const selectedModelsList = selectedModels.map((model) => model.name);
        await initializeChat(chatId, promptValue, selectedModelsList);
        setIsTheFirstMessage(false);
      }

      selectedModels.map(async (model) => {
        const chat = chats[model.name];
        if (chat) {
          chat.handleInputChange({
            target: { value: promptValue },
          } as any);
          chat.handleSubmit(e);
        }
      }),
        setPromptValue("");
    } catch (error) {
      console.error("Error submitting message:", error);
    } finally {
      setIsSubmitting(false);
    }

    // Paywall check at the last to improve performance
    setPaywallStates();

  };

  const handleLLMInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPromptValue(e.target.value);
    selectedModels.forEach((model) => {
      const chat = chats[model.name];
      if (chat) {
        chat.handleInputChange(e);
      }
    });
  };

  useEffect(() => {
    selectedModels.forEach((model) => {
      const chat = chats[model.name];
      if (chat) {
        chat.handleInputChange({ target: { value: promptValue } } as any);
      }
    });
  }, [selectedModels, setMessages]);

  // TODO: maybe fetch this on the server, occasionally running into async render issues
  useEffect(() => {
    setPaywallStates();
  }, []);

  useEffect(() => {
    async function fetchMessages() {
      const response = await fetch("/api/chat/history/" + chatId);
      if (!response.ok) {
        return
      }
      const history = await response.json();
      setChatTitle(history?.title || "Start the chat");
      // format to useChat specs (specifically sender => role), can we just rename 'sender' to 'role' in 'Message' model?
      const formattedMessages = history?.messages?.map(
        (message: { id: any; content: any; sender: any; modelId: any }) => ({
          id: message.id.toString(),
          content: message.content,
          role: message.sender,
          modelId: message.modelId,
        }),
      ) || [];
      // push fetched history contents into specific 'chat' entries in 'chats' object
      Object.values(chats).map((chat) => {
        //filter messages by language model id
        const filteredMessages = formattedMessages.filter(
          (message: { id: any; content: any; sender: any; modelId: any }) =>
            message.modelId === chat.modelId,
        );
        chat.setMessages(filteredMessages);
      });

      // if history exists, set isTheFirstMessage to false
      if (history.messages.length > 0) {
        setIsTheFirstMessage(false);
      }

      // set selectedModels based on history
      const historyModels = history?.messages.reduce((acc: Model[], message: { model: Model }) => {
        const model = message.model;
        if (!acc.some((m) => m.id === model.id)) {
          acc.push(model);
        }
        return acc;
      }, []);
      setSelectedModels(historyModels);
    }
    fetchMessages();
  }, [chatId]);

  const allChatsEmpty = Object.values(chats).every(
    (chat) => !chat.messages || chat.messages.length === 0,
  );

  return (
    <div className="flex h-full max-w-full flex-col items-start md:p-10 p-4 pb-24 md:w-[calc(100%-198px)]">
      <h2 className="text-h3 md:mb-6 mb-4 w-full self-start text-canvas">
        {chatTitle}
      </h2>
      <div className="flex md:h-64 md:min-h-0 min-h-80 w-full flex-grow md:flex-row flex-col md:gap-4 overflow-hidden md:mb-4">
        {/* TODO (BP): refactor later to clean this up & give it proper naming convention */}
        {allChatsEmpty &&
          selectedModels.length > 0 &&
          selectedModels.map((model, i) => (
            <div
              key={i}
              className="md:mb-4 mb-3 flex w-full flex-col gap-2 rounded-2xl bg-foreground-subtle p-4 h-full"
            >
              <div className="flex items-center justify-between">
                <p className="text-subtitle5 text-canvas">
                  {model.displayName}
                </p>
              </div>
              <div className="no-scrollbar h-[calc(100%-1rem)] overflow-y-auto rounded-2xl border border-border">
                <p className="text-subtitle4 p-4 text-border-inset">Text</p>
              </div>
            </div>
          ))}
        {allChatsEmpty && selectedModels.length == 0 && (
          <div
            key="placeholder"
            className="md:mb-4 mb-3 flex w-full flex-col gap-2 rounded-2xl bg-foreground-subtle p-4 h-full"
          >
            <div className="flex items-center justify-between">
              <p className="text-subtitle5 text-canvas">Select models</p>
            </div>
            <div className="no-scrollbar h-[calc(100%-1rem)] overflow-y-auto rounded-2xl border border-border bg-foreground-subtle">
              <p className="text-subtitle4 p-4 text-border-inset">Text</p>
            </div>
          </div>
        )}

        {!allChatsEmpty &&
          Object.values(chats).map((chat, index) =>
            chat.messages && chat.messages.length > 0 ? (
              <ChatWindow key={chat.modelId} chat={chat} />
            ) : null,
          )}
      </div>
      <div className="flex h-[168px] w-full flex-col gap-2 rounded-2xl bg-foreground-subtle px-4 py-5 relative">
        <p className="text-subtitle5 text-canvas">Select one or more models</p>
        <div className="mb-2 flex h-8 w-full gap-2 overflow-x-auto">
          {modelList.slice(0, 10).map((model) => (
            <Button
              key={model.id}
              onClick={() => handleButtonClick(model)}
              className={cn(
                "h-full px-3 text-xs disabled:cursor-not-allowed font-normal capitalize whitespace-nowrap",
                selectedModels.some(
                  (selectedModel) => selectedModel.id === model.id,
                )
                  ? "bg-white text-black"
                  : "bg-foreground-inset text-border-muted active:bg-canvas active:text-foreground",
              )}
              disabled={
                (!selectedModels.includes(model) &&
                  selectedModels.length >= 3) ||
                !allChatsEmpty
              }
            >
              {model.displayName}
            </Button>
          ))}
          {modelList.length > 10 && (
            <Button
              onClick={toggleModal}
              inverted={true}
              bordered={true}
              rightIcon={"arrowTopRight"}
              className={
                "h-full px-9 text-xs md:hover:bg-accent-foreground md:hover:text-foreground moreBtn"
              }
            >
              <p className="text-subtitle3 pr-3 font-medium">More</p>
            </Button>
          )}
        </div>
        <form onSubmit={handleSubmit}>
          <div className="relative flex flex-1">
            <Textarea
              value={promptValue}
              setValue={setPromptValue}
              name="prompt"
              className={cn(
                "rounded-[80px] border border-border p-4 outline-0 bg-foreground-subtle focus-visible:border-[1px] focus-visible:border-solid whitespace-nowrap overflow-hidden pe-8",
                isSubmitting ? "opacity-50" : "",
              )}
              placeholder="What would you like to know about web3 projects?"
              onChange={handleLLMInputChange}
              disabled={isSubmitting}
            />
            <Button
              type="submit"
              className="absolute bottom-4 right-4 h-6 w-6 rounded-md text-accent-foreground"
              disabled={isSubmitting}
            >
              <SvgIcon name="send" />
            </Button>
          </div>
        </form>
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 flex md:items-center items-end justify-center bg-black bg-opacity-80  z-20">
          <div className="flex max-h-[520px] w-[400px] flex-col gap-4 md:rounded-lg rounded-t-3xl bg-[#18191B] p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-h5 text-canvas">Select Models</h2>
              <button
                className="text-caption text-canvas"
                onClick={toggleModal}
              >
                <SvgIcon name="cross" className="s-[32px]! text-canvas" />
              </button>
            </div>
            <ul className="no-scrollbar overflow-y-auto">
              {sortedModelList.map((model) => (
                <li key={model.id}>
                  <div className="mb-4 flex h-5 items-center justify-between">
                    <label
                      htmlFor={model.displayName}
                      className="text-subtitle4 md:text-border-muted text-[#fff9]"
                    >
                      {`${model.provider}: ${model.displayName}`}
                    </label>
                    <input
                      id={model.name}
                      type="checkbox"
                      checked={selectedModels.includes(model)}
                      onChange={() => handleButtonClick(model)}
                      className="text-red-60 h-4 w-4 rounded border border-border"
                    />
                  </div>
                </li>
              ))}
            </ul>
            <Button
              primary={true}
              onClick={() => toggleModal()}
              className="mt-4 px-4 py-2 font-medium"
              rightIcon={"arrowTopRight"}
            >
              <p className="pr-3">Confirm</p>
            </Button>
          </div>
        </div>
      )}
      <SignInModal />
    </div>
  );
};

export default ChatPageLLMForm;
