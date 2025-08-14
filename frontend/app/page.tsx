"use client";
import { useState } from "react";

type Product = {
  id: number;
  name: string;
  price: number;
  image: string;
};

export default function HomePage() {
  const products: Product[] = Array.from({ length: 10 }).map((_, i) => ({
    id: i + 1,
    name: `Cosmic T-Shirt ${i + 1}`,
    price: 100000 + i * 5000,
    image: `https://picsum.photos/seed/product${i}/300/300`,
  }));

  const [cart, setCart] = useState<Product[]>([]);
  const [qrUrl, setQrUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const addToCart = (product: Product) => {
    setCart((prev) => [...prev, product]);
  };

  const removeFromCart = (index: number) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
  };

  const totalAmount = cart.reduce((sum, item) => sum + item.price, 0);

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    setLoading(true);
    const note = `Order_${Date.now()}`;
    const res = await fetch("http://localhost:8080/generate-qr", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: totalAmount, note }),
    });
    const data = await res.json();
    setQrUrl(data.qr_url);
    setLoading(false);
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold text-center mb-6">🚀 Cosmic Shop</h1>

      {/* Product grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-xl shadow hover:shadow-lg p-4 flex flex-col"
          >
            <img
              src={product.image}
              alt={product.name}
              className="rounded-lg mb-4"
            />
            <h2 className="font-bold text-lg">{product.name}</h2>
            <p className="text-gray-600 mb-2">
              {product.price.toLocaleString()} VND
            </p>
            <button
              onClick={() => addToCart(product)}
              className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 mt-auto"
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>

      {/* Cart */}
      <div className="mt-10 bg-gray-100 p-6 rounded-lg">
        <h2 className="text-2xl font-bold mb-4">🛒 Cart</h2>
        {cart.length === 0 ? (
          <p className="text-gray-500">No items in cart.</p>
        ) : (
          <>
            <ul>
              {cart.map((item, index) => (
                <li
                  key={index}
                  className="flex justify-between items-center border-b py-2"
                >
                  <span>
                    {item.name} - {item.price.toLocaleString()} VND
                  </span>
                  <button
                    onClick={() => removeFromCart(index)}
                    className="text-red-600 hover:underline"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
            <div className="mt-4 flex justify-between font-bold">
              <span>Total:</span>
              <span>{totalAmount.toLocaleString()} VND</span>
            </div>
            <button
              onClick={handleCheckout}
              disabled={loading}
              className="mt-4 w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
            >
              {loading ? "Generating QR..." : "Checkout"}
            </button>
          </>
        )}
      </div>

      {/* QR Code */}
      {qrUrl && (
        <div className="mt-6 text-center">
          <img src={qrUrl} alt="Payment QR" className="mx-auto w-64 h-64" />
          <p className="mt-2">Scan to pay {totalAmount.toLocaleString()} VND</p>
        </div>
      )}
    </div>
  );
}
