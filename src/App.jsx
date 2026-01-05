import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/login";
import Dashboard from "./pages/dashboard";
import Transactions from "./pages/transaction";
import Payment from "./pages/payment";
import History from "./pages/history";
import Layout from "./layouts/layout";
import { useAuth } from "./contexts/AuthContext";

/* === LAPORAN PAGES === */
import LaporanHarian from "./pages/laporan/harian";
import LaporanMingguan from "./pages/laporan/mingguan";
import LaporanBulanan from "./pages/laporan/bulanan";

/* === DATA MASTER === */
import MasterMenu from "./pages/master/menu";
import MasterKaryawan from "./pages/master/karyawan"; // ⬅️ TAMBAHAN

function App() {
  return (
    <Routes>
      {/* ROOT */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      {/* LOGIN */}
      <Route path="/login" element={<LoginWrapper />} />

      {/* PROTECTED ROUTES + LAYOUT */}
      <Route
        path="/dashboard"
        element={
          <RequireAuth>
            <Layout />
          </RequireAuth>
        }
      >
        {/* DASHBOARD */}
        <Route index element={<Dashboard />} />

        {/* TRANSAKSI */}
        <Route path="transaksi" element={<Transactions />} />
        <Route
          path="transactions"
          element={<Navigate to="transaksi" replace />}
        />

        {/* PAYMENT */}
        <Route path="payment/:id" element={<Payment />} />

        {/* RIWAYAT */}
        <Route path="riwayat" element={<History />} />
        <Route
          path="history"
          element={<Navigate to="riwayat" replace />}
        />

        {/* ================= LAPORAN ================= */}
        <Route path="laporan/harian" element={<LaporanHarian />} />
        <Route path="laporan/mingguan" element={<LaporanMingguan />} />
        <Route path="laporan/bulanan" element={<LaporanBulanan />} />

        {/* ================= DATA MASTER ================= */}
        <Route path="master/menu" element={<MasterMenu />} />
        <Route path="master/karyawan" element={<MasterKaryawan />} /> {/* ⬅️ TAMBAHAN */}
      </Route>

      {/* FALLBACK */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

/* ================= HELPERS ================= */

function LoginWrapper() {
  const { token } = useAuth();
  return token ? <Navigate to="/dashboard" replace /> : <Login />;
}

function RequireAuth({ children }) {
  const { token } = useAuth();
  return token ? children : <Navigate to="/login" replace />;
}

export default App;
