import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api";
import speakerImg from "../assets/images/speaker.jpg";
import smartwatchImg from "../assets/images/smartwatch.jpg";
import mouseImg from "../assets/images/mouse.jpg";
import headphonesImg from "../assets/images/headphones.jpg";
import "./Home.css";

const fallbackProducts = [
  {
    id: "demo-1",
    name: "Wireless Premium Headphones",
    category: "Electronics",
    price: 1299,
    oldPrice: 2499,
    image: headphonesImg,
    badge: "Bestseller",
    discount: "48% OFF",
    rating: 4.8,
    reviews: "1.3K"
  },
  {
    id: "demo-2",
    name: "Smart Fitness Watch",
    category: "Wearables",
    price: 1549,
    oldPrice: 2999,
    image: smartwatchImg,
    badge: "Bestseller",
    discount: "46% OFF",
    rating: 4.7,
    reviews: "1.6K"
  },
  {
    id: "demo-3",
    name: "Portable Bluetooth Speaker",
    category: "Audio",
    price: 799,
    oldPrice: 1499,
    image: speakerImg,
    badge: "Sale",
    discount: "47% OFF",
    rating: 4.6,
    reviews: "856"
  },
  {
    id: "demo-4",
    name: "Ergonomic Wireless Mouse",
    category: "Accessories",
    price: 449,
    oldPrice: 899,
    image: mouseImg,
    badge: "New",
    discount: "50% OFF",
    rating: 4.5,
    reviews: "1.1K"
  },
  {
    id: "demo-5",
    name: "Noise Cancelling Audio Set",
    category: "Audio",
    price: 999,
    oldPrice: 1899,
    image: headphonesImg,
    badge: "Bestseller",
    discount: "47% OFF",
    rating: 4.8,
    reviews: "998"
  },
  {
    id: "demo-6",
    name: "Gold Edition Smart Watch",
    category: "Wearables",
    price: 2099,
    oldPrice: 3499,
    image: smartwatchImg,
    badge: "Limited",
    discount: "40% OFF",
    rating: 4.9,
    reviews: "2.2K"
  },
  {
    id: "demo-7",
    name: "Compact Work Desk Mouse",
    category: "Accessories",
    price: 349,
    oldPrice: 699,
    image: mouseImg,
    badge: "Sale",
    discount: "50% OFF",
    rating: 4.6,
    reviews: "645"
  },
  {
    id: "demo-8",
    name: "Mini Travel Speaker",
    category: "Electronics",
    price: 649,
    oldPrice: 1199,
    image: speakerImg,
    badge: "New",
    discount: "45% OFF",
    rating: 4.4,
    reviews: "521"
  }
];

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
    const source = products.length ? products : fallbackProducts;
    const searched = source.filter((product) => {
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

    if (String(product.id).startsWith("demo-")) {
      alert("Demo product preview. Real products can be added after backend products are connected.");
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
          <div className="store-status">
            No products found. Try another category or search term.
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
