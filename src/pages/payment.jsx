import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useState } from "react";

export default function Payment() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { state } = useLocation();

  const total = state?.total ?? 0;
  const method = state?.paymentMethod ?? "cash";

  const [cash, setCash] = useState("");

  const change = Math.max(Number(cash) - total, 0);
  const isEnough = Number(cash) >= total;

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F6F1EB]">
      
      {/* SINGLE PILL CARD */}
      <div className="w-full max-w-xs px-6 py-7 rounded-[48px] bg-[#EDE3D7] shadow-sm">

        {/* Header */}
        <div className="mb-5 text-center">
          <h2 className="text-lg font-semibold text-[#4A3B2A]">
            Pembayaran
          </h2>
          <span className="inline-block mt-1 px-4 py-1 text-xs rounded-full bg-[#E2D3C1] text-[#6B543A]">
            {method.toUpperCase()}
          </span>
        </div>

        {/* Total */}
        <div className="mb-5 px-4 py-3 rounded-full bg-[#F6F1EB] border border-[#D8C7B3] text-center">
          <p className="text-xs text-[#7A6146]">Total Bayar</p>
          <p className="text-2xl font-bold text-[#5A3E24]">
            Rp {total.toLocaleString("id-ID")}
          </p>
        </div>

        {/* Cash */}
        {method === "cash" && (
          <>
            <input
              type="number"
              placeholder="Uang diterima"
              className="w-full px-4 py-3 rounded-full bg-[#F6F1EB] border border-[#D8C7B3] outline-none focus:ring-2 focus:ring-[#C8A27A] mb-2 text-[#4A3B2A]"
              value={cash}
              onChange={(e) => setCash(e.target.value)}
            />

            {cash && (
              <div
                className={`text-xs px-4 py-2 rounded-full text-center ${
                  isEnough
                    ? "bg-[#DCC9AF] text-[#5A3E24]"
                    : "bg-[#E6CFC5] text-[#7A3F2E]"
                }`}
              >
                {isEnough ? (
                  <>
                    Kembalian:{" "}
                    <strong>
                      Rp {change.toLocaleString("id-ID")}
                    </strong>
                  </>
                ) : (
                  "Uang tidak mencukupi"
                )}
              </div>
            )}
          </>
        )}

        {/* Transfer */}
        {method === "transfer" && (
          <div className="mb-3 px-4 py-3 rounded-full bg-[#E2D3C1] text-[#5A3E24] text-xs text-center">
            <p>Transfer ke</p>
            <p className="font-semibold text-sm">BCA 123456789</p>
          </div>
        )}

        {/* Button */}
        <button
          disabled={method === "cash" && !isEnough}
          onClick={() => navigate("/transactions")}
          className={`w-full mt-4 py-3 rounded-full text-sm font-semibold transition
            ${
              method === "cash" && !isEnough
                ? "bg-[#D1C1AE] text-[#8A7763] cursor-not-allowed"
                : "bg-[#C19A6B] text-[#3F2C1B] hover:bg-[#B38A5C]"
            }
          `}
        >
          Selesai
        </button>
      </div>
    </div>
  );
}
