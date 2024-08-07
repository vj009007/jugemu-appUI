import SideBar from "@/app/components/SideBar";
import ChatPageLLMForm from "@/app/components/ChatPageLLMForm";
import { getModelList } from "../../actions/chat/model";

const ChatPage = async ({
  params,
}: {
  params: {
    chatId: string;
  };
}) => {
  const modelList = await getModelList();

  return (
    <main className="flex flex-1">
      <div className="flex w-full md:flex-row flex-col">
        <SideBar />
        <ChatPageLLMForm chatId={params.chatId} modelList={modelList} />
      </div>
    </main>
  );
};

export default ChatPage;
