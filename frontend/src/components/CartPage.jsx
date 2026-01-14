import React, { useEffect, useState } from 'react';
import API from '../api';

export default function CartPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const res = await API.get('/cart');
      setItems(res.data.items || []);
    } catch (err) {
      console.error(err);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const updateQty = async (id, qty) => {
    try {
      await API.put(`/cart/${id}`, { quantity: qty });
      await load();
      window.dispatchEvent(new CustomEvent('cartUpdated'));
    } catch (err) { console.error(err); }
  };

  const removeItem = async id => {
    try {
      await API.delete(`/cart/${id}`);
      await load();
      window.dispatchEvent(new CustomEvent('cartUpdated'));
    } catch (err) { console.error(err); }
  };

  const total = items.reduce((s, it) => s + (it.quantity * (it.product?.price || 0)), 0);

  if (loading) return <div>Loading...</div>;
  if (!items.length) return <div>Your cart is empty</div>;

  return (
    <div className="cart-page">
      <h2>Your Cart</h2>
      <table>
        <thead><tr><th>Product</th><th>Price</th><th>Qty</th><th>Subtotal</th><th>Action</th></tr></thead>
        <tbody>
          {items.map(it => (
            <tr key={it.id}>
              <td>
                <img src={it.product?.image} alt={it.product?.name} style={{width:60}} />
                {it.product?.name}
              </td>
              <td>{it.product?.price}</td>
              <td>
                <button onClick={() => updateQty(it.id, it.quantity - 1)} disabled={it.quantity <= 1}>-</button>
                {it.quantity}
                <button onClick={() => updateQty(it.id, it.quantity + 1)}>+</button>
              </td>
              <td>{(it.quantity * (it.product?.price || 0)).toFixed(2)}</td>
              <td><button onClick={() => removeItem(it.id)}>Remove</button></td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="cart-total">
        <h3>Total: {total.toFixed(2)}</h3>
        <button onClick={() => alert('Proceed to checkout - implement next')}>Checkout</button>
      </div>
    </div>
  );
}
