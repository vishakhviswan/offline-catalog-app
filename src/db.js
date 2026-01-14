import { openDB } from "idb";

export const dbPromise = openDB("catalog-db", 3, {
  upgrade(db) {

    // ---------- CATEGORIES ----------
    if (!db.objectStoreNames.contains("categories")) {
      db.createObjectStore("categories");
    }

    // ---------- PRODUCTS ----------
    if (!db.objectStoreNames.contains("products")) {
      db.createObjectStore("products");
    }

    // ---------- ORDERS ----------
    if (!db.objectStoreNames.contains("orders")) {
      db.createObjectStore("orders", { keyPath: "id" });
    }

    // ---------- CUSTOMERS ----------
    if (!db.objectStoreNames.contains("customers")) {
      db.createObjectStore("customers");
    }

    // ---------- UNITS ----------
    if (!db.objectStoreNames.contains("units")) {
      db.createObjectStore("units");
    }
  },
});

/* ================= CATEGORIES ================= */

export async function saveCategories(categories) {
  const db = await dbPromise;
  await db.put("categories", categories, "list");
}

export async function loadCategories() {
  const db = await dbPromise;
  return (await db.get("categories", "list")) || [];
}

/* ================= PRODUCTS ================= */

export async function saveProducts(products) {
  const db = await dbPromise;
  await db.put("products", products, "list");
}

export async function loadProducts() {
  const db = await dbPromise;
  return (await db.get("products", "list")) || [];
}

/* ================= ORDERS ================= */

export async function saveOrders(orders) {
  const db = await dbPromise;
  const tx = db.transaction("orders", "readwrite");
  const store = tx.objectStore("orders");

  await store.clear(); // ✅ important
  for (const o of orders) {
    await store.put(o);
  }

  await tx.done;
}

export async function loadOrders() {
  const db = await dbPromise;
  return await db.getAll("orders");
}

// ---------- CUSTOMERS ----------
export async function saveCustomers(customers) {
  const db = await dbPromise;
  await db.put("customers", customers, "list");
}

export async function loadCustomers() {
  const db = await dbPromise;
  return (await db.get("customers", "list")) || [];
}

// ---------- UNITS ----------
export async function saveUnits(units) {
  const db = await dbPromise;
  await db.put("units", units, "list");
}

export async function loadUnits() {
  const db = await dbPromise;
  return (await db.get("units", "list")) || [];
}

