/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { socket } from "../socket/socket";
import SlotButton from "../components/SlotButton";
import toast from "react-hot-toast";

interface Expert {
    _id: string;
    name: string;
    category: string;
    experience: number;
    rating: number;
}

interface Slot {
    _id: string;
    date: string;
    startTime: string;
    endTime: string;
    isBooked: boolean;
}

interface SlotBookedPayload {
    slotId: string;
    expertId: string;
}

export default function ExpertDetail() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [expert, setExpert] = useState<Expert | null>(null);
    const [slots, setSlots] = useState<Record<string, Slot[]>>({});
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const handleSlotBooked = ({ slotId }: SlotBookedPayload) => {
        setSlots(prevSlots => {
            const updated = { ...prevSlots };
            for (const date in updated) {
                updated[date] = updated[date].map(slot =>
                    slot._id === slotId ? { ...slot, isBooked: true } : slot
                );
            }
            return updated;
        });
    };

    useEffect(() => {
        const fetchExpert = async () => {
            try {
                setLoading(true);
                const { data } = await api.get(`/experts/${id}`);
                setExpert(data.expert);
                setSlots(data.slots || {});
            } catch (err: any) {
                const msg = err.response?.data?.message || err.message || "Failed to load expert";
                setError(msg);
                toast.error(msg);
            } finally {
                setLoading(false);
            }
        };

        fetchExpert();
        socket.on("slot-booked", handleSlotBooked);
        return () => { socket.off("slot-booked", handleSlotBooked); };
    }, [id]);

    if (loading) return <div className="max-w-3xl mx-auto px-4 py-8 text-gray-500">Loading...</div>;
    if (error) return <div className="max-w-3xl mx-auto px-4 py-8 text-red-600">{error}</div>;
    if (!expert) return <div className="max-w-3xl mx-auto px-4 py-8 text-gray-500">Expert not found</div>;

    const hasAvailableSlot = Object.values(slots).flat().some(s => !s.isBooked);

    return (
        <div className="flex-1 bg-white flex flex-col max-w-5xl mx-auto w-full mt-8 border border-gray-200 rounded-sm">
            <div className="p-6 md:p-8 border-b border-gray-100">
                <div className="flex items-start justify-between">
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">{expert.name}</h1>
                            {hasAvailableSlot && (
                                <span className="text-[10px] border border-blue-600 text-blue-600 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">
                                    Available Now
                                </span>
                            )}
                        </div>
                        <p className="text-sm font-medium text-slate-500 mt-1 uppercase tracking-widest">{expert.category}</p>
                    </div>
                    <div className="text-right flex-shrink-0 ml-4 hidden sm:block">
                        <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Experience</div>
                        <div className="text-2xl font-bold text-slate-800">{expert.experience} Years</div>
                        <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-2">Rating</div>
                        <div className="text-xl font-bold text-slate-800">{expert.rating}/5</div>
                    </div>
                </div>
            </div>

            <div className="p-6 md:p-8 flex-1">
                <h3 className="text-xs font-bold uppercase text-slate-500 mb-4 tracking-widest">Available Time Slots</h3>

                {Object.keys(slots).length === 0 ? (
                    <p className="text-sm text-slate-500 bg-slate-50 p-4 border border-gray-200 rounded-sm">
                        No slots available at the moment.
                    </p>
                ) : (
                    <div className="space-y-6">
                        {Object.entries(slots).map(([date, dateSlots]) => (
                            <div key={date}>
                                <div className="text-sm font-bold text-slate-700 mb-3">
                                    {new Date(date).toLocaleDateString(undefined, {
                                        weekday: "short", month: "short", day: "numeric"
                                    })}
                                </div>
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                                    {dateSlots.map(slot => (
                                        <SlotButton
                                            key={slot._id}
                                            slot={slot}
                                            onClick={() => navigate(`/booking/${id}/${slot._id}`)}
                                        />
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}