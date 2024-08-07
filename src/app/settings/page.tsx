import React from 'react';
import SideBar from "@/app/components/SideBar";
import SettingBar from "@/app/components/SettingBar";

const SettingPage: React.FC = () => {
  return (
    <main className="flex flex-1">
      <div className="flex w-full md:flex-row flex-col">
        <SideBar />
        <SettingBar />
      </div>
    </main>
  );
};

export default SettingPage;