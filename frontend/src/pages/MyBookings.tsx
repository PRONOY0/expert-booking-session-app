/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import api from "../api/axios";

type BookingStatus = "PENDING" | "CONFIRMED" | "COMPLETED";

interface PopulatedSlot {
  _id: string;
  date: string;
  startTime: string;
  endTime: string;
  isBooked: boolean;
}

interface PopulatedExpert {
  _id: string;
  name: string;
  category: string;
}

interface Booking {
  _id: string;
  name: string;
  email: string;
  phone: string;
  notes?: string;
  status: BookingStatus;
  expertId: PopulatedExpert;  
  slotId: PopulatedSlot;      
  createdAt: string;
}

const getStatusClasses = (status: BookingStatus): string => {
  switch (status) {
    case "PENDING":
      return "bg-yellow-100 text-yellow-800 border border-yellow-200";
    case "CONFIRMED":
      return "bg-green-100 text-green-800 border border-green-200";
    case "COMPLETED":
      return "bg-gray-100 text-gray-800 border border-gray-200";
    default:
      return "bg-gray-100 text-gray-800 border border-gray-200";
  }
};

export default function MyBookings() {
  const [email, setEmail] = useState<string>("");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [hasSearched, setHasSearched] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    setError(null);
    setHasSearched(true);

    try {
      const response = await api.get("/bookings", { params: { email } });

      
      if (response.data && response.data.bookings) {
        setBookings(response.data.bookings);
      } else {
        setBookings([]);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Failed to fetch bookings");
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 w-full">
      <h1 className="text-2xl font-bold text-slate-900 mb-8 tracking-tight">My Bookings</h1>

      <div className="bg-slate-50 border border-gray-200 p-6 sm:p-8 mb-8 rounded-sm">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
          <div className="flex-grow flex flex-col">
            <label htmlFor="email" className="block text-[11px] font-bold uppercase text-slate-500 mb-1">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email address to find bookings"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 p-2 text-sm outline-none focus:border-blue-500 rounded-sm bg-white"
            />
          </div>
          <div className="flex flex-col justify-end">
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto bg-blue-600 text-white font-bold px-6 py-2 h-[38px] text-sm hover:bg-blue-700 transition-colors rounded-sm disabled:bg-blue-300"
            >
              {loading ? "Searching..." : "Search Bookings"}
            </button>
          </div>
        </form>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 p-4 mb-6 text-sm rounded-sm">
          {error}
        </div>
      )}

      {hasSearched && !loading && !error && bookings.length === 0 && (
        <div className="text-center py-16 border border-gray-200 bg-white rounded-sm">
          <p className="text-sm font-medium text-slate-500">No bookings found for {email}</p>
        </div>
      )}

      {bookings.length > 0 && (
        <div className="bg-white border text-sm border-gray-200 rounded-sm">
          <ul className="divide-y divide-gray-200">
            {bookings.map((booking) => {
              
              const slot = booking.slotId;
              const expert = booking.expertId;

              const displayDate = slot?.date
                ? new Date(slot.date).toLocaleDateString(undefined, {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                  })
                : "Date TBA";

              const displayTime = slot?.startTime || "Time TBA";

              return (
                <li key={booking._id} className="p-4 hover:bg-slate-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-bold text-slate-800">
                        {expert?.name || "Expert"}
                      </div>
                      <div className="text-xs text-slate-400 mt-0.5">
                        {expert?.category || ""}
                      </div>
                      <div className="text-xs font-medium text-slate-500 mt-1">
                        {displayDate} • {displayTime}
                      </div>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider ${getStatusClasses(booking.status)}`}>
                      {booking.status}
                    </span>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}