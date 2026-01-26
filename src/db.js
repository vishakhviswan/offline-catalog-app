import { openDB } from "idb";

export const dbPromise = openDB("catalog-db", 1, {
  upgrade(db) {
    // ✅ ORDERS (important)
    if (!db.objectStoreNames.contains("orders")) {
      db.createObjectStore("orders", { keyPath: "id" });
    }

    // ⚡ OPTIONAL: product cache (offline)
    if (!db.objectStoreNames.contains("products_cache")) {
      db.createObjectStore("products_cache");
    }
  },
});

/* ================= ORDERS ================= */

// Mistake orders / local orders
export async function saveOrders(orders) {
  const db = await dbPromise;
  const tx = db.transaction("orders", "readwrite");
  const store = tx.objectStore("orders");

  await store.clear();
  for (const o of orders) {
    await store.put(o);
  }

  await tx.done;
}

export async function loadOrders() {
  const db = await dbPromise;
  return await db.getAll("orders");
}

/* ================= PRODUCTS CACHE (OPTIONAL) ================= */

export async function saveProductsCache(products) {
  const db = await dbPromise;
  await db.put("products_cache", products, "list");
}

export async function loadProductsCache() {
  const db = await dbPromise;
  return (await db.get("products_cache", "list")) || [];
}
