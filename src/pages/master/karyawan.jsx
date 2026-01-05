import { useEffect, useState } from "react";
import api from "../../services/api";

export default function MasterKaryawan() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showCreate, setShowCreate] = useState(false);
  const [showEdit, setShowEdit] = useState(false);

  const emptyForm = {
    id: "",
    name: "",
    email: "",
    password: "",
    is_active: true,
  };

  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await api.get("/admin/users");
      setUsers(res.data);
    } catch {
      alert("Gagal mengambil data kasir");
    } finally {
      setLoading(false);
    }
  };

  const toggleActive = async (id) => {
    try {
      await api.patch(`/admin/users/${id}/toggle`);
      fetchUsers();
    } catch {
      alert("Gagal update status");
    }
  };

  const deleteUser = async (id) => {
    if (!confirm("Yakin hapus kasir?")) return;
    try {
      await api.delete(`/admin/users/${id}`);
      fetchUsers();
    } catch {
      alert("Gagal hapus kasir");
    }
  };

  const openEdit = (user) => {
    setForm({
      id: user.id,
      name: user.name,
      email: user.email,
      password: "",
      is_active: user.is_active,
    });
    setShowEdit(true);
  };

  const submitCreate = async (e) => {
    e.preventDefault();
    try {
      await api.post("/admin/users", {
        name: form.name,
        email: form.email,
        password: form.password,
      });
      setShowCreate(false);
      setForm(emptyForm);
      fetchUsers();
    } catch {
      alert("Gagal menambah kasir");
    }
  };

  const submitEdit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/admin/users/${form.id}`, {
        name: form.name,
        email: form.email,
      });
      setShowEdit(false);
      setForm(emptyForm);
      fetchUsers();
    } catch {
      alert("Gagal update kasir");
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
          Data Master Karyawan
        </h1>

        <button
          onClick={() => {
            setForm(emptyForm);
            setShowCreate(true);
          }}
          className="px-4 py-2 bg-amber-500 text-black rounded-lg"
        >
          + Tambah Kasir
        </button>
      </div>

      {/* TABLE */}
      <div className="bg-black/40 border border-white/10 rounded-xl overflow-x-auto">
        <table className="w-full text-sm text-white/80">
          <thead className="bg-white/10 text-white">
            <tr>
              <th className="px-4 py-3 text-left">Nama</th>
              <th className="px-4 py-3 text-left">Email</th>
              <th className="px-4 py-3 text-center">Status</th>
              <th className="px-4 py-3 text-center">Aksi</th>
            </tr>
          </thead>

          <tbody>
            {users.map((u) => (
              <tr
                key={u.id}
                className="border-t border-white/10 hover:bg-white/5"
              >
                <td className="px-4 py-3 font-medium">{u.name}</td>
                <td className="px-4 py-3">{u.email}</td>
                <td className="px-4 py-3 text-center">
                  <button
                    onClick={() => toggleActive(u.id)}
                    className={`px-3 py-1 rounded-full text-xs
                      ${
                        u.is_active
                          ? "bg-green-500/20 text-green-300"
                          : "bg-red-500/20 text-red-300"
                      }`}
                  >
                    {u.is_active ? "Aktif" : "Nonaktif"}
                  </button>
                </td>
                <td className="px-4 py-3 text-center space-x-2">
                  <button
                    onClick={() => openEdit(u)}
                    className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded text-xs"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteUser(u.id)}
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
          title="Tambah Kasir"
          form={form}
          setForm={setForm}
          onClose={() => setShowCreate(false)}
          onSubmit={submitCreate}
          isCreate
        />
      )}

      {/* MODAL EDIT */}
      {showEdit && (
        <Modal
          title="Edit Kasir"
          form={form}
          setForm={setForm}
          onClose={() => setShowEdit(false)}
          onSubmit={submitEdit}
        />
      )}
    </div>
  );
}

/* ================= MODAL ================= */

function Modal({ title, form, setForm, onClose, onSubmit, isCreate }) {
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
          placeholder="Nama"
          value={form.name}
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
          required
        />

        <input
          type="email"
          className="w-full p-2 rounded bg-black border border-white/20"
          placeholder="Email"
          value={form.email}
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
          required
        />

        {isCreate && (
          <input
            type="password"
            className="w-full p-2 rounded bg-black border border-white/20"
            placeholder="Password"
            value={form.password}
            onChange={(e) =>
              setForm({ ...form, password: e.target.value })
            }
            required
          />
        )}

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
