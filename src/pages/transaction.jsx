import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function Transactions() {
  const navigate = useNavigate();

  const [menus, setMenus] = useState([]);
  const [cart, setCart] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [loading, setLoading] = useState(false);

  /* ================= SEARCH & PAGINATION ================= */
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 5;

  useEffect(() => {
    api.get("/menus").then((res) => {
      setMenus(res.data.data ?? res.data);
    });
  }, []);

  /* ================= FILTER & PAGINATE ================= */

  const filteredMenus = menus.filter((m) =>
    m.name.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredMenus.length / ITEMS_PER_PAGE);

  const paginatedMenus = filteredMenus.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  /* ================= CART LOGIC ================= */

  const addItem = (menu) => {
    setCart((prev) => {
      const found = prev.find((i) => i.id === menu.id);

      if (found) {
        return prev.map((i) =>
          i.id === menu.id ? { ...i, qty: i.qty + 1 } : i
        );
      }

      return [...prev, { ...menu, qty: 1 }];
    });
  };

  const removeItem = (id) => {
    setCart((prev) =>
      prev
        .map((i) =>
          i.id === id ? { ...i, qty: i.qty - 1 } : i
        )
        .filter((i) => i.qty > 0)
    );
  };

  const getQty = (id) =>
    cart.find((i) => i.id === id)?.qty ?? 0;

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  /* ================= SUBMIT ================= */

  const submitTransaction = async () => {
    if (cart.length === 0) return;

    setLoading(true);
    try {
      const res = await api.post("/transactions", {
        items: cart.map((i) => ({
          menu_id: i.id,
          qty: i.qty,
        })),
        payment_method: paymentMethod,
      });

      navigate(`/dashboard/payment/${res.data.data.id}`, {
        state: { total, paymentMethod },
      });
    } catch (err) {
      console.error(err.response?.data);
      alert("Gagal membuat transaksi");
    } finally {
      setLoading(false);
    }
  };

  /* ================= UI ================= */

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

      {/* MENU LIST */}
      <div className="lg:col-span-2 bg-white/5 p-4 rounded-xl">
        <h2 className="font-semibold mb-4">Menu</h2>

        {/* SEARCH */}
        <input
          type="text"
          placeholder="Cari menu..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          className="w-full mb-4 p-2 rounded bg-black/40"
        />

        <div className="space-y-3">
          {paginatedMenus.map((m) => {
            const qty = getQty(m.id);

            return (
              <div
                key={m.id}
                className="flex justify-between items-center bg-white/10 rounded-lg p-4"
              >
                <div>
                  <div className="font-semibold text-white">
                    {m.name}
                  </div>

                  <div className="text-xs text-white/60 mt-1">
                    {m.description || "—"}
                  </div>

                  <div className="text-sm text-amber-300 mt-2">
                    Rp {Number(m.price).toLocaleString("id-ID")}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => removeItem(m.id)}
                    disabled={qty === 0}
                    className="w-8 h-8 rounded bg-white/20 disabled:opacity-30"
                  >
                    −
                  </button>

                  <span className="w-6 text-center">{qty}</span>

                  <button
                    onClick={() => addItem(m)}
                    className="w-8 h-8 rounded bg-amber-500 text-black"
                  >
                    +
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* PAGINATION */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-4 mt-4">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 bg-white/20 rounded disabled:opacity-30"
            >
              Prev
            </button>

            <span className="text-sm">
              {currentPage} / {totalPages}
            </span>

            <button
              onClick={() =>
                setCurrentPage((p) => Math.min(p + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="px-3 py-1 bg-white/20 rounded disabled:opacity-30"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* CART */}
      <div className="bg-white/5 p-4 rounded-xl">
        <h2 className="font-semibold mb-4">Keranjang</h2>

        {cart.length === 0 && (
          <div className="text-sm opacity-60">
            Belum ada item
          </div>
        )}

        {cart.map((c) => (
          <div
            key={c.id}
            className="flex justify-between items-center mb-3"
          >
            <div>
              <div className="font-medium">{c.name}</div>
              <div className="flex items-center gap-2 mt-1">
                <button
                  onClick={() => removeItem(c.id)}
                  className="px-2 bg-white/20 rounded"
                >
                  −
                </button>

                <span>{c.qty}</span>

                <button
                  onClick={() => addItem(c)}
                  className="px-2 bg-white/20 rounded"
                >
                  +
                </button>
              </div>
            </div>

            <div>
              Rp {(c.price * c.qty).toLocaleString("id-ID")}
            </div>
          </div>
        ))}

        <hr className="my-3 opacity-20" />

        <div className="flex justify-between font-semibold">
          <span>Total</span>
          <span>Rp {total.toLocaleString("id-ID")}</span>
        </div>

        <div className="mt-4">
          <select
            className="w-full p-2 rounded bg-black/40"
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
          >
            <option value="cash">Tunai</option>
            <option value="transfer">Transfer</option>
          </select>
        </div>

        <button
          onClick={submitTransaction}
          disabled={loading || cart.length === 0}
          className="w-full mt-4 bg-amber-500 hover:bg-amber-600 text-black py-2 rounded-lg disabled:opacity-50"
        >
          {loading ? "Memproses..." : "Bayar"}
        </button>
      </div>
    </div>
  );


}
