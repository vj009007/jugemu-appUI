import { create } from "zustand";
import { ChatWithModels } from "../../actions/chat/chat";

type CalendarStore = {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  searchDate?: { startDate: Date; endDate: Date };
  updateSearchDate: (startDate: Date, endDate: Date) => void;
  chats: ChatWithModels[];
  updateChats: (chats: ChatWithModels[]) => void;
};

export const useCalendar = create<CalendarStore>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
  searchDate: undefined,
  updateSearchDate: (startDate: Date, endDate: Date) =>
    set({ searchDate: { startDate, endDate } }),
  chats: [],
  updateChats: (chats: ChatWithModels[]) => set({ chats }),
}));
