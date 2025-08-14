"use client";
import { useState } from "react";

export default function HomePage() {
  const [qrUrl, setQrUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const amount = 150000;
  const note = "Order_001";

  const handleCheckout = async () => {
    setLoading(true);
    const res = await fetch("http://localhost:8080/generate-qr", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount, note }),
    });
    const data = await res.json();
    setQrUrl(data.qr_url);
    setLoading(false);
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-6">
      <h1 className="text-3xl font-bold mb-6">🚀 Cosmic T-Shirt</h1>
      <p className="mb-4">Price: {amount.toLocaleString()} VND</p>
      <button
        onClick={handleCheckout}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Buy Now
      </button>

      {loading && <p className="mt-4">Generating QR...</p>}

      {qrUrl && (
        <div className="mt-6">
          <img src={qrUrl} alt="Payment QR" className="w-64 h-64" />
          <p className="mt-2">Note: {note}</p>
        </div>
      )}
    </main>
  );
}
