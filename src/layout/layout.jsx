import Sidebar from "../layouts/sidebar";
import Navbar from "../layouts/navbar";

export default function Layout({ children }) {
  return (
    <div className="min-h-screen flex bg-gradient-to-br from-amber-900 via-stone-900 to-black text-white">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="flex-1 px-6 py-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
