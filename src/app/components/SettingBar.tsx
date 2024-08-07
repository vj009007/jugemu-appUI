"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { Button } from "@headlessui/react";
import Close from "@/public/close-icon.svg";
import Image from "next/image";

const SettingBar: React.FC = () => {
  const router = useRouter();
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const togglePopup = () => {
    setIsPopupOpen(!isPopupOpen);
  };


  
  const handleSignOut = () => {
    signOut();
    router.push("/");
  }


  return (
    <div className="flex h-full max-w-full flex-col items-start md:p-10 p-4 pb-24 md:w-[calc(100%-198px)]">
      <h2 className="text-h3 mb-6 w-full self-start text-canvas">Settings</h2>
      <div className="grid w-full grid-cols-1 gap-4">
        <div className="w-full p-4 gap-4 flex items-center justify-between bg-[#ffffff0a] rounded-3xl">
          <div>
            <h4 className="text-base leading-6 font-normal text-white">Logout</h4>
            <p className="text-sm leading-6 font-normal text-[#ffffff99]">
              Logout from this service
            </p>
          </div>
          <Button 
            onClick={handleSignOut}
            className="flex-center rounded-[40px] disabled:opacity-80 disabled:cursor-default gap-3 transition-all border border-accent-foreground bg-accent-foreground text-foreground hover:bg-transparent hover:text-accent-foreground py-3 px-10"
          >
            Logout <span className="icon-btn-arrow"></span>
          </Button>
        </div>
        <div className="w-full p-4 flex items-center justify-between bg-[#ffffff0a] rounded-3xl">
          <div>
            <h4 className="text-base leading-6 font-normal text-rose-600">Cancel Subscription</h4>
            <p className="text-sm leading-6 font-normal text-[#ffffff99]">
              Cancel your subscription. This action cannot be undone.
            </p>
          </div>
          <Button onClick={togglePopup} className="text-sm text-rose-600 font-medium leading-5 hover:text-rose-800">
            Proceed
          </Button>
        </div>
      </div>
      {/* Popup Component */}
      {isPopupOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-[#101112] rounded-3xl shadow-lg p-6 w-90 max-w-[480px]">
            <div className="flex items-start justify-between mb-6">
              <h3 className="text-2xl font-normal text-canvas tracking-[-1px]">
                Do you really want to cancel your subscription?
              </h3>
              <Button onClick={togglePopup}>
                <Image src={Close} alt="Close Icon" className="min-w-6 mt-2" />
              </Button>
            </div>
            <label className="relative block">
              <span className="absolute inset-y-0 right-0 flex items-center pe-4 text-canvas">
                Until 12.09.2024
              </span>
              <input
                type="text"
                value="$99.99 / year"
                disabled
                className="w-full p-4 text-sm rounded-xl bg-[#ffffff0a] text-[#ffffff99] font-normal"
              />
            </label>

            <div className="flex items-center gap-4 mt-6">
              <Button className="flex-center rounded-[40px] disabled:opacity-80 disabled:cursor-default gap-3 border border-accent-foreground transition-all bg-accent-foreground text-foreground hover:bg-transparent hover:text-accent-foreground py-3 px-10 w-full">
                No <span className="icon-btn-arrow"></span>
              </Button>
              <Button className="flex-center rounded-[40px] gap-3 transition-all border border-accent-foreground text-accent-foreground hover:bg-accent-foreground hover:text-foreground py-3 px-10 w-full">
                Yes <span className="icon-btn-arrow"></span>
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingBar;
