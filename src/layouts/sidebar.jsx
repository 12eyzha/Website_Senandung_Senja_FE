import { NavLink } from "react-router-dom";
import {
  HiHome,
  HiReceiptRefund,
  HiClock,
  HiChevronDown,
  HiDatabase,
} from "react-icons/hi";
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";

export default function Sidebar({ collapsed }) {
  const { role } = useAuth();
  const [openLaporan, setOpenLaporan] = useState(true);
  const [openMaster, setOpenMaster] = useState(false);

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-3 py-2 rounded-lg transition
     ${
       isActive
         ? "bg-white/10 text-amber-300"
         : "text-white/80 hover:bg-white/10"
     }`;

  const subLinkClass = ({ isActive }) =>
    `block px-4 py-2 rounded-md transition text-sm
     ${
       isActive
         ? "bg-white/10 text-amber-300"
         : "text-white/70 hover:bg-white/5 hover:text-white"
     }`;

  return (
    <aside
      className={`min-h-screen bg-black/60 border-r border-white/10
      transition-all duration-300
      ${collapsed ? "w-20" : "w-64"} p-3`}
    >
      {/* LOGO */}
      <div className="text-xl font-bold text-amber-200 mb-6 flex items-center gap-2 justify-center">
        ☕ {!collapsed && <span>Senandung Senja</span>}
      </div>

      <nav className="space-y-2 text-sm">
        {/* DASHBOARD */}
        <NavLink to="." end className={linkClass}>
          <HiHome size={20} />
          {!collapsed && "Dashboard"}
        </NavLink>

        {/* TRANSAKSI */}
        <NavLink to="transaksi" className={linkClass}>
          <HiReceiptRefund size={20} />
          {!collapsed && "Transaksi"}
        </NavLink>

        {/* RIWAYAT */}
        <NavLink to="riwayat" className={linkClass}>
          <HiClock size={20} />
          {!collapsed && "Riwayat"}
        </NavLink>

        {/* LAPORAN */}
        {!collapsed && (
          <div>
            <button
              onClick={() => setOpenLaporan(!openLaporan)}
              className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-white/10 text-white/80"
            >
              <span className="flex items-center gap-3">
                <HiReceiptRefund size={20} /> Laporan
              </span>
              <HiChevronDown
                className={`transition ${openLaporan ? "rotate-180" : ""}`}
              />
            </button>

            {openLaporan && (
              <div className="ml-8 mt-2 space-y-1">
                <NavLink to="laporan/harian" className={subLinkClass}>
                  Laporan Harian
                </NavLink>
                <NavLink to="laporan/mingguan" className={subLinkClass}>
                  Laporan Mingguan
                </NavLink>
                <NavLink to="laporan/bulanan" className={subLinkClass}>
                  Laporan Bulanan
                </NavLink>
              </div>
            )}
          </div>
        )}

        {/* DATA MASTER — ADMIN ONLY */}
        {role === "admin" && !collapsed && (
          <div>
            <button
              onClick={() => setOpenMaster(!openMaster)}
              className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-white/10 text-white/80"
            >
              <span className="flex items-center gap-3">
                <HiDatabase size={20} /> Data Master
              </span>
              <HiChevronDown
                className={`transition ${openMaster ? "rotate-180" : ""}`}
              />
            </button>

            {openMaster && (
              <div className="ml-8 mt-2 space-y-1">
                <NavLink to="master/karyawan" className={subLinkClass}>
                  Data Karyawan
                </NavLink>
                <NavLink to="master/pelanggan" className={subLinkClass}>
                  Data Pelanggan
                </NavLink>
                <NavLink to="master/menu" className={subLinkClass}>
                  Data Menu
                </NavLink>
              </div>
            )}
          </div>
        )}
      </nav>
    </aside>
  );
}
