"use client";

import Link from "next/link";
import { Button } from "./Button";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import { useSignIn } from "../lib/hooks/use-sign-in";
import { usePayment } from "../lib/hooks/usePayment";
import { usePathname } from "next/navigation";
import { classNames } from "../utils/helper";
import { profile } from "console";

export const SideBar = () => {
  const { data: session, status } = useSession();
  const signIn = useSignIn();
  const { onOpen } = usePayment();
  const pathname = usePathname();

  const buttons = {
    chat: (
      <Button
        leftIcon={"chat"}
        href={"/chat"}
        className={classNames(
          "h-8 w-full gap-3 rounded-none md:border-l-2 md:border-t-0 border-t-2 border-transparent bg-transparent md:pl-10 md:pt-0 pt-3 text-border-muted transition-none md:hover:border-l-2 hover:border-accent-foreground hover:text-accent-foreground",
          pathname === "/chat" &&
            "md:border-l-2 md:border-t-0 border-t-2 border-accent-foreground text-accent-foreground",
        )}
      >
        <p className="text-subtitle3">Chat</p>
      </Button>
    ),
    history: (
      <Button
        leftIcon={"clock"}
        href={"/history"}
        className={classNames(
          "h-8 w-full gap-3 rounded-none md:border-l-2 md:border-t-0 border-t-2 border-transparent bg-transparent md:pl-10 md:pt-0 pt-3 text-border-muted transition-none md:hover:border-l-2 hover:border-accent-foreground hover:text-accent-foreground",
          pathname === "/history" &&
            "md:border-l-2 md:border-t-0 border-t-2 border-accent-foreground text-accent-foreground",
        )}
      >
        <p className="text-subtitle3">History</p>
      </Button>
    ),
    profile: (
      <Button
        leftIcon={"profile"}
        href={"/profile"}
        className={classNames(
          "h-8 w-full gap-3 rounded-none md:border-l-2 md:border-t-0 border-t-2 border-transparent bg-transparent md:pl-10 md:pt-0 pt-3 text-border-muted transition-none md:hover:border-l-2 hover:border-accent-foreground hover:text-accent-foreground md:hidden flex",
          pathname === "/profile" &&
            "md:border-l-2 md:border-t-0 border-t-2 border-accent-foreground text-accent-foreground",
        )}
      >
        <p className="text-subtitle3">Profile</p>
      </Button>
    ),
    settings: (
      <Button
        leftIcon={"settings"}
        href={"/settings"}
        className={classNames(
          "h-8 w-full gap-3 rounded-none md:border-l-2 md:border-t-0 border-t-2 border-transparent bg-transparent md:pl-10 md:pt-0 pt-3 text-border-muted transition-none md:hover:border-l-2 hover:border-accent-foreground hover:text-accent-foreground",
          pathname === "/settings" &&
            "md:border-l-2 md:border-t-0 border-t-2 border-accent-foreground text-accent-foreground",
        )}
      >
        <p className="text-subtitle3">Settings</p>
      </Button>
    ),
    support: (
      <Button
        leftIcon={"customerSupport"}
        href={"mailto:support@jugemu.ai"}
        className={classNames(
          "h-8 w-full gap-3 rounded-none md:border-l-2 md:border-t-0 border-t-2 border-transparent bg-transparent md:pl-10 md:pt-0 pt-3 text-border-muted transition-none md:hover:border-l-2 hover:border-accent-foreground hover:text-accent-foreground",
          pathname === "/support" &&
            "md:border-l-2 md:border-t-0 border-t-2 border-accent-foreground text-accent-foreground",
        )}
      >
        <p className="text-subtitle3">Support</p>
      </Button>
    ),
  };

  const AccountCard = () => {
    return (
      <div className="flex-center md:h-[212px] w-max md:flex-col gap-4 rounded-xl md:bg-foreground-subtle md:py-4 pl-4 md:pr-4 md:mt-4">
        <Image
          src={session?.user.image || "/sampleUser.svg"}
          alt="User image"
          width={56}
          height={56}
          className="rounded-full"
        />
        <div className="flex md:items-center flex-col gap-2">
          <p className="text-subtitle4 text-canvas">
            {session?.user.name || "Guest"}
          </p>
          <div className="text-subtitle5 flex-center w-full rounded-xl bg-foreground-inset px-3 py-1 text-border-muted md:!block !hidden">
            {session?.user.subscriptionStatus ? "Premium" : "Free Plan"}
          </div>
          {!session?.user.subscriptionStatus && (
          <Button
            onClick={onOpen}
            bordered={true}
            inverted={true}
            rightIcon={"arrowTopRight"}
            className={
              "bg-foreground-inset px-3 py-1 border-none hover:bg-accent-foreground hover:text-foreground  md:!hidden "
            }
          >
            <p className="text-subtitle3 hover:text-foreground text-border-muted text-bo pr-3">{session?.user.subscriptionStatus ? "Premium" : "Free Plan"}</p>
          </Button>
        )}
        </div>

        {!session?.user.subscriptionStatus && (
          <Button
            onClick={onOpen}
            bordered={true}
            inverted={true}
            rightIcon={"arrowTopRight"}
            className={
              "h-10 w-[134px] bg-transparent hover:bg-accent-foreground hover:text-foreground md:!flex !hidden"
            }
          >
            <p className="text-subtitle3 pr-3">Upgrade</p>
          </Button>
        )}
       
      </div>
    );
  };
  return (
    <div
      className={`flex h-full md:min-w-[198px] md:w-[calc(100vh*0.20)] md:flex-col flex-row-reverse md:items-center items-start md:justify-start justify-between gap-0 py-5 mobile-transparent-background `}
      style={{
        backgroundImage: `url('/bg-sidebar.png')`,
        backgroundSize: "100% 100%",
        backgroundPosition: "10% 40%",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="md:mb-[52px] flex md:w-full items-center flex-col px-4 py-2">
        <Link
          href="/"
          className="mb-9 mx-auto w-[131px] rounded-lg transition-opacity hover:opacity-80 md:block hidden"
        >
          <Image
            src="/jugemuAi-logo.svg"
            alt="Jugemu.AI"
            width={6000}
            height={6000}
          />
        </Link>
        {session ? (
          <Button
            primary={true}
            rightIcon={"arrowTopRight"}
            className={"flex-center w-[150px] text-sm font-medium leading-6 rounded-[40px] disabled:opacity-80 disabled:cursor-default gap-3 transition-all border border-accent-foreground bg-accent-foreground text-foreground hover:bg-transparent hover:text-accent-foreground md:py-[11px] py-[7px] md:px-6 px-4"}
            href={"/chat"}
          >
              New chat 
          </Button>
        ) : (
          <Button
            primary={true}
            className={"flex-center w-[150px] text-sm font-medium leading-6 rounded-[40px] disabled:opacity-80 disabled:cursor-default gap-3 transition-all border border-accent-foreground bg-accent-foreground text-foreground hover:bg-transparent hover:text-accent-foreground py-[11px] px-6"}
            onClick={signIn.onOpen}
          >
            Sign in <span className="icon-btn-arrow"></span>
          </Button>
        )}
      </div>
      <div className="mb-auto flex w-full md:bg-transparent md:flex-col md:gap-8 md:relative fixed bottom-0 z-10 left-0 md:px-0 px-5 md:justify-start justify-center bg-[#212224] pb-4 mobileNav">
        {buttons.chat}
        {buttons.history}
        {buttons.settings}
        {buttons.support}
        {buttons.profile}
      </div>
      {session && <AccountCard />}
    </div>
  );
};

export default SideBar;
