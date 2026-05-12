import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api";
import "./Home.css";

const categories = [
  { label: "Crazy Deals", value: "all" },
  { label: "Shop All", value: "all" },
  { label: "Bestsellers", value: "bestseller" },
  { label: "Electronics", value: "Electronics" },
  { label: "Audio", value: "Audio" },
  { label: "Wearables", value: "Wearables" },
  { label: "Accessories", value: "Accessories" },
  { label: "Gifting", value: "all" }
];

function Home() {
  const [username, setUsername] = useState("");
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortMode, setSortMode] = useState("featured");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const isLoggedIn = Boolean(localStorage.getItem("token"));

  useEffect(() => {
    const storedUser = localStorage.getItem("username");
    setUsername(storedUser || "Guest");

    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        const normalized = Array.isArray(data)
          ? data.map((product, index) => ({
              ...product,
              category: product.category || inferCategory(product.name),
              oldPrice: product.oldPrice || Math.round(Number(product.price || 0) * 1.65),
              badge: index % 3 === 0 ? "Bestseller" : index % 3 === 1 ? "Sale" : "New",
              discount: product.discount || `${30 + (index % 4) * 7}% OFF`,
              rating: product.rating || (4.5 + (index % 4) * 0.1).toFixed(1),
              reviews: product.reviews || `${500 + index * 187}`
            }))
          : [];

        setProducts(normalized);
      })
      .catch((err) => console.error("Error fetching products:", err))
      .finally(() => setIsLoading(false));

    loadCartCount();
  }, []);

  const displayedProducts = useMemo(() => {
    const searched = products.filter((product) => {
      const matchesSearch = product.name?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === "all" ||
        product.category === selectedCategory ||
        (selectedCategory === "bestseller" && product.badge?.toLowerCase() === "bestseller");

      return matchesSearch && matchesCategory;
    });

    return [...searched].sort((a, b) => {
      if (sortMode === "price-low") return Number(a.price) - Number(b.price);
      if (sortMode === "price-high") return Number(b.price) - Number(a.price);
      if (sortMode === "rating") return Number(b.rating || 0) - Number(a.rating || 0);
      return 0;
    });
  }, [products, searchQuery, selectedCategory, sortMode]);

  const loadCartCount = async () => {
    try {
      const res = await API.get("/cart");
      const items = res.data?.items || [];
      const total = items.reduce((sum, item) => sum + Number(item.quantity || 0), 0);
      setCartCount(total);
    } catch (error) {
      setCartCount(0);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    window.location.href = "/login";
  };

  const requireLogin = () => {
    localStorage.setItem("redirectAfterLogin", window.location.pathname);
    alert("Please login or create an account to continue.");
    window.location.href = "/login";
  };

  const openCart = (e) => {
    if (!isLoggedIn) {
      e.preventDefault();
      requireLogin();
    }
  };

  const addToCart = async (product) => {
    if (!isLoggedIn) {
      requireLogin();
      return;
    }

    try {
      await API.post("/cart", { productId: product.id, quantity: 1 });
      window.dispatchEvent(new CustomEvent("cartUpdated"));
      loadCartCount();
      alert("Item added to cart!");
    } catch (error) {
      console.error("Add to cart failed", error);
      alert("Failed to add item to cart");
    }
  };

  return (
    <main className="storefront-page">
      <div className="deal-bar">
        <span>Free delivery on orders above Rs.999</span>
        <span>Use code FLOW10 for extra savings</span>
      </div>

      <header className="store-header">
        <label className="store-search">
          <span>Search</span>
          <input
            type="search"
            placeholder="Search for products"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </label>

        <Link to="/home" className="store-logo">
          FLOWMART
        </Link>

        <div className="store-actions">
          <span className="user-pill">Hi, {username}</span>
          <Link to="/cart" aria-label="Cart" className="header-icon-button" onClick={openCart}>
            Cart ({cartCount})
          </Link>
          {isLoggedIn ? (
            <button className="header-icon-button logout-link" type="button" onClick={handleLogout}>
              Logout
            </button>
          ) : (
            <Link to="/login" className="header-icon-button">
              Login
            </Link>
          )}
        </div>
      </header>

      <nav className="store-nav" aria-label="Store categories">
        {categories.map((category) => (
          <button
            className={selectedCategory === category.value ? "active" : ""}
            key={`${category.label}-${category.value}`}
            type="button"
            onClick={() => setSelectedCategory(category.value)}
          >
            {category.label}
          </button>
        ))}
      </nav>

      <section className="storefront-content">
        <div className="listing-title">
          <h1>Bestsellers</h1>
          <p>{displayedProducts.length} products</p>
        </div>

        <div className="listing-toolbar">
          <button
            className={`filter-button ${showFilters ? "active" : ""}`}
            type="button"
            onClick={() => setShowFilters((value) => !value)}
          >
            Filter
          </button>

          <select
            className="sort-select"
            value={sortMode}
            onChange={(e) => setSortMode(e.target.value)}
            aria-label="Sort products"
          >
            <option value="featured">Sort by featured</option>
            <option value="price-low">Price: low to high</option>
            <option value="price-high">Price: high to low</option>
            <option value="rating">Highest rated</option>
          </select>
        </div>

        {showFilters && (
          <div className="filter-panel">
            <button
              className={selectedCategory === "all" ? "active" : ""}
              type="button"
              onClick={() => setSelectedCategory("all")}
            >
              All
            </button>
            <button
              className={selectedCategory === "bestseller" ? "active" : ""}
              type="button"
              onClick={() => setSelectedCategory("bestseller")}
            >
              Bestsellers
            </button>
            <button
              className={selectedCategory === "Electronics" ? "active" : ""}
              type="button"
              onClick={() => setSelectedCategory("Electronics")}
            >
              Electronics
            </button>
            <button
              className={selectedCategory === "Audio" ? "active" : ""}
              type="button"
              onClick={() => setSelectedCategory("Audio")}
            >
              Audio
            </button>
            <button
              className={selectedCategory === "Wearables" ? "active" : ""}
              type="button"
              onClick={() => setSelectedCategory("Wearables")}
            >
              Wearables
            </button>
            <button
              className={selectedCategory === "Accessories" ? "active" : ""}
              type="button"
              onClick={() => setSelectedCategory("Accessories")}
            >
              Accessories
            </button>
          </div>
        )}

        {isLoading ? (
          <div className="store-status">Loading products...</div>
        ) : displayedProducts.length === 0 ? (
          <div className="store-status empty-store">
            <h2>No products available</h2>
            <p>Add products from the admin product page and they will appear here.</p>
            <Link to="/admin/products">Go to product manager</Link>
          </div>
        ) : (
          <div className="store-product-grid">
            {displayedProducts.map((product) => (
              <article className="store-product-card" key={product.id}>
                <div className="product-media">
                  {product.badge && <span className="product-badge">{product.badge}</span>}
                  <img
                    src={product.image || "https://via.placeholder.com/360x360?text=Product"}
                    alt={product.name}
                  />
                  {product.discount && <span className="discount-badge">{product.discount}</span>}
                </div>

                <div className="product-info">
                  <p className="product-category">{product.category || "Product"}</p>
                  <h2>{product.name}</h2>
                  <div className="rating-row">
                    <span className="star">*</span>
                    <strong>{product.rating || "4.6"}</strong>
                    <span>({product.reviews || "500"} Reviews)</span>
                  </div>
                  <div className="price-row">
                    <strong>Rs.{Number(product.price || 0).toFixed(2)}</strong>
                    {product.oldPrice > product.price && (
                      <span>Rs.{Number(product.oldPrice).toFixed(2)}</span>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  className="product-action"
                  onClick={() => addToCart(product)}
                >
                  Add to Cart
                </button>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

function inferCategory(name = "") {
  const value = name.toLowerCase();
  if (value.includes("watch")) return "Wearables";
  if (value.includes("speaker") || value.includes("headphone")) return "Audio";
  if (value.includes("mouse") || value.includes("keyboard")) return "Accessories";
  return "Electronics";
}

export default Home;
