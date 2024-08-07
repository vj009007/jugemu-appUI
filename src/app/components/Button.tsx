import React, { HTMLProps } from "react";
import { IconName, SvgIcon } from "./SvgIcon";
import Link, { LinkProps } from "next/link";
import { classNames } from "../utils/helper";
import { Spinner } from "./Spinner";

type SharedProps = Pick<
  HTMLProps<HTMLButtonElement>,
  "children" | "id" | "className"
> & {
  primary?: boolean;
  inverted?: boolean;
  leftIcon?: IconName;
  rightIcon?: IconName;
  bordered?: boolean;
  loading?: boolean;
};

type ButtonButtonProp = Pick<
  HTMLProps<HTMLButtonElement>,
  "disabled" | "onClick" | "onMouseLeave"
> & {
  type?: "button" | "submit" | "reset";
} & SharedProps;

type ButtonLinkProps = LinkProps &
  SharedProps & { target?: string; rel?: string };

export type ButtonProps = ButtonButtonProp | ButtonLinkProps;
export const Button = (props: ButtonProps) => {
  const {
    primary,
    inverted,
    loading,
    leftIcon,
    rightIcon,
    children,
    className,
    bordered,
    ...restProps
  } = props;
  const sharedProps = {
    className: classNames(
      "flex-center rounded-[40px] h-fit disabled:opacity-80 disabled:cursor-default transition-all",
      inverted
        ? "bg-transparent text-accent-foreground not-disabled:hover:brightness-95"
        : primary
          ? "bg-accent-foreground text-foreground not-disabled:hover:opacity-80"
          : "text-foreground not-disabled:hover:brightness-95",
      bordered &&
        (inverted
          ? "border border-accent-foreground"
          : "border border-border-interactive"),
      className,
    ),
    children: loading ? (
      <Spinner inverted={primary} className="h-6 w-6" />
    ) : (
      <>
        {leftIcon && <SvgIcon name={leftIcon} />}
        {children}
        {rightIcon && <SvgIcon name={rightIcon} />}
      </>
    ),
  };

  return "href" in restProps ? (
    <Link
      {...sharedProps}
      {...restProps}
      className={classNames(sharedProps.className, "w-max")}
    />
  ) : (
    <button {...sharedProps} {...restProps} type={restProps.type ?? "button"} />
  );
};
