import { useEffect, useState } from "react";
import api from "../../services/api";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function LaporanMingguan() {
  const [sales, setSales] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWeeklyReport();
  }, []);

  const fetchWeeklyReport = async () => {
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

  const totalWeekly = sales.reduce(
    (sum, item) => sum + Number(item.total),
    0
  );

  const bestDay =
    sales.length > 0
      ? sales.reduce((a, b) =>
          Number(a.total) > Number(b.total) ? a : b
        )
      : null;

  const topPayment =
    payments.length > 0
      ? payments.reduce((a, b) =>
          a.total > b.total ? a : b
        )
      : null;

  if (loading) {
    return <p className="p-6 text-white">Loading laporan mingguan...</p>;
  }

  return (
    <div className="p-6 space-y-8">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-semibold text-amber-300">
          Laporan Mingguan
        </h1>
        <p className="text-white/60 text-sm">
          Rekap performa penjualan 7 hari terakhir
        </p>
      </div>

      {/* SUMMARY */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-black/40 border border-white/10 rounded-xl p-6">
          <p className="text-white/60 text-sm">Total Omzet Mingguan</p>
          <p className="text-2xl font-semibold text-amber-300 mt-2">
            Rp {totalWeekly.toLocaleString("id-ID")}
          </p>
        </div>

        <div className="bg-black/40 border border-white/10 rounded-xl p-6">
          <p className="text-white/60 text-sm">Hari Terlaris</p>
          <p className="text-lg font-medium text-green-300 mt-2">
            {bestDay?.date || "-"}
          </p>
          <p className="text-white/60 text-sm mt-1">
            Rp {Number(bestDay?.total || 0).toLocaleString("id-ID")}
          </p>
        </div>

        <div className="bg-black/40 border border-white/10 rounded-xl p-6">
          <p className="text-white/60 text-sm">Metode Dominan</p>
          <p className="text-lg font-medium text-blue-300 mt-2 capitalize">
            {topPayment?.payment_method || "-"}
          </p>
          <p className="text-white/60 text-sm mt-1">
            {topPayment?.total || 0} transaksi
          </p>
        </div>
      </div>

      {/* BAR CHART */}
      <div className="bg-black/40 border border-white/10 rounded-xl p-6">
        <h2 className="text-white font-medium mb-4">
          Grafik Penjualan Mingguan
        </h2>

        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={sales}>
              <XAxis dataKey="date" stroke="#aaa" />
              <YAxis stroke="#aaa" />
              <Tooltip />
              <Bar
                dataKey="total"
                fill="#fbbf24"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
