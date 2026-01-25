import React, { useEffect, useState } from "react";
import API from "../api";
import Navbar from "./Navbar";
import "./CartPage.css";

export default function CartPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const res = await API.get("/cart");
      setItems(res.data.items || []);
    } catch (err) {
      console.error(err);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const updateQty = async (id, qty) => {
    if (qty < 1) return;
    try {
      await API.put(`/cart/${id}`, { quantity: qty });
      await load();
      window.dispatchEvent(new CustomEvent("cartUpdated"));
    } catch (err) {
      console.error(err);
    }
  };

  const removeItem = async (id) => {
    try {
      await API.delete(`/cart/${id}`);
      await load();
      window.dispatchEvent(new CustomEvent("cartUpdated"));
    } catch (err) {
      console.error(err);
    }
  };

  const total = items.reduce(
    (sum, it) => sum + it.quantity * (it.product?.price || 0),
    0
  );

  return (
    <>
      <Navbar />

      <div className="cart-container page-content">
        <h2>🛒 Your Cart</h2>

        {loading && <p>Loading...</p>}
        {!loading && !items.length && <p>Your cart is empty</p>}

        {!loading && items.length > 0 && (
          <>
            <table>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Price</th>
                  <th>Qty</th>
                  <th>Subtotal</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {items.map((it) => (
                  <tr key={it.id}>
                    <td className="product-cell">
                      <img
                        src={it.product?.image}
                        alt={it.product?.name}
                      />
                      <span>{it.product?.name}</span>
                    </td>
                    <td>₹{it.product?.price}</td>
                    <td>
                      <button
                        onClick={() => updateQty(it.id, it.quantity - 1)}
                        disabled={it.quantity <= 1}
                      >
                        -
                      </button>
                      <span className="qty">{it.quantity}</span>
                      <button
                        onClick={() => updateQty(it.id, it.quantity + 1)}
                      >
                        +
                      </button>
                    </td>
                    <td>
                      ₹{(it.quantity * (it.product?.price || 0)).toFixed(2)}
                    </td>
                    <td>
                      <button
                        className="remove-btn"
                        onClick={() => removeItem(it.id)}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="cart-total">
              <h3>Total: ₹{total.toFixed(2)}</h3>
              <button
                className="checkout-btn"
                onClick={() =>
                  alert("Checkout flow will be added next")
                }
              >
                Checkout
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}

