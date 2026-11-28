import { Outlet } from "react-router-dom";
import Navbar from "./Navbar.jsx";
import Sidebar from "./Sidebar.jsx";

export default function Layout() {
  return (
    <div className="min-h-screen bg-surface-bg text-ink-primary">
      <Navbar />
      <div className="mx-auto grid min-w-0 max-w-7xl gap-4 px-3 py-4 sm:px-4 sm:py-5 md:grid-cols-[220px_minmax(0,1fr)] md:gap-5 md:px-6 md:py-7">
        <Sidebar />
        <main className="min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
