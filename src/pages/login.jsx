import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../contexts/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await api.post("/login", {
        email,
        password,
      });

      const token = res.data.access_token;
      const user = res.data.user;

      if (!token || !user) {
        throw new Error("Response login tidak valid");
      }

      // ✅ SIMPAN TOKEN + USER (INI KUNCI UTAMA)
      login(token, user);

      navigate("/dashboard", { replace: true });

    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.message ||
        "Login gagal"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-900 via-stone-900 to-black px-4">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-8">

        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-white">Senandung Senja</h1>
          <p className="text-sm text-gray-300">
            Coffee Shop Management
          </p>
        </div>

        {error && (
          <div className="mb-4 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-2">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="email"
            placeholder="admin@senandung.test"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl bg-black/30 border border-white/20 px-4 py-3 text-white"
            required
          />

          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl bg-black/30 border border-white/20 px-4 py-3 text-white"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-700 text-black font-semibold disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-center text-xs text-gray-400 mt-6">
          © 2025 Senandung Senja
        </p>
      </div>
    </div>
  );
}
