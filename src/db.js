const API_BASE_URL = "https://offline-catalog-backend-production.up.railway.app";

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
  return await res.json();
}

export async function loadProducts() {
  return (await requestJson("/api/products")) || [];
}

export async function loadCategories() {
  return (await requestJson("/api/categories")) || [];
}

export async function loadOrders() {
  return (await requestJson("/api/orders")) || [];
}

export async function loadCustomers() {
  return (await requestJson("/api/customers")) || [];
}

export async function saveOrders(order) {
  if (!order) return null;

  return await requestJson("/api/orders", {
    method: "POST",
    body: JSON.stringify(order),
  });
}

// Not supported by the Railway API contract yet.
export async function saveProducts() {
  return null;
}

export async function saveCategories() {
  return null;
}

export async function saveCustomers() {
  return null;
}

export async function loadUnits() {
  return [];
}

export async function saveUnits() {
  return null;
}
