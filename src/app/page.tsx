"use client";
import { redirect } from "next/navigation";

const HomePage: React.FC = () => {
  redirect(`/chat`);
};

export default HomePage;
