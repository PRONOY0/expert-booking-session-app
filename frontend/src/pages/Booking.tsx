/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { socket } from "../socket/socket";
import toast from "react-hot-toast";

interface FormData {
  name: string;
  email: string;
  phone: string;
  notes: string;
}

export default function Booking() {
  const { expertId, slotId } = useParams<{ expertId: string; slotId: string }>();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    notes: "",
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [slotFilled, setSlotFilled] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  useEffect(() => {
    socket.on("slot-booked", ({ slotId: bookedSlotId }: { slotId: string }) => {
      if (bookedSlotId === slotId) {
        setSlotFilled(true);
      }
    });

    return () => { socket.off("slot-booked"); };
  }, [slotId]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await api.post("/bookings", {
        expertId,
        slotId,
        ...formData,
      });
      toast.success("Booking confirmed!");
      setTimeout(() => navigate("/my-bookings"), 2000);
      setTimeout(() => {
        navigate("/my-bookings");
      }, 2000);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="absolute bottom-8 right-8 bg-slate-900 text-white px-6 py-4 rounded-sm border-l-4 border-green-500 flex items-center gap-4 shadow-xl z-50">
        <div className="w-5 h-5 rounded-full border-2 border-green-500 flex items-center justify-center">
          <div className="w-1 h-2 border-b-2 border-r-2 border-green-500 rotate-45 mb-1"></div>
        </div>
        <div>
          <div className="text-sm font-bold">Booking confirmed!</div>
          <div className="text-xs text-slate-400">Redirecting to your bookings...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto w-full px-4 sm:px-6 py-12">
      <div className="bg-slate-50 p-6 sm:p-8 border border-gray-200 rounded-sm">
        <h3 className="text-xs font-bold uppercase text-slate-500 mb-6 tracking-widest text-center">
          Complete Booking Details
        </h3>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 p-3 mb-6 text-sm font-medium rounded-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-[11px] font-bold uppercase text-slate-500 mb-1">
              Full Name *
            </label>
            <input
              type="text"
              name="name"
              id="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 text-sm outline-none focus:border-blue-500 rounded-sm bg-white"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-[11px] font-bold uppercase text-slate-500 mb-1">
              Email Address *
            </label>
            <input
              type="email"
              name="email"
              id="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 text-sm outline-none focus:border-blue-500 rounded-sm bg-white"
            />
          </div>

          <div>
            <label htmlFor="phone" className="block text-[11px] font-bold uppercase text-slate-500 mb-1">
              Phone Number *
            </label>
            <input
              type="tel"
              name="phone"
              id="phone"
              required
              value={formData.phone}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 text-sm outline-none focus:border-blue-500 rounded-sm bg-white"
            />
          </div>

          <div>
            <label htmlFor="notes" className="block text-[11px] font-bold uppercase text-slate-500 mb-1">
              Meeting Notes
            </label>
            <textarea
              name="notes"
              id="notes"
              placeholder="Briefly describe your goals..."
              value={formData.notes}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 text-sm outline-none focus:border-blue-500 h-24 resize-none rounded-sm bg-white"
            />
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={loading || slotFilled}
              className="w-full bg-blue-600 text-white font-bold py-3 text-sm hover:bg-blue-700 transition-colors rounded-sm disabled:bg-blue-300"
            >
              {slotFilled ? "Slot Filled" : loading ? "Confirming..." : "Confirm Session Booking"}
            </button>
          </div>
          <p className="text-[10px] text-slate-400 text-center uppercase tracking-tighter mt-4">
            By booking, you agree to our terms and conditions.
          </p>
        </form>
      </div>
    </div>
  );
}