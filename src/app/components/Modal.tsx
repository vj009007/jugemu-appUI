import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { Button } from "./Button";
import { classNames } from "../utils/helper";
import { IconName, SvgIcon } from "./SvgIcon";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
  buttonClassName?: string;
};

const Modal = ({
  isOpen,
  onClose,
  children,
  className,
  buttonClassName,
}: ModalProps) => {
  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        {/* Backdrop */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-[rgba(24,25,27,1)] opacity-[98%] transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full md:items-center items-end justify-center md:p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel
                className={classNames(
                  "relative transform overflow-hidden md:rounded-3xl rounded-t-3xl bg-[rgb(255,255,255,0.04)] p-6 text-left shadow-xl transition-all",
                  className,
                )}
              >
                <Button
                  onClick={onClose}
                  leftIcon="cross"
                  className={classNames(
                    "absolute right-6 top-6 z-20 h-6 w-6 rounded-sm text-canvas opacity-70 transition-opacity",
                    buttonClassName,
                  )}
                ></Button>
                {children}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

type ModalHeaderProps = {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  titleAlign?: "center" | "left";
  subtitleAlign?: "center" | "left";
  titleClassName?: string;
  subtitleClassName?: string;
};

const ModalHeader = ({
  title,
  subtitle,
  icon,
  titleAlign = "center",
  subtitleAlign = "center",
  titleClassName,
  subtitleClassName,
}: ModalHeaderProps) => {
  return (
    <div>
      {icon && <div className="mb-5">{icon}</div>}
      <div className="mb-6">
        <Dialog.Title
          as="h3"
          className={classNames(
            "text-h5 text-canvas",
            titleClassName,
            titleAlign === "left" ? "text-left" : "text-center",
          )}
        >
          {title}
        </Dialog.Title>

        {subtitle && (
          <div
            className={classNames(
              "mt-3 w-[300px] text-sm text-border-muted",
              subtitleClassName,
              subtitleAlign === "left" ? "w-full text-left" : "text-center",
            )}
          >
            {subtitle}
          </div>
        )}
      </div>
    </div>
  );
};

const ModalBody = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return <div className={classNames("mt-3", className)}>{children}</div>;
};

type ModalFooterProps = {
  text?: string;
  link?: string;
};

const ModalFooter = ({ text, link }: ModalFooterProps) => {
  return (
    <div className="text-muted-foreground mt-6 flex items-center justify-center gap-1 px-4 text-center text-xs font-normal">
      {text}{" "}
      <a href="#" className="text-medium text-primary hover:underline">
        {link}
      </a>
    </div>
  );
};

type ButtonProps = {
  text: string;
  iconLeft?: string | IconName;
  iconRight?: string | IconName;
  className?: string;
  childrenClassName?: string;
  onClick?: () => void;
  primary?: boolean;
};

type ModalButtonsProps = {
  buttons: ButtonProps[];
  modalButtonClassName?: string;
};

const ModalButtons = ({ buttons, modalButtonClassName }: ModalButtonsProps) => {
  return (
    <div
      className={classNames("flex h-full w-full gap-4", modalButtonClassName)}
    >
      {buttons.map((button) => (
        <Button
          className={classNames(
            "h-full w-full gap-[10px] px-[10px]",
            button.className,
          )}
          key={button.text}
          {...button}
          leftIcon={button.iconLeft as IconName}
          rightIcon={button.iconRight as IconName}
          onClick={button.onClick}
        >
          <p
            className={classNames(
              "mx-3 text-sm font-medium leading-tight",
              button.childrenClassName,
            )}
          >
            {button.text}
          </p>
        </Button>
      ))}
    </div>
  );
};

export { Modal, ModalHeader, ModalBody, ModalFooter, ModalButtons };
