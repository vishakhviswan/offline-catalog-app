import { openDB } from "idb";

/**
 * IMPORTANT
 * - Version MUST increase if structure changes
 * - Orders are NOT stored locally anymore
 */
export const dbPromise = openDB("catalog-db", 5, {
  upgrade(db, oldVersion) {
    console.log("Upgrading DB from version", oldVersion);

    /* ================= PRODUCTS CACHE ================= */
    if (!db.objectStoreNames.contains("products_cache")) {
      db.createObjectStore("products_cache");
    }
  },
});

/* ================= PRODUCTS CACHE ================= */
/* (Optional – offline / speed optimization) */

export async function saveProductsCache(products = []) {
  const db = await dbPromise;
  await db.put("products_cache", products, "list");
}

export async function loadProductsCache() {
  const db = await dbPromise;
  return (await db.get("products_cache", "list")) || [];
}
