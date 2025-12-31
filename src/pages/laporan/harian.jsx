import { useEffect, useState } from "react";
import api from "../../services/api";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const COLORS = ["#fbbf24", "#60a5fa", "#34d399", "#f87171"];

export default function LaporanHarian() {
  const [sales, setSales] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDailyReport();
  }, []);

  const fetchDailyReport = async () => {
    try {
      const salesRes = await api.get("/dashboard/daily-sales");
      const paymentRes = await api.get("/dashboard/payment-method");

      setSales(salesRes.data.data);
      setPayments(paymentRes.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const totalOmzet = sales.reduce((sum, item) => sum + Number(item.total), 0);
  const avgOmzet = sales.length
    ? Math.round(totalOmzet / sales.length)
    : 0;

  if (loading) {
    return <p className="p-6 text-white">Loading laporan harian...</p>;
  }

  return (
    <div className="p-6 space-y-8">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-semibold text-amber-300">
          Laporan Harian
        </h1>
        <p className="text-white/60 text-sm">
          Ringkasan penjualan 7 hari terakhir
        </p>
      </div>

      {/* SUMMARY CARD */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-black/40 border border-white/10 rounded-xl p-6">
          <p className="text-white/60 text-sm">Total Omzet (7 Hari)</p>
          <p className="text-2xl font-semibold text-amber-300 mt-2">
            Rp {totalOmzet.toLocaleString("id-ID")}
          </p>
        </div>

        <div className="bg-black/40 border border-white/10 rounded-xl p-6">
          <p className="text-white/60 text-sm">Rata-rata Harian</p>
          <p className="text-2xl font-semibold text-green-300 mt-2">
            Rp {avgOmzet.toLocaleString("id-ID")}
          </p>
        </div>
      </div>

      {/* DAILY SALES CHART */}
      <div className="bg-black/40 border border-white/10 rounded-xl p-6">
        <h2 className="text-white font-medium mb-4">
          Grafik Penjualan Harian
        </h2>

        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={sales}>
              <XAxis dataKey="date" stroke="#aaa" />
              <YAxis stroke="#aaa" />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="total"
                stroke="#fbbf24"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* PAYMENT METHOD */}
      <div className="bg-black/40 border border-white/10 rounded-xl p-6">
        <h2 className="text-white font-medium mb-4">
          Metode Pembayaran
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          {/* PIE */}
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={payments}
                  dataKey="total"
                  nameKey="payment_method"
                  innerRadius={50}
                  outerRadius={80}
                >
                  {payments.map((_, index) => (
                    <Cell
                      key={index}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* LIST */}
          <div className="space-y-3">
            {payments.map((p, i) => (
              <div
                key={i}
                className="flex justify-between items-center bg-white/5 px-4 py-3 rounded-lg"
              >
                <span className="capitalize text-white/80">
                  {p.payment_method}
                </span>
                <span className="text-amber-300 font-medium">
                  {p.total} transaksi
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
