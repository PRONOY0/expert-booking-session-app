import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import ExpertList from "./pages/ExpertList";
import ExpertDetail from "./pages/ExpertDetails";
import Booking from "./pages/Booking";
import MyBookings from "./pages/MyBookings";
import { Toaster } from "react-hot-toast";

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex flex-col">
        <Navbar />
        <Toaster position="top-right" />
        <main className="flex-1 flex flex-col overflow-auto">
          <Routes>
            <Route path="/" element={<ExpertList />} />
            <Route path="/experts/:id" element={<ExpertDetail />} />
            <Route path="/booking/:expertId/:slotId" element={<Booking />} />
            <Route path="/my-bookings" element={<MyBookings />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}
