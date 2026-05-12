import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api";
import "./CartPage.css";

const previewItems = [
  {
    id: "preview-1",
    quantity: 1,
    product: {
      name: "Wireless Premium Headphones",
      price: 1299,
      image: "https://images.pexels.com/photos/3394651/pexels-photo-3394651.jpeg?auto=compress&cs=tinysrgb&w=300"
    }
  },
  {
    id: "preview-2",
    quantity: 2,
    product: {
      name: "Smart Fitness Watch",
      price: 1549,
      image: "https://images.pexels.com/photos/267394/pexels-photo-267394.jpeg?auto=compress&cs=tinysrgb&w=300"
    }
  }
];

export default function CartPage({ preview = false }) {
  const [items, setItems] = useState(preview ? previewItems : []);
  const [loading, setLoading] = useState(!preview);
  const username = localStorage.getItem("username") || "Customer";

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
    if (preview) return;

    const token = localStorage.getItem("token");
    if (!token) {
      localStorage.setItem("redirectAfterLogin", "/cart");
      alert("Please login or create an account to view your cart.");
      window.location.href = "/login";
      return;
    }

    load();
  }, [preview]);

  const updateQty = async (id, qty) => {
    if (qty < 1) return;

    if (preview) {
      setItems((current) =>
        current.map((item) => (item.id === id ? { ...item, quantity: qty } : item))
      );
      return;
    }

    try {
      await API.put(`/cart/${id}`, { quantity: qty });
      await load();
      window.dispatchEvent(new CustomEvent("cartUpdated"));
    } catch (err) {
      console.error(err);
    }
  };

  const removeItem = async (id) => {
    if (preview) {
      setItems((current) => current.filter((item) => item.id !== id));
      return;
    }

    try {
      await API.delete(`/cart/${id}`);
      await load();
      window.dispatchEvent(new CustomEvent("cartUpdated"));
    } catch (err) {
      console.error(err);
    }
  };

  const subtotal = items.reduce(
    (sum, item) => sum + item.quantity * Number(item.product?.price || 0),
    0
  );
  const delivery = subtotal > 0 && subtotal < 999 ? 79 : 0;
  const discount = subtotal >= 999 ? Math.round(subtotal * 0.1) : 0;
  const total = Math.max(subtotal + delivery - discount, 0);

  return (
    <main className="cart-page">
      <div className="cart-deal-bar">
        <span>Free delivery above Rs.999</span>
        <span>Secure checkout</span>
      </div>

      <header className="cart-header">
        <Link to="/" className="cart-logo">FLOWMART</Link>
        <nav>
          <Link to="/">Continue Shopping</Link>
          <span>Hi, {username}</span>
        </nav>
      </header>

      {preview && (
        <div className="cart-preview-banner">
          Preview mode. Real cart still requires login and backend products.
        </div>
      )}

      <section className="cart-layout">
        <div className="cart-main">
          <div className="cart-title-row">
            <div>
              <p className="cart-label">Shopping Cart</p>
              <h1>Your Cart</h1>
            </div>
            <span>{items.length} items</span>
          </div>

          {loading && <div className="cart-state">Loading cart...</div>}

          {!loading && !items.length && (
            <div className="cart-empty">
              <h2>Your cart is empty</h2>
              <p>Add products from the storefront to start your order.</p>
              <Link to="/">Shop Products</Link>
            </div>
          )}

          {!loading && items.length > 0 && (
            <div className="cart-items">
              {items.map((item) => {
                const price = Number(item.product?.price || 0);
                const subtotalLine = price * item.quantity;

                return (
                  <article className="cart-item" key={item.id}>
                    <img
                      src={item.product?.image || "https://via.placeholder.com/120"}
                      alt={item.product?.name || "Product"}
                    />

                    <div className="cart-item-details">
                      <p>{item.product?.name || "Product unavailable"}</p>
                      <span>Rs.{price.toFixed(2)}</span>
                    </div>

                    <div className="quantity-control" aria-label="Quantity controls">
                      <button
                        onClick={() => updateQty(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      >
                        -
                      </button>
                      <strong>{item.quantity}</strong>
                      <button onClick={() => updateQty(item.id, item.quantity + 1)}>
                        +
                      </button>
                    </div>

                    <strong className="line-total">Rs.{subtotalLine.toFixed(2)}</strong>

                    <button className="remove-btn" onClick={() => removeItem(item.id)}>
                      Remove
                    </button>
                  </article>
                );
              })}
            </div>
          )}
        </div>

        <aside className="order-summary">
          <p className="cart-label">Order Summary</p>
          <h2>Checkout Details</h2>

          <div className="summary-row">
            <span>Subtotal</span>
            <strong>Rs.{subtotal.toFixed(2)}</strong>
          </div>
          <div className="summary-row">
            <span>Delivery</span>
            <strong>{delivery === 0 ? "Free" : `Rs.${delivery.toFixed(2)}`}</strong>
          </div>
          <div className="summary-row">
            <span>Offer Discount</span>
            <strong>- Rs.{discount.toFixed(2)}</strong>
          </div>
          <div className="summary-total">
            <span>Total</span>
            <strong>Rs.{total.toFixed(2)}</strong>
          </div>

          <button
            className="checkout-btn"
            disabled={!items.length}
            onClick={() => alert("Checkout flow will be added next")}
          >
            Checkout
          </button>

          <p className="summary-note">
            Orders above Rs.999 get free delivery and FLOW10 savings.
          </p>
        </aside>
      </section>
    </main>
  );
}
