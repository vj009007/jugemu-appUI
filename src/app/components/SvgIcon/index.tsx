import { memo } from "react";
import * as RAW_ICONS_MAP from "./icons";
import { classNames } from "../../utils/helper";
import { lowerFirst, mapKeys } from "lodash";

const ICON_MAP = mapKeys(RAW_ICONS_MAP, (value, key) =>
  lowerFirst(key),
) as Record<
  Uncapitalize<keyof typeof RAW_ICONS_MAP>,
  (typeof RAW_ICONS_MAP)[keyof typeof RAW_ICONS_MAP]
>;

export type IconName = keyof typeof ICON_MAP;

type SvgIconProps = {
  name: IconName;
  className?: string;
  style?: React.CSSProperties;
};

export const SvgIcon = memo(function SvgIcon({
  name,
  className,
  style,
}: SvgIconProps) {
  const Icon = ICON_MAP[name];
  return (
    <div
      className={classNames("flex-center s-[18px] [&_svg]:grow", className)}
      style={{ color: style?.color }}
    >
      <Icon />
    </div>
  );
});
