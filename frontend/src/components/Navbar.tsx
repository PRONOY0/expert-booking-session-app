import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="h-16 border-b border-gray-200 flex items-center justify-between px-8 bg-white shrink-0">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
          <div className="w-4 h-4 border-2 border-white"></div>
        </div>
        <Link to="/" className="font-bold text-xl tracking-tight uppercase text-slate-800">
          ExpertBook
        </Link>
      </div>
      <div className="flex items-center gap-8">
        <Link
          to="/my-bookings"
          className="text-sm font-medium text-slate-600 hover:text-blue-600"
        >
          My Bookings
        </Link>
      </div>
    </nav>
  );
}
