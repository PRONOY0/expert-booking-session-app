/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import api from "../api/axios";
import ExpertCard from "../components/ExpertCard";
import toast from "react-hot-toast";

const CATEGORIES = ["All", "Finance", "Health", "Tech", "Legal"];

interface Expert {
    _id: string;
    name: string;
    category: string;
    experience: number;
    rating: number;
}

interface Pagination {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export default function ExpertList() {
    const [experts, setExperts] = useState<Expert[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState<number>(1);
    const [search, setSearch] = useState<string>("");
    const [submittedSearch, setSubmittedSearch] = useState<string>("");
    const [category, setCategory] = useState<string>("All");
    const [pagination, setPagination] = useState<Pagination | null>(null);

    useEffect(() => {
        const fetchExperts = async () => {
            try {
                setLoading(true);
                setError(null);

                const params: Record<string, string | number> = {
                    page,
                    limit: 10,
                };

                if (category !== "All") params.category = category;
                if (submittedSearch) params.name = submittedSearch;

                const response = await api.get("/experts", { params });

                if (response.data && response.data.experts) {
                    setExperts(response.data.experts);
                    setPagination(response.data.pagination || null);
                } else {
                    setExperts([]);
                }
            } catch (err: any) {
                const msg = err.response?.data?.message || err.message || "Failed to load experts";
                setError(msg);
                toast.error(msg);
            } finally {
                setLoading(false);
            }
        };

        fetchExperts();
    }, [page, category, submittedSearch]);

    const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setPage(1);
        setSubmittedSearch(search);
    };

    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col flex-1 h-full">
            <div className="mb-6 space-y-4 sm:flex sm:space-y-0 sm:space-x-4 sm:items-center sm:justify-between">
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Find an Expert</h1>

                <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
                    <form onSubmit={handleSearchSubmit} className="flex flex-col">
                        <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">Search</label>
                        <div className="flex">
                            <input
                                type="text"
                                placeholder="Search by name..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full text-sm border border-gray-300 px-3 py-2 focus:border-blue-500 outline-none rounded-sm bg-white"
                            />
                            <button
                                type="submit"
                                className="ml-2 px-3 py-2 bg-blue-600 text-white rounded-sm text-sm font-bold hover:bg-blue-700 flex-shrink-0"
                            >
                                Go
                            </button>
                        </div>
                    </form>

                    <div className="flex flex-col">
                        <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">Category</label>
                        <select
                            value={category}
                            onChange={(e) => {
                                setCategory(e.target.value);
                                setPage(1);
                            }}
                            className="w-full text-sm border border-gray-300 px-3 py-2 outline-none rounded-sm bg-white"
                        >
                            {CATEGORIES.map((cat) => (
                                <option key={cat} value={cat}>
                                    {cat === "All" ? "All Categories" : cat}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {loading && <p className="text-gray-500 py-8">Loading...</p>}

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 p-4 mb-6">
                    {error}
                </div>
            )}

            {!loading && !error && experts.length === 0 && (
                <p className="text-gray-500">No experts found matching your criteria.</p>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {experts.map((expert) => (
                    <ExpertCard key={expert._id} expert={expert} />
                ))}
            </div>

            <div className="mt-auto pt-6 flex items-center justify-between border-t border-gray-200">
                <span className="text-[11px] text-slate-500 font-bold uppercase tracking-widest">
                    Page {page} {pagination ? `of ${pagination.totalPages}` : ""}
                </span>
                <div className="flex gap-1">
                    <button
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="px-3 py-1.5 text-xs font-bold border border-gray-200 rounded text-slate-700 bg-white hover:bg-slate-50 disabled:bg-gray-50 disabled:text-gray-400"
                    >
                        Prev
                    </button>
                    <button
                        onClick={() => setPage((p) => p + 1)}
                        disabled={pagination ? page >= pagination.totalPages : experts.length < 10}
                        className="px-3 py-1.5 text-xs font-bold border border-gray-200 rounded hover:bg-slate-50 text-slate-700 bg-white disabled:bg-gray-50 disabled:text-gray-400"
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
}