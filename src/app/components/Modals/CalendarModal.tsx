import { Spinner } from "../Spinner";
import { useState } from "react";
import { Modal, ModalButtons, ModalHeader } from "../Modal";
import { useCalendar } from "@/app/lib/hooks/useCalendar";
import { classNames } from "../../utils/helper";
import { Button } from "../Button";
import {
  add,
  eachDayOfInterval,
  endOfMonth,
  format,
  getDay,
  isEqual,
  isSameMonth,
  isToday,
  parse,
  startOfToday,
  isAfter,
  isBefore,
} from "date-fns";
import { getChatByDate } from "../../actions/chat/chat";
import { ChatWithModels } from "../../actions/chat/chat";

const colStartClasses = [
  "",
  "col-start-2",
  "col-start-3",
  "col-start-4",
  "col-start-5",
  "col-start-6",
  "col-start-7",
];

const isBetween = (date: Date, startDate: Date, endDate: Date): boolean => {
  return (
    (isAfter(date, startDate) || isEqual(date, startDate)) &&
    (isBefore(date, endDate) || isEqual(date, endDate))
  );
};

const CalendarModal = () => {
  const calendarState = useCalendar();

  const today = startOfToday();
  const [selectedDays, setSelectedDays] = useState<Date[]>([today]);
  const [currentMonth, setCurrentMonth] = useState<string>(
    format(today, "MMM-yyyy"),
  );

  const firstDayCurrentMonth = parse(currentMonth, "MMM-yyyy", new Date());

  const days = eachDayOfInterval({
    start: firstDayCurrentMonth,
    end: endOfMonth(firstDayCurrentMonth),
  });

  function previousMonth() {
    const firstDayNextMonth = add(firstDayCurrentMonth, { months: -1 });
    setCurrentMonth(format(firstDayNextMonth, "MMM-yyyy"));
  }

  function nextMonth() {
    const firstDayNextMonth = add(firstDayCurrentMonth, { months: 1 });
    setCurrentMonth(format(firstDayNextMonth, "MMM-yyyy"));
  }

  function handleDayClick(day: Date) {
    if (selectedDays.some((selectedDay) => isEqual(selectedDay, day))) {
      setSelectedDays(
        selectedDays.filter((selectedDay) => !isEqual(selectedDay, day)),
      );
    } else if (selectedDays.length === 2) {
      setSelectedDays([day]);
    } else {
      setSelectedDays(
        [...selectedDays, day].sort((a, b) => a.getTime() - b.getTime()),
      );
    }
  }

  async function handleConfirm() {
    if (selectedDays.length === 2) {
      calendarState.updateSearchDate(selectedDays[0], selectedDays[1]);

      const chats = await getChatByDate(selectedDays[0], selectedDays[1]);

      calendarState.updateChats(chats as unknown as ChatWithModels[]);
    }
    calendarState.onClose();
  }
  return (
    <Modal
      isOpen={calendarState.isOpen}
      onClose={calendarState.onClose}
      className="w-full md:max-w-[328px]"
      buttonClassName="text-accent-foreground hover:text-gray-500"
    >
      <div>
        <div className="flex-center gap-1">
          <Button
            type="button"
            onClick={previousMonth}
            leftIcon="arrowLeft"
            className="flex-center text-accent-foreground hover:text-gray-500"
          >
            <span className="sr-only">Previous month</span>
          </Button>
          <h2 className="flex-center font-semibold text-canvas">
            {format(firstDayCurrentMonth, "MMMM yyyy")}
          </h2>
          <Button
            onClick={nextMonth}
            leftIcon="arrowRight"
            type="button"
            className="flex-center text-accent-foreground hover:text-gray-500"
          >
            <span className="sr-only">Next month</span>
          </Button>
        </div>
        <div className="mt-10 grid grid-cols-7 text-center text-xs leading-6 text-gray-500">
          <div>S</div>
          <div>M</div>
          <div>T</div>
          <div>W</div>
          <div>T</div>
          <div>F</div>
          <div>S</div>
        </div>
        <div className="mt-2 grid grid-cols-7 text-sm">
          {days.map((day, dayIdx) => (
            <div
              key={day.toString()}
              className={classNames(
                dayIdx === 0 && colStartClasses[getDay(day)],
                "py-1.5",
              )}
            >
              <button
                type="button"
                onClick={() => handleDayClick(day)}
                className={classNames(
                  selectedDays.some((selectedDay) =>
                    isEqual(selectedDay, day),
                  ) && "bg-accent-emphasis text-accent-foreground",
                  // If the day is today
                  isToday(day) &&
                    "bg-foreground-subtle text-border-muted hover:text-accent-foreground",
                  // If the day is not selected, is today, and there are no selected days
                  !selectedDays.some((selectedDay) =>
                    isEqual(selectedDay, day),
                  ) &&
                    isToday(day) &&
                    !selectedDays.length &&
                    "bg-accent-emphasis text-accent-foreground",
                  //If the day is not selected, is not today, and is in the current month
                  !selectedDays.some((selectedDay) =>
                    isEqual(selectedDay, day),
                  ) &&
                    !isToday(day) &&
                    isSameMonth(day, firstDayCurrentMonth) &&
                    "bg-foreground-subtle text-border-muted hover:text-accent-foreground",
                  //If the day is selected and is today, and there are two selected days
                  selectedDays.some((selectedDay) =>
                    isEqual(selectedDay, day),
                  ) &&
                    isToday(day) &&
                    "bg-accent-emphasis text-accent-foreground",
                  //If the day is not selected, two days are selected, and the day is between the two selected days
                  !selectedDays.some((selectedDay) =>
                    isEqual(selectedDay, day),
                  ) &&
                    selectedDays.length === 2 &&
                    isBetween(day, selectedDays[0], selectedDays[1]) &&
                    "bg-accent-emphasis text-accent-foreground",

                  "mx-auto flex h-8 w-8 items-center justify-center rounded-xl hover:bg-accent-emphasis",
                )}
              >
                <time dateTime={format(day, "yyyy-MM-dd")}>
                  {format(day, "d")}
                </time>
              </button>
            </div>
          ))}
        </div>

        <Button
          rightIcon={"arrowTopRight"}
          primary={true}
          className={"mt-[14px] h-12 w-full"}
          onClick={handleConfirm}
        >
          <p className="text-subtitle3 pr-3 font-medium hover:bg-accent-muted">
            Confirm
          </p>
        </Button>
      </div>
    </Modal>
  );
};
export default CalendarModal;
