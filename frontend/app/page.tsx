"use client";
import { useState } from "react";

export default function HomePage() {
  const [qrUrl, setQrUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const amount = 150000; // Giá sản phẩm
  const note = "Order_001";

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8080/generate-qr", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount, note }),
      });

      if (!res.ok) {
        throw new Error("Failed to generate QR");
      }

      const data = await res.json();
      setQrUrl(data.qr_url);
    } catch (error) {
      console.error(error);
      alert("Error generating QR");
    }
    setLoading(false);
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-6 bg-gray-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md text-center">
        <h1 className="text-3xl font-bold mb-6">🚀 Cosmic T-Shirt</h1>
        <p className="mb-4 text-lg">
          Price: <span className="font-semibold">{amount.toLocaleString()} VND</span>
        </p>
        <button
          onClick={handleCheckout}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Buy Now
        </button>

        {loading && <p className="mt-4 text-gray-600">Generating QR...</p>}

        {qrUrl && (
          <div className="mt-6">
            <img src={qrUrl} alt="Payment QR" className="w-64 h-64 mx-auto" />
            <p className="mt-2 text-sm text-gray-500">Note: {note}</p>
          </div>
        )}
      </div>
    </main>
  );
}
