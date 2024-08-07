import SideBar from "../components/SideBar";
import HistoryPage from "../components/HistoryPage";
import { getChats, ChatWithModels } from "@/app/actions/chat/chat";

const Historypage = async () => {
  const chats: ChatWithModels[] = await getChats();
  return (
    <main className="flex flex-1">
      <div className="flex w-full md:flex-row flex-col">
        <SideBar />
        <HistoryPage chats={chats}/>
      </div>
    </main>
  );
};

export default Historypage;
