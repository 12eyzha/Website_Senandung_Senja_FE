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

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "Mei", "Jun",
  "Jul", "Agu", "Sep", "Okt", "Nov", "Des",
];

export default function LaporanBulanan() {
  const [sales, setSales] = useState([]);
  const [payments, setPayments] = useState([]);
  const [topItems, setTopItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMonthlyReport();
  }, []);

  const fetchMonthlyReport = async () => {
    try {
      const salesRes = await api.get("/dashboard/monthly-sales");
      const paymentRes = await api.get("/dashboard/payment-method");
      const itemsRes = await api.get("/dashboard/top-items");

      setSales(salesRes.data.data);
      setPayments(paymentRes.data.data);
      setTopItems(itemsRes.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const totalYearly = sales.reduce(
    (sum, item) => sum + Number(item.total),
    0
  );

  const bestPayment =
    payments.length > 0
      ? payments.reduce((a, b) =>
          a.total > b.total ? a : b
        )
      : null;

  if (loading) {
    return <p className="p-6 text-white">Loading laporan bulanan...</p>;
  }

  return (
    <div className="p-6 space-y-8">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-semibold text-amber-300">
          Laporan Bulanan
        </h1>
        <p className="text-white/60 text-sm">
          Rekap penjualan per bulan tahun berjalan
        </p>
      </div>

      {/* SUMMARY */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-black/40 border border-white/10 rounded-xl p-6">
          <p className="text-white/60 text-sm">Total Omzet</p>
          <p className="text-2xl font-semibold text-amber-300 mt-2">
            Rp {totalYearly.toLocaleString("id-ID")}
          </p>
        </div>

        <div className="bg-black/40 border border-white/10 rounded-xl p-6">
          <p className="text-white/60 text-sm">Metode Terfavorit</p>
          <p className="text-lg font-medium text-blue-300 mt-2 capitalize">
            {bestPayment?.payment_method || "-"}
          </p>
          <p className="text-white/60 text-sm mt-1">
            {bestPayment?.total || 0} transaksi
          </p>
        </div>

        <div className="bg-black/40 border border-white/10 rounded-xl p-6">
          <p className="text-white/60 text-sm">Jumlah Menu Terjual</p>
          <p className="text-lg font-medium text-green-300 mt-2">
            {topItems.reduce((sum, i) => sum + i.qty, 0)}
          </p>
        </div>
      </div>

      {/* BAR CHART */}
      <div className="bg-black/40 border border-white/10 rounded-xl p-6">
        <h2 className="text-white font-medium mb-4">
          Grafik Penjualan Bulanan
        </h2>

        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={sales.map((item) => ({
                ...item,
                monthName: MONTHS[item.month - 1],
              }))}
            >
              <XAxis dataKey="monthName" stroke="#aaa" />
              <YAxis stroke="#aaa" />
              <Tooltip />
              <Bar
                dataKey="total"
                fill="#34d399"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* TOP ITEMS */}
      <div className="bg-black/40 border border-white/10 rounded-xl p-6">
        <h2 className="text-white font-medium mb-4">
          Top 5 Menu Terlaris
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-white/80">
            <thead className="bg-white/10 text-white">
              <tr>
                <th className="px-4 py-3 text-left">Menu</th>
                <th className="px-4 py-3 text-right">Qty</th>
                <th className="px-4 py-3 text-right">Harga</th>
              </tr>
            </thead>
            <tbody>
              {topItems.map((item, i) => (
                <tr
                  key={i}
                  className="border-t border-white/10 hover:bg-white/5"
                >
                  <td className="px-4 py-3">{item.name}</td>
                  <td className="px-4 py-3 text-right">{item.qty}</td>
                  <td className="px-4 py-3 text-right">
                    Rp {Number(item.price).toLocaleString("id-ID")}
                  </td>
                </tr>
              ))}
              {topItems.length === 0 && (
                <tr>
                  <td
                    colSpan={3}
                    className="py-6 text-center text-white/50"
                  >
                    Belum ada data
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
