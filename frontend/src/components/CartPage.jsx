import React, { useEffect, useState } from "react";
import API from "../api";
import "./CartPage.css";

export default function CartPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const res = await API.get("/cart");
      setItems(res.data.items || []);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const updateQty = async (id, qty) => {
    await API.put(`/cart/${id}`, { quantity: qty });
    load();
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const removeItem = async (id) => {
    await API.delete(`/cart/${id}`);
    load();
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const total = items.reduce(
    (sum, it) => sum + it.quantity * (it.product?.price || 0),
    0
  );

  if (loading) return <div className="cart-container">Loading...</div>;
  if (!items.length) return <div className="cart-container">Your cart is empty</div>;

  return (
    <div className="cart-container">
      <h2>Your Cart</h2>

      <table>
        <thead>
          <tr>
            <th>Product</th><th>Price</th><th>Qty</th><th>Subtotal</th><th></th>
          </tr>
        </thead>
        <tbody>
          {items.map(it => (
            <tr key={it.id}>
              <td>{it.product?.name}</td>
              <td>{it.product?.price}</td>
              <td>
                <button onClick={() => updateQty(it.id, it.quantity - 1)} disabled={it.quantity <= 1}>-</button>
                {it.quantity}
                <button onClick={() => updateQty(it.id, it.quantity + 1)}>+</button>
              </td>
              <td>{(it.quantity * it.product?.price).toFixed(2)}</td>
              <td>
                <button onClick={() => removeItem(it.id)}>Remove</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3>Total: {total.toFixed(2)}</h3>
    </div>
  );
}

