import { useEffect, useState } from "react";
import api from "../../services/api";

export default function Menu() {
  const [menus, setMenus] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // pagination
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  const [showCreate, setShowCreate] = useState(false);
  const [showEdit, setShowEdit] = useState(false);

  const emptyForm = {
    id: "",
    name: "",
    description: "",
    category_id: "",
    price: "",
    is_available: true,
  };

  const [form, setForm] = useState(emptyForm);

  /* ================= FETCH ================= */

  useEffect(() => {
    fetchMenus(page);
    fetchCategories();
  }, [page]);

  const fetchMenus = async (pageNumber = 1) => {
    try {
      const res = await api.get("/admin/menus", {
        params: { page: pageNumber },
      });

      setMenus(res.data.data);
      setPage(res.data.current_page);
      setLastPage(res.data.last_page);
    } catch (err) {
      console.error(err);
      alert("Gagal mengambil menu");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await api.get("/admin/categories");
      setCategories(res.data);
    } catch {
      alert("Gagal mengambil kategori");
    }
  };

  /* ================= ACTION ================= */

  const toggleAvailable = async (id) => {
    try {
      await api.patch(`/admin/menus/${id}/toggle`);
      fetchMenus(page);
    } catch {
      alert("Gagal update status");
    }
  };

  const deleteMenu = async (id) => {
    if (!confirm("Yakin hapus menu?")) return;
    try {
      await api.delete(`/admin/menus/${id}`);
      fetchMenus(page);
    } catch {
      alert("Gagal hapus menu");
    }
  };

  const openEdit = (menu) => {
    setForm({
      id: menu.id,
      name: menu.name,
      description: menu.description ?? "",
      category_id: menu.category_id,
      price: menu.price,
      is_available: !!menu.is_available,
    });
    setShowEdit(true);
  };

  const submitCreate = async (e) => {
    e.preventDefault();
    try {
      await api.post("/admin/menus", {
        name: form.name,
        description: form.description,
        category_id: form.category_id,
        price: form.price,
        is_available: form.is_available ? 1 : 0,
      });
      setShowCreate(false);
      setForm(emptyForm);
      fetchMenus(1); // balik ke page 1
      setPage(1);
    } catch {
      alert("Gagal tambah menu");
    }
  };

  const submitEdit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/admin/menus/${form.id}`, {
        name: form.name,
        description: form.description,
        category_id: form.category_id,
        price: form.price,
        is_available: form.is_available ? 1 : 0,
      });
      setShowEdit(false);
      setForm(emptyForm);
      fetchMenus(page);
    } catch {
      alert("Gagal update menu");
    }
  };

  if (loading) {
    return <p className="p-6 text-white">Loading...</p>;
  }

  /* ================= RENDER ================= */

  return (
    <div className="p-6 space-y-6 text-white">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-amber-400">
          Data Master Menu
        </h1>

        <button
          onClick={() => {
            setForm(emptyForm);
            setShowCreate(true);
          }}
          className="px-4 py-2 bg-amber-500 text-black rounded-lg font-medium"
        >
          + Tambah Menu
        </button>
      </div>

      {/* TABLE */}
      <div className="bg-zinc-900 border border-white/10 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-zinc-800 text-white">
            <tr>
              <th className="px-4 py-3 text-left">Nama</th>
              <th className="px-4 py-3 text-left">Deskripsi</th>
              <th className="px-4 py-3 text-left">Kategori</th>
              <th className="px-4 py-3 text-left">Harga</th>
              <th className="px-4 py-3 text-center">Status</th>
              <th className="px-4 py-3 text-center">Aksi</th>
            </tr>
          </thead>

          <tbody>
            {menus.map((menu) => (
              <tr
                key={menu.id}
                className="border-t border-white/10 hover:bg-white/5"
              >
                <td className="px-4 py-3">{menu.name}</td>
                <td className="px-4 py-3 text-xs text-white/70">
                  {menu.description || "—"}
                </td>
                <td className="px-4 py-3">{menu.category?.name}</td>
                <td className="px-4 py-3">
                  Rp {Number(menu.price).toLocaleString("id-ID")}
                </td>
                <td className="px-4 py-3 text-center">
                  <button
                    onClick={() => toggleAvailable(menu.id)}
                    className={`px-3 py-1 rounded-full text-xs font-medium
                      ${
                        menu.is_available
                          ? "bg-green-500/20 text-green-400"
                          : "bg-red-500/20 text-red-400"
                      }`}
                  >
                    {menu.is_available ? "Aktif" : "Nonaktif"}
                  </button>
                </td>
                <td className="px-4 py-3 text-center space-x-2">
                  <button
                    onClick={() => openEdit(menu)}
                    className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded text-xs"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteMenu(menu.id)}
                    className="px-3 py-1 bg-red-500/20 text-red-400 rounded text-xs"
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      <div className="flex justify-between items-center pt-4">
        <p className="text-sm text-white/60">
          Page {page} dari {lastPage}
        </p>

        <div className="space-x-2">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="px-3 py-1 rounded bg-white/10 disabled:opacity-40"
          >
            Prev
          </button>

          <button
            disabled={page === lastPage}
            onClick={() => setPage(page + 1)}
            className="px-3 py-1 rounded bg-white/10 disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>

      {/* MODAL CREATE */}
      {showCreate && (
        <Modal
          title="Tambah Menu"
          form={form}
          setForm={setForm}
          categories={categories}
          onClose={() => setShowCreate(false)}
          onSubmit={submitCreate}
        />
      )}

      {/* MODAL EDIT */}
      {showEdit && (
        <Modal
          title="Edit Menu"
          form={form}
          setForm={setForm}
          categories={categories}
          onClose={() => setShowEdit(false)}
          onSubmit={submitEdit}
        />
      )}
    </div>
  );
}

/* ================= MODAL ================= */

function Modal({ title, form, setForm, categories, onClose, onSubmit }) {
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <form
        onSubmit={onSubmit}
        className="bg-zinc-900 p-6 rounded-xl w-full max-w-md space-y-4 text-white"
      >
        <h2 className="text-lg font-semibold text-amber-400">{title}</h2>

        <input
          className="w-full p-2 rounded bg-zinc-800 border border-white/20"
          placeholder="Nama Menu"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />

        <textarea
          className="w-full p-2 rounded bg-zinc-800 border border-white/20"
          placeholder="Deskripsi menu (opsional)"
          value={form.description}
          onChange={(e) =>
            setForm({ ...form, description: e.target.value })
          }
          rows={3}
        />

        <select
          className="w-full p-2 rounded bg-zinc-800 border border-white/20"
          value={form.category_id}
          onChange={(e) =>
            setForm({ ...form, category_id: e.target.value })
          }
          required
        >
          <option value="">Pilih Kategori</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        <input
          type="number"
          className="w-full p-2 rounded bg-zinc-800 border border-white/20"
          placeholder="Harga"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
          required
        />

        <label className="flex items-center gap-3 text-sm">
          <input
            type="checkbox"
            checked={form.is_available}
            onChange={(e) =>
              setForm({ ...form, is_available: e.target.checked })
            }
            className="accent-amber-500"
          />
          Menu Aktif
        </label>

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-white/10 rounded"
          >
            Batal
          </button>
          <button className="px-4 py-2 bg-amber-500 text-black rounded font-medium">
            Simpan
          </button>
        </div>
      </form>
    </div>
  );
}
