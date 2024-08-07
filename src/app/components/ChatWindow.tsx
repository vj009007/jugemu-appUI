"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Button } from "./Button";
import { useSession } from "next-auth/react";
import { useChat } from "ai/react";
import { Model } from "@prisma/client";

const useScrollToBottom = () => {
  const [shouldScroll, setShouldScroll] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (container && shouldScroll) {
      const scrollHeight = container.scrollHeight;
      const height = container.clientHeight;
      const maxScrollTop = scrollHeight - height;
      container.scrollTop = maxScrollTop > 0 ? maxScrollTop : 0;
    }
  });

  const handleScroll = () => {
    const container = containerRef.current;
    if (container) {
      const isScrolledToBottom =
        Math.abs(
          container.scrollHeight - container.clientHeight - container.scrollTop,
        ) < 1;
      setShouldScroll(isScrolledToBottom);
    }
  };

  return { containerRef, handleScroll };
};

type Chat = ReturnType<typeof useChat> & {
  modelId: number;
  name: Model["name"];
  displayName: Model["displayName"];
};

type ChatWindowProps = {
  chat: Chat;
};

const ChatWindow = ({ chat }: ChatWindowProps) => {
  const { data: session } = useSession();
  const { containerRef, handleScroll } = useScrollToBottom();

  const formatContent = (content: string) => {
    return content
      .replace(/### (.+)/g, '<h2>$1</h2>') // Convert `### heading` to `<h2>heading</h2>`
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>'); // Convert `**bold**` to `<strong>bold</strong>`
  };

  return (
    <div className="mb-4 flex w-full flex-col gap-2 rounded-2xl bg-foreground-subtle p-4 h-full">
      <div className="flex items-center justify-between">
        <p className="text-subtitle5 text-canvas">{chat.displayName}</p>
      </div>
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="no-scrollbar flex h-[calc(100%-1rem)] flex-col overflow-y-auto rounded-2xl border border-border p-4 chatBox"
      >
        {chat.messages.map((m, i) => (
          <div key={i} className="text-body2 mb-4 flex flex-col text-canvas">
            <div className="inline-flex items-start gap-4">
              {m.role === "user" ? (
                <Image
                  src={session?.user.image || "/sampleUser.svg"}
                  alt="User image"
                  width={24}
                  height={24}
                  className="rounded-xl"
                />
              ) : (
                <Image
                  src={"/jugemuAi-logo_icon.svg"}
                  alt="AI image"
                  width={24}
                  height={24}
                />
              )}
              <div
                className="whitespace-pre-line text-subtitle4"
                dangerouslySetInnerHTML={{ __html: formatContent(m.content) }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatWindow;
