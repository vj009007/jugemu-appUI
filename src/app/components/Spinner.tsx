import { times } from "lodash";
import { classNames } from "../utils/helper";

interface SpinnerProps {
  inverted?: boolean;
  className?: string;
}

export const Spinner = ({ inverted, className }: SpinnerProps) => {
  return (
    <div className={classNames("s-6 relative inline-block", className)}>
      {times(12, (index) => (
        <div
          key={index}
          className="origin-[12px_12px] animate-hide"
          style={
            index < 9
              ? {
                  transform: `rotate(${45 * index}deg)`,
                  animationDelay: `-${0.8 - 0.1 * index}s`,
                }
              : undefined
          }
        >
          <div
            className={classNames(
              "absolute left-2.5 top-px h-[6px] w-[3px] rounded-[1px]",
              inverted ? "bg-foreground" : "bg-accent-foreground",
            )}
          />
        </div>
      ))}
    </div>
  );
};
