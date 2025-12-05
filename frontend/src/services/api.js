const API_BASE_URL = "http://ecommerce.local";

export async function fetchProducts() {
  const response = await fetch(`${API_BASE_URL}/api/products`);
  if (!response.ok) throw new Error("Failed to fetch products");
  return response.json();
}

export async function createSupportTicket(payload) {
  const response = await fetch(`${API_BASE_URL}/api/support/create`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) throw new Error("Failed to create support ticket");
  return response.json();
}

