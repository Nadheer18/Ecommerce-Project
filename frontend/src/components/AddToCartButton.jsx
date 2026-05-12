import React from "react";
import API from "../api";

export default function AddToCartButton({ productId }) {
  const addToCart = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      localStorage.setItem("redirectAfterLogin", window.location.pathname);
      alert("Please login or create an account to add items to cart.");
      window.location.href = "/login";
      return;
    }

    try {
      await API.post("/cart", { productId, quantity: 1 });
      alert("Item added to cart!");
      window.dispatchEvent(new CustomEvent("cartUpdated"));
    } catch (error) {
      console.error("Add to cart failed", error);
      alert("Failed to add item to cart");
    }
  };

  return (
    <button onClick={addToCart} className="add-cart-btn">
      Add to Cart
    </button>
  );
}

