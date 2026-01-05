import { useEffect, useState } from "react";
import api from "../services/api";
import { useAuth } from "../contexts/AuthContext";

export default function Dashboard() {
  const { user } = useAuth();
  const role = user?.role; // ✅ role BENAR (dari backend)

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [summary, setSummary] = useState({
    total_transactions: 0,
    total_revenue: 0,
    total_items_sold: 0,
  });

  const [availableMenus, setAvailableMenus] = useState(0);
  const [recent, setRecent] = useState([]);
  const [topItems, setTopItems] = useState([]);

  const unwrap = (res) => res?.data?.data ?? res?.data ?? [];

  useEffect(() => {
    if (!user || !role) return;

    const loadDashboard = async () => {
      setLoading(true);
      setError("");

      try {
        const [summaryRes, menuRes, historyRes] = await Promise.all([
          api.get("/transactions/summary"),
          api.get("/menus"), // ⬅️ PAGINATED ENDPOINT
          api.get("/transactions/history"),
        ]);

        /* ===== SUMMARY ===== */
        if (summaryRes?.data?.data) {
          setSummary(summaryRes.data.data);
        }

        /* ===== MENU TERSEDIA (FIX DI SINI) ===== */
        const totalMenus =
          menuRes?.data?.meta?.total ?? 0; // ✅ AMBIL DARI META, BUKAN data.length
        setAvailableMenus(totalMenus);

        /* ===== TRANSAKSI TERBARU ===== */
        const history = unwrap(historyRes);
        setRecent(Array.isArray(history) ? history.slice(0, 6) : []);

        /* ===== MENU POPULER (ADMIN / OWNER) ===== */
        if (role === "admin" || role === "owner") {
          const topRes = await api.get("/dashboard/top-items");
          const items = unwrap(topRes);
          setTopItems(Array.isArray(items) ? items.slice(0, 6) : []);
        } else {
          setTopItems([]);
        }
      } catch (err) {
        setError(
          err?.response?.status === 401
            ? "Akses dashboard dibatasi untuk role ini."
            : "Gagal memuat dashboard."
        );
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, [user, role]); // ✅ role wajib

  if (!user) {
    return (
      <p className="text-sm text-amber-200/70">
        Memuat dashboard...
      </p>
    );
  }

  return (
    <>
      {error && (
        <div className="mb-6 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3">
          {error}
        </div>
      )}

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Stat
          title="Pendapatan Hari Ini"
          value={`Rp ${Number(summary.total_revenue).toLocaleString("id-ID")}`}
        />
        <Stat title="Total Transaksi" value={summary.total_transactions} />
        <Stat title="Menu Tersedia" value={availableMenus} />
        <Stat title="Role Login" value={role} />
      </div>

      {/* CONTENT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* MENU POPULER */}
        <div className="lg:col-span-2 bg-white/5 rounded-xl p-4 border border-white/10">
          <h2 className="text-lg font-semibold mb-4">Menu Populer</h2>

          {loading ? (
            <p className="text-sm text-amber-200/70">Memuat...</p>
          ) : topItems.length > 0 ? (
            topItems.map((item, i) => (
              <ItemCard key={i} item={item} />
            ))
          ) : (
            <p className="text-sm text-amber-200/70">
              Tidak ada data menu populer
            </p>
          )}
        </div>

        {/* TRANSAKSI TERBARU */}
        <div className="bg-white/5 rounded-xl p-4 border border-white/10">
          <h2 className="font-semibold mb-4">Transaksi Terbaru</h2>

          {loading ? (
            <p className="text-sm text-amber-200/70">Memuat...</p>
          ) : recent.length > 0 ? (
            recent.map((t) => (
              <div key={t.id} className="mb-3 p-3 bg-white/5 rounded-lg">
                <div className="font-medium">{t.transaction_code}</div>
                <div className="text-xs text-amber-200/70">
                  Rp {Number(t.total_amount).toLocaleString("id-ID")}
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-amber-200/70">
              Belum ada transaksi
            </p>
          )}
        </div>
      </div>
    </>
  );
}

/* ================= COMPONENTS ================= */

function Stat({ title, value }) {
  return (
    <div className="bg-white/5 rounded-lg p-5 border border-white/10">
      <p className="text-xs text-amber-200/70">{title}</p>
      <p className="text-2xl font-semibold text-amber-50 mt-1">{value}</p>
    </div>
  );
}

function ItemCard({ item }) {
  return (
    <div className="mb-3 p-4 bg-white/5 rounded-lg border border-white/10">
      <h3 className="font-semibold">{item?.name ?? "Menu"}</h3>
      <p className="text-sm text-amber-200/70">
        {item?.description ?? ""}
      </p>
      <p className="text-sm font-bold text-amber-300 mt-2">
        Rp {Number(item?.price ?? 0).toLocaleString("id-ID")}
      </p>
    </div>
  );
}
