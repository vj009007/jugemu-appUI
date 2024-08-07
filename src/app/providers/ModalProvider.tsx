"use client";

import { useEffect, useState } from "react";
import SignInModal from "../components/Modals/SignInModal";
import PaymentModal from "../components/Modals/PaymentModal";
import CalendarModal from "../components/Modals/CalendarModal";
const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <SignInModal />
      <PaymentModal />
      <CalendarModal />
    </>
  );
};

export default ModalProvider;
