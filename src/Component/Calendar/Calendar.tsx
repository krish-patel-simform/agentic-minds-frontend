import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import {
  formatMonthYear,
  isAfterDay,
  isBeforeDay,
  isSameDate,
  startOfDay,
} from "../../utils/date";

interface CalendarProps {
  selectedDate: Date | null;
  onSelectDate: (date: Date) => void;
  minDate: Date;
  maxDate: Date;
}

const DOW_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const Calendar = ({
  selectedDate,
  onSelectDate,
  minDate,
  maxDate,
}: CalendarProps) => {
  const [viewDate, setViewDate] = useState(() =>
    startOfDay(selectedDate ?? minDate),
  );
  const today = startOfDay(new Date());

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  const firstOfMonth = new Date(year, month, 1);
  const firstDow = (firstOfMonth.getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells: (Date | null)[] = [
    ...Array<null>(firstDow).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => new Date(year, month, i + 1)),
  ];

  const lastDayPrevMonth = new Date(year, month, 0);
  const firstDayNextMonth = new Date(year, month + 1, 1);
  const canGoPrev = !isBeforeDay(lastDayPrevMonth, minDate);
  const canGoNext = !isAfterDay(firstDayNextMonth, maxDate);

  const handleSelect = (date: Date) => {
    if (isBeforeDay(date, minDate) || isAfterDay(date, maxDate)) return;
    onSelectDate(date);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <button
          type="button"
          onClick={() => setViewDate(new Date(year, month - 1, 1))}
          disabled={!canGoPrev}
          className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent"
        >
          <ChevronLeft size={14} />
        </button>
        <p className="text-sm font-bold text-slate-800">
          {formatMonthYear(viewDate)}
        </p>
        <button
          type="button"
          onClick={() => setViewDate(new Date(year, month + 1, 1))}
          disabled={!canGoNext}
          className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent"
        >
          <ChevronRight size={14} />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-1">
        {DOW_LABELS.map((label) => (
          <span
            key={label}
            className="text-center text-[10px] font-bold uppercase text-gray-400"
          >
            {label}
          </span>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {cells.map((date, idx) => {
          if (!date) return <div key={`empty-${idx}`} />;

          const disabled =
            isBeforeDay(date, minDate) || isAfterDay(date, maxDate);
          const isSelected = selectedDate
            ? isSameDate(date, selectedDate)
            : false;
          const isToday = isSameDate(date, today);

          return (
            <button
              key={date.toISOString()}
              type="button"
              disabled={disabled}
              onClick={() => handleSelect(date)}
              className={`aspect-square rounded-lg text-sm font-semibold flex items-center justify-center transition-colors ${
                isSelected
                  ? "bg-indigo-600 text-white"
                  : disabled
                    ? "text-gray-300 cursor-not-allowed"
                    : "text-slate-700 hover:bg-indigo-50"
              } ${isToday && !isSelected ? "ring-1 ring-inset ring-indigo-400" : ""}`}
            >
              {date.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Calendar;
