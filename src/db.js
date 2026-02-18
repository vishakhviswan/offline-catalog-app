const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "") ||
  "https://offline-catalog-backend-production.up.railway.app";

async function requestJson(path, options = {}) {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API request failed (${res.status}): ${text}`);
  }

  if (res.status === 204) return null;
  const text = await res.text();
  return text ? JSON.parse(text) : null;
}

function asArray(payload, key) {
  if (Array.isArray(payload)) return payload;
  if (!payload || typeof payload !== "object") return [];
  if (Array.isArray(payload[key])) return payload[key];
  if (Array.isArray(payload.data)) return payload.data;
  if (Array.isArray(payload.items)) return payload.items;
  return [];
}

function normalizeCategory(c) {
  return {
    id: String(c.id ?? c._id ?? c.category_id ?? c.value ?? ""),
    name: c.name ?? c.category_name ?? c.label ?? "Unknown",
  };
}

function normalizeProduct(p) {
  const units = Array.isArray(p.units) && p.units.length
    ? p.units.map((u) => ({
        name: u.name ?? u.unit_name ?? "Piece",
        multiplier: Number(u.multiplier ?? u.value ?? 1),
      }))
    : [{
        name: p.unit_name ?? p.unit ?? "Piece",
        multiplier: Number(p.unit_multiplier ?? 1),
      }];

  return {
    id: p.id ?? p._id ?? p.product_id,
    name: p.name ?? p.product_name ?? "Unnamed",
    price: Number(p.price ?? p.base_price ?? 0),
    categoryId: String(p.categoryId ?? p.category_id ?? p.category ?? ""),
    image: p.image ?? p.image_url ?? null,
    units,
  };
}

function normalizeOrder(o) {
  return {
    id: o.id ?? o._id ?? Date.now(),
    customer: o.customer ?? o.customer_name ?? "Unknown",
    date: o.date ?? o.created_at ?? new Date().toISOString(),
    items: o.items ?? o.order_items ?? [],
    total: Number(o.total ?? o.grand_total ?? 0),
  };
}

function normalizeCustomer(c) {
  return {
    id: c.id ?? c._id ?? Date.now(),
    name: c.name ?? c.customer_name ?? "Unknown",
  };
}

export async function loadProducts() {
  const payload = await requestJson("/api/products");
  return asArray(payload, "products").map(normalizeProduct);
}

export async function loadCategories() {
  const payload = await requestJson("/api/categories");
  return asArray(payload, "categories").map(normalizeCategory);
}

export async function loadOrders() {
  const payload = await requestJson("/api/orders");
  return asArray(payload, "orders").map(normalizeOrder);
}

export async function loadCustomers() {
  const payload = await requestJson("/api/customers");
  return asArray(payload, "customers").map(normalizeCustomer);
}

export async function saveOrders(order) {
  if (!order) return null;
  return await requestJson("/api/orders", {
    method: "POST",
    body: JSON.stringify(order),
  });
}

// Not supported by the current Railway API contract.
export async function saveProducts() { return null; }
export async function saveCategories() { return null; }
export async function saveCustomers() { return null; }
export async function loadUnits() { return []; }
export async function saveUnits() { return null; }
