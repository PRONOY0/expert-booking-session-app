interface Slot {
  _id: string;
  date: string;
  startTime: string;
  endTime: string;
  isBooked: boolean;
}

interface SlotButtonProps {
  slot: Slot;
  onClick: () => void;
}

export default function SlotButton({ slot, onClick }: SlotButtonProps) {
  const timeLabel = slot.startTime || "Available Slot";

  if (slot.isBooked) {
    return (
      <button
        disabled
        className="py-2 text-xs font-bold border border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed rounded w-full"
      >
        Booked
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      className="py-2 text-xs font-bold border border-blue-600 text-blue-600 hover:bg-blue-50 transition-colors rounded w-full"
    >
      {timeLabel}
    </button>
  );
}