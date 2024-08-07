"use client";
import { redirect } from 'next/navigation';
import { v4 as uuidv4  } from 'uuid';

const ChatPage: React.FC = () => {
  const chatId = uuidv4();

  redirect(`/chat/${chatId}`);
};

export default ChatPage;
