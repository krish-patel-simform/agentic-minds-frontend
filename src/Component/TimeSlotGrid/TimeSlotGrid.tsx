interface TimeSlotGridProps {
  slots: string[];
  selectedSlot: string | null;
  bookedSlots?: string[];
  onSelectSlot: (slot: string) => void;
}

const TimeSlotGrid = ({
  slots,
  selectedSlot,
  bookedSlots = [],
  onSelectSlot,
}: TimeSlotGridProps) => {
  return (
    <div className="grid grid-cols-3 gap-2">
      {slots.map((slot) => {
        const isBooked = bookedSlots.includes(slot);
        const isSelected = selectedSlot === slot;

        return (
          <button
            key={slot}
            type="button"
            disabled={isBooked}
            onClick={() => !isBooked && onSelectSlot(slot)}
            className={`py-2.5 rounded-lg text-sm font-semibold border transition-colors ${
              isSelected
                ? "bg-indigo-600 border-indigo-600 text-white"
                : isBooked
                  ? "bg-gray-50 border-gray-100 text-gray-300 cursor-not-allowed"
                  : "border-gray-200 text-slate-700 hover:border-indigo-400 hover:bg-indigo-50"
            }`}
          >
            {slot}
          </button>
        );
      })}
    </div>
  );
};

export default TimeSlotGrid;
