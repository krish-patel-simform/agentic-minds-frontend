import { ArrowLeft, CalendarDays, Clock3 } from "lucide-react";
import { useMemo, useState } from "react";
import Calendar from "../Component/Calendar/Calendar";
import TimeSlotGrid from "../Component/TimeSlotGrid/TimeSlotGrid";

import {
  addDays,
  formatDateLabel,
  isAfterDay,
  isBeforeDay,
  startOfDay,
} from "../utils/date";
import { generateTimeSlots } from "../utils/timeSlots";
import { SchedulingConst } from "../const";

const MAX_BOOKING_WINDOW_DAYS = 30;
const { BOOKED_SLOTS } = SchedulingConst;

const ScheduleInterviewPage = () => {
  const today = useMemo(() => startOfDay(new Date()), []);
  const maxDate = useMemo(
    () => addDays(today, MAX_BOOKING_WINDOW_DAYS),
    [today],
  );
  const slots = useMemo(() => generateTimeSlots(9, 17, 30), []);

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  const canConfirm = Boolean(selectedDate && selectedSlot);

  const handleSelectDate = (date: Date) => {
    if (isBeforeDay(date, today) || isAfterDay(date, maxDate)) return;
    setSelectedDate(date);
    setSelectedSlot(null);
  };

  const handleCancel = () => {
    setSelectedDate(null);
    setSelectedSlot(null);
  };

  const handleConfirm = () => {
    if (!selectedDate || !selectedSlot) return;
    if (isBeforeDay(selectedDate, today) || isAfterDay(selectedDate, maxDate))
      return;
    if (BOOKED_SLOTS.includes(selectedSlot)) return;

    console.log("Interview scheduled", {
      date: formatDateLabel(selectedDate),
      slot: selectedSlot,
    });
  };

  return (
    <div className="min-h-screen bg-[#F4F3FB] flex items-start justify-center py-12 px-4">
      <div className="w-full max-w-3xl">
        <div className="flex items-center gap-3 mb-1">
          <button
            type="button"
            className="text-slate-500 hover:text-slate-700"
            aria-label="Back"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-xl font-bold text-slate-800">
            Schedule Interview
          </h1>
        </div>
        <p className="text-sm text-gray-500 mb-6 ml-8">
          Senior React Engineer &middot; Round 2 - Technical Interview
        </p>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <CalendarDays size={18} />
            </div>
            <h2 className="text-base font-bold text-slate-800">
              Select Date & Time
            </h2>
          </div>

          <div className="bg-indigo-50 text-indigo-700 text-xs font-medium rounded-lg px-3 py-2 mb-6 flex items-center gap-2">
            <Clock3 size={14} />
            Interviews can be booked up to {MAX_BOOKING_WINDOW_DAYS} days in
            advance, between 9:00 AM - 5:00 PM.
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <p className="text-xs font-bold uppercase text-gray-400 mb-3">
                Select Date
              </p>
              <Calendar
                selectedDate={selectedDate}
                onSelectDate={handleSelectDate}
                minDate={today}
                maxDate={maxDate}
              />
            </div>
            <div>
              <p className="text-xs font-bold uppercase text-gray-400 mb-3">
                Select Time
                {selectedDate ? ` - ${formatDateLabel(selectedDate)}` : ""}
              </p>
              {selectedDate ? (
                <TimeSlotGrid
                  slots={slots}
                  selectedSlot={selectedSlot}
                  bookedSlots={BOOKED_SLOTS}
                  onSelectSlot={setSelectedSlot}
                />
              ) : (
                <p className="text-sm text-gray-400">
                  Pick a date to see available times.
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-100">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-semibold text-slate-600 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              disabled={!canConfirm}
              className="px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-semibold flex items-center gap-2 hover:bg-indigo-700 disabled:bg-gray-200 disabled:text-gray-400 disabled:hover:bg-gray-200"
            >
              <CalendarDays size={16} />
              Confirm Schedule
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScheduleInterviewPage;
