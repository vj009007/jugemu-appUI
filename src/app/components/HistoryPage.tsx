"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "./Button";
import { Textarea } from "./TextArea";
import { ChatWithModels } from "@/app/actions/chat/chat";
import { useCalendar } from "@/app/lib/hooks/useCalendar";
import { deleteAllChats } from "../actions/chat/history";

type HistoryPageProps = {
  chats: ChatWithModels[];
};

const HistoryPage: React.FC<HistoryPageProps> = ({ chats }) => {
  const [searchValue, setSearchValue] = useState<string>("");
  const calendarState = useCalendar();
  const router = useRouter();

  useEffect(() => {
    calendarState.updateChats(chats);
  }, []);

  const Header = () => {
    return (
      <div className="flex w-full items-center lg:flex-nowrap flex-wrap lg:gap-11 md:gap-5 gap-3">
        <h2 className="text-h3 text-canvas md:w-auto w-full">History</h2>
        <Textarea
          value={searchValue}
          setValue={setSearchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          placeholder="Search..."
          className="rounded-[80px] border border-border bg-foreground-subtle p-4 outline-0 focus-visible:border-[1px] focus-visible:border-solid w-full md:max-w-full max-w-[55%]"
        />
        <div className="flex md:gap-4 gap-3">
          <Button
            onClick={calendarState.onOpen}
            bordered={true}
            inverted={true}
            rightIcon="calendar"
            className="h-[52px] w-[52px] border-transparent bg-foreground-subtle hover:bg-accent-foreground hover:text-foreground"
          />
          <Button
            onClick={async () => await deleteAllChats()}
            bordered={true}
            inverted={true}
            className="h-[52px] md:w-[122px] px-4 bg-transparent hover:bg-accent-foreground hover:text-foreground"
          >
            <span className="text-subtitle3 font-medium flex items-center gap-1">Clear <span className="md:inline hidden">history</span></span>
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="mx-auto md:h-screen flex w-full flex-col items-center gap-6 md:p-10 p-4 pb-24 md:w-[calc(100%-198px)]">
      <Header />
      <div className="=flex h-full w-full flex-col gap-6 overflow-y-auto rounded-3xl bg-foreground-subtle p-6">
        <div className="flex flex-col gap-2">
          <div className="flex justify-between border-b border-border pb-2">
            <p className="text-subtitle2 pt-1 text-canvas">Today</p>
            <Button inverted={true}>Clear</Button>
          </div>
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-3">
              {calendarState.chats.map((chat, index) => (
                <div
                  key={index}
                  className="text-subtitle4 flex flex-wrap cursor-pointer gap-3 rounded-xl px-2 py-1 hover:bg-foreground-inset"
                  onClick={() => router.push(`/chat/${chat.hash}`)}
                >
                  <p className="text-canvas">{chat.summary}</p>
                  {chat.models!.map((item, idx) => (
                    <div
                      key={idx}
                      className="text-subtitle5 flex-center rounded-xl bg-foreground-inset px-3 py-1 text-border-muted"
                    >
                      {item.model.displayName}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HistoryPage;
