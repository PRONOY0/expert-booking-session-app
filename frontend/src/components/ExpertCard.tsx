import { Link } from "react-router-dom";

interface Expert {
    _id?: string;
    id?: string;
    name: string;
    category: string;
    experience: number;
    rating: number;
}

interface ExpertCardProps {
    expert: Expert;
}

export default function ExpertCard({ expert }: ExpertCardProps) {
    return (
        <div className="p-4 bg-white border border-gray-200 rounded-sm hover:border-blue-300 cursor-pointer flex flex-col justify-between">
            <div>
                <div className="text-sm font-bold text-slate-800">{expert.name}</div>
                <div className="text-xs text-slate-500">{expert.category}</div>
                <div className="mt-3 flex items-center justify-between">
                    <span className="text-[10px] font-bold bg-gray-100 text-slate-600 px-1.5 py-0.5 rounded uppercase">{expert.category}</span>
                    <span className="text-[10px] font-medium text-slate-400">{expert.rating}/5 Rating • {expert.experience} yrs exp</span>
                </div>
            </div>
            <div className="mt-4">
                <Link
                    to={`/experts/${expert.id || expert._id}`}
                    className="w-full inline-flex justify-center items-center py-2 border border-blue-600 text-xs font-bold text-blue-600 bg-white hover:bg-blue-50 transition-colors rounded"
                >
                    View Profile
                </Link>
            </div>
        </div>
    );
}
