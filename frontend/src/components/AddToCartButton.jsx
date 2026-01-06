import React from 'react';
import API from '../api';

export default function AddToCartButton({ productId, qty = 1, onAdded }) {
  const handleAdd = async () => {
    try {
      const res = await API.post('/cart', { productId, quantity: qty });
      if (res.data.success) {
        if (typeof onAdded === 'function') onAdded(res.data.item);
        // optionally dispatch event to update navbar count
        window.dispatchEvent(new CustomEvent('cartUpdated'));
      }
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || 'Failed to add to cart');
    }
  };

  return <button onClick={handleAdd} className="btn-add-cart">Add to cart</button>;
}

