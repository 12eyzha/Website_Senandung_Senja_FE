import { useEffect, useState } from "react";
import api from "../../services/api";

export default function MasterMenu() {
  const [menus, setMenus] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showEdit, setShowEdit] = useState(false);
  const [showCreate, setShowCreate] = useState(false);

  const emptyForm = {
    id: "",
    name: "",
    category_id: "",
    price: "",
    is_available: true,
  };

  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    fetchMenus();
    fetchCategories();
  }, []);

  const fetchMenus = async () => {
    try {
      const res = await api.get("/admin/menus");
      setMenus(res.data.data ?? res.data);
    } catch {
      alert("Gagal ambil menu");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await api.get("/admin/categories");
      setCategories(res.data);
    } catch {
      alert("Gagal ambil kategori");
    }
  };

  const toggleAvailable = async (id) => {
    try {
      await api.patch(`/admin/menus/${id}/toggle`);
      fetchMenus();
    } catch {
      alert("Gagal update status");
    }
  };

  const deleteMenu = async (id) => {
    if (!confirm("Yakin hapus menu?")) return;
    try {
      await api.delete(`/admin/menus/${id}`);
      fetchMenus();
    } catch {
      alert("Gagal hapus menu");
    }
  };

  const openEdit = (menu) => {
    setForm({
      id: menu.id,
      name: menu.name,
      category_id: menu.category_id,
      price: menu.price,
      is_available: menu.is_available,
    });
    setShowEdit(true);
  };

  const submitEdit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/admin/menus/${form.id}`, form);
      setShowEdit(false);
      setForm(emptyForm);
      fetchMenus();
    } catch {
      alert("Gagal update menu");
    }
  };

  const submitCreate = async (e) => {
    e.preventDefault();
    try {
      await api.post("/admin/menus", form);
      setShowCreate(false);
      setForm(emptyForm);
      fetchMenus();
    } catch {
      alert("Gagal menambahkan menu");
    }
  };

  if (loading) {
    return <p className="p-6 text-white">Loading...</p>;
  }

  return (
    <div className="p-6 space-y-6">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-amber-300">
          Data Master Menu
        </h1>

        <button
          onClick={() => {
            setForm(emptyForm);
            setShowCreate(true);
          }}
          className="px-4 py-2 bg-amber-500 text-black rounded-lg"
        >
          + Tambah Menu
        </button>
      </div>

      {/* TABLE */}
      <div className="bg-black/40 border border-white/10 rounded-xl overflow-x-auto">
        <table className="w-full text-sm text-white/80">
          <thead className="bg-white/10 text-white">
            <tr>
              <th className="px-4 py-3 text-left">Nama</th>
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
                <td className="px-4 py-3 font-medium">
                  {menu.name}
                </td>
                <td className="px-4 py-3">
                  {menu.category?.name}
                </td>
                <td className="px-4 py-3">
                  Rp {Number(menu.price).toLocaleString("id-ID")}
                </td>
                <td className="px-4 py-3 text-center">
                  <button
                    onClick={() => toggleAvailable(menu.id)}
                    className={`px-3 py-1 rounded-full text-xs
                      ${
                        menu.is_available
                          ? "bg-green-500/20 text-green-300"
                          : "bg-red-500/20 text-red-300"
                      }`}
                  >
                    {menu.is_available ? "Available" : "Off"}
                  </button>
                </td>
                <td className="px-4 py-3 text-center space-x-2">
                  <button
                    onClick={() => openEdit(menu)}
                    className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded text-xs"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteMenu(menu.id)}
                    className="px-3 py-1 bg-red-500/20 text-red-300 rounded text-xs"
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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

/* ================= MODAL COMPONENT ================= */

function Modal({ title, form, setForm, categories, onClose, onSubmit }) {
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <form
        onSubmit={onSubmit}
        className="bg-zinc-900 p-6 rounded-xl w-full max-w-md space-y-4"
      >
        <h2 className="text-lg font-semibold text-amber-300">
          {title}
        </h2>

        <input
          className="w-full p-2 rounded bg-black border border-white/20"
          placeholder="Nama Menu"
          value={form.name}
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
          required
        />

        <select
          className="w-full p-2 rounded bg-black border border-white/20"
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
          className="w-full p-2 rounded bg-black border border-white/20"
          placeholder="Harga"
          value={form.price}
          onChange={(e) =>
            setForm({ ...form, price: e.target.value })
          }
          required
        />

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-white/10 rounded"
          >
            Batal
          </button>
          <button className="px-4 py-2 bg-amber-500 text-black rounded">
            Simpan
          </button>
        </div>
      </form>
    </div>
  );
}
