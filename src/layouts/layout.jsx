import { useState } from "react";
import { Outlet, Navigate } from "react-router-dom";
import Sidebar from "./sidebar";
import Navbar from "./navbar";
import { useAuth } from "../contexts/AuthContext";

export default function Layout() {
  const [collapsed, setCollapsed] = useState(false);
  const { token, loading } = useAuth();

  // ⏳ tunggu auth selesai
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-amber-200">
        Memuat aplikasi...
      </div>
    );
  }

  // 🔒 kalau tidak ada token → login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-amber-900 via-stone-900 to-black text-white">
      <Sidebar collapsed={collapsed} />

      <div className="flex-1 flex flex-col">
        <Navbar
          collapsed={collapsed}
          onToggle={() => setCollapsed(!collapsed)}
        />

        <main className="p-6 transition-all duration-300">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
