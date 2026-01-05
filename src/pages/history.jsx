import { useEffect, useState } from "react";
import api from "../services/api";

export default function History() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await api.get("/transactions/history");
      setTransactions(res.data.data);
    } catch {
      setError("Gagal mengambil data transaksi");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id) => {
    const reason = prompt("Masukkan alasan pembatalan");
    if (!reason) return;

    try {
       await api.patch(`/admin/transactions/${id}/cancel`, {
    cancel_reason: reason,
  });
      alert("Transaksi berhasil dibatalkan");
      fetchHistory();
    } catch (err) {
      alert(err.response?.data?.message || "Gagal cancel transaksi");
    }
  };

  const exportDaily = async () => {
    try {
      const today = new Date().toISOString().split("T")[0];
      const res = await api.get(`/reports/daily?date=${today}`, {
        responseType: "blob",
        headers: { Authorization: `Bearer ${token}` },
      });

      const url = URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.download = `laporan-harian-${today}.pdf`;
      link.click();
    } catch {
      alert("Gagal export laporan harian");
    }
  };

  const exportTransaction = async (id) => {
    try {
      const res = await api.get(`/reports/transaction/${id}`, {
        responseType: "blob",
        headers: { Authorization: `Bearer ${token}` },
      });

      const url = URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.download = `transaksi-${id}.pdf`;
      link.click();
    } catch {
      alert("Gagal export PDF transaksi");
    }
  };

  if (loading) return <p className="p-6 text-white">Loading...</p>;
  if (error) return <p className="p-6 text-red-400">{error}</p>;

  return (
    <div className="p-6">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-amber-300">
          Riwayat Transaksi
        </h1>

        {user?.role === "admin" && (
          <button
            onClick={exportDaily}
            className="px-5 py-2 bg-amber-500/20 text-amber-300 rounded-lg hover:bg-amber-500/30 transition text-sm"
          >
            Export Harian (PDF)
          </button>
        )}
      </div>

      {/* TABLE CONTAINER */}
      <div className="bg-black/40 border border-white/10 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-white/80">
            <thead className="bg-white/10 text-white">
              <tr>
                <th className="px-4 py-4 text-left">Kode</th>
                <th className="px-4 py-4 text-left">Total</th>
                <th className="px-4 py-4 text-left">Metode</th>
                <th className="px-4 py-4 text-left">Pembayaran</th>
                <th className="px-4 py-4 text-left">Status</th>
                <th className="px-4 py-4 text-left">Tanggal</th>
                {user?.role === "admin" && (
                  <th className="px-4 py-4 text-center whitespace-nowrap">
                    Aksi
                  </th>
                )}
              </tr>
            </thead>

            <tbody>
              {transactions.length === 0 && (
                <tr>
                  <td
                    colSpan={user?.role === "admin" ? 7 : 6}
                    className="py-8 text-center text-white/50"
                  >
                    Belum ada transaksi
                  </td>
                </tr>
              )}

              {transactions.map((trx) => (
                <tr
                  key={trx.id}
                  className="border-t border-white/10 hover:bg-white/5 transition"
                >
                  <td className="px-4 py-4 font-medium">
                    {trx.transaction_code}
                  </td>

                  <td className="px-4 py-4">
                    Rp {Number(trx.total_amount).toLocaleString("id-ID")}
                  </td>

                  <td className="px-4 py-4">
                    <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs capitalize">
                      {trx.payment_method}
                    </span>
                  </td>

                  <td className="px-4 py-4">
                    <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-300 text-xs">
                      {trx.payment_status}
                    </span>
                  </td>

                  <td className="px-4 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium
                        ${
                          trx.status === "completed"
                            ? "bg-green-500/20 text-green-300"
                            : trx.status === "cancelled"
                            ? "bg-red-500/20 text-red-300"
                            : "bg-yellow-500/20 text-yellow-300"
                        }`}
                    >
                      {trx.status}
                    </span>
                  </td>

                  <td className="px-4 py-4">
                    {new Date(trx.created_at).toLocaleString("id-ID")}
                  </td>

                  {user?.role === "admin" && (
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex justify-center gap-3">
                        {trx.status !== "cancelled" && (
                          <button
                            onClick={() => handleCancel(trx.id)}
                            className="px-3 py-1.5 bg-red-500/20 text-red-300 rounded-md hover:bg-red-500/30 transition text-xs"
                          >
                            Cancel
                          </button>
                        )}

                        <button
                          onClick={() => exportTransaction(trx.id)}
                          className="px-3 py-1.5 bg-white/10 text-white rounded-md hover:bg-white/20 transition text-xs"
                        >
                          PDF
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
