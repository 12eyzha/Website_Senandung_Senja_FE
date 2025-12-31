import {
  HiOutlineLogout,
  HiMenuAlt2,
  HiOutlineMenuAlt1,
} from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function Navbar({ onToggle, collapsed }) {
  const { role, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();               // bersihin token + user
    navigate("/login");     // ⬅️ PENTING: redirect eksplisit
  };

  return (
    <header className="h-16 bg-black/40 border-b border-white/10 flex items-center justify-between px-6">
      
      {/* LEFT */}
      <div className="flex items-center gap-4">
        <button
          onClick={onToggle}
          className="text-white/70 hover:text-white"
        >
          {collapsed ? (
            <HiOutlineMenuAlt1 size={22} />
          ) : (
            <HiMenuAlt2 size={22} />
          )}
        </button>

        <h1 className="font-semibold text-amber-100">
          Dashboard
        </h1>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-4">
        <span className="text-sm text-amber-200 hidden sm:block">
          Role: {role || "-"}
        </span>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-3 py-1.5 rounded-md text-sm"
        >
          <HiOutlineLogout />
          Logout
        </button>
      </div>
    </header>
  );
}
