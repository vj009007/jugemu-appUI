"use client";

import { classNames } from "../utils/helper";
import Image from "next/image";
// import useTextAreaAutosize from "@/app/lib/hooks/use-textarea-auto-resize";
import {
  Dispatch,
  SetStateAction,
  TextareaHTMLAttributes,
  useState,
  useRef,
} from "react";
import { SvgIcon } from "./SvgIcon";

export interface TextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  logoSrc?: string;
  value: string;
  setValue: Dispatch<SetStateAction<string>>;
}

const Textarea = ({
  value,
  setValue,
  className,
  logoSrc,
  ...props
}: TextareaProps) => {
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const [isComposing, setIsComposing] = useState(false);

  //   useTextAreaAutosize(textAreaRef.current, value);

  const handleChange = (evt: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = evt.target?.value;
    setValue(val);
  };

  const handleCompositionStart = () => {
    setIsComposing(true);
    //console.log('Composition started');
  };

  const handleCompositionEnd = () => {
    setIsComposing(false);
    //console.log('Composition ended');
  };

  const handleKeyDown = (evt: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (evt.key === "Enter" && isComposing) {
      evt.preventDefault();
      //console.log('Enter key press prevented during composition');
    } else if (evt.key === "Enter" && !evt.shiftKey) {
      evt.preventDefault();
      const form = evt.currentTarget.form;
      if (form) {
        form.requestSubmit();
      }
    }
  };

  return (
    <>
      {logoSrc && (
        <div className="pointer-events-none absolute bottom-5 left-0 ml-5 flex items-center">
          <SvgIcon name={"logo"} className="h-6 w-6" />
        </div>
      )}
      <textarea
        ref={textAreaRef}
        rows={1}
        className={classNames(
          "border-input bg-background ring-offset-background placeholder:text-border-inset flex max-h-52 min-h-10 w-full resize-none overflow-y-scroll rounded-[20px] border px-3 py-2 text-sm text-white focus-visible:border-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-white focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50",
          className,
          logoSrc && "px-[52px]",
        )}
        value={value}
        onChange={handleChange}
        onCompositionStart={handleCompositionStart}
        onCompositionEnd={handleCompositionEnd}
        onKeyDown={handleKeyDown}
        {...props}
      />
    </>
  );
};

export { Textarea };
