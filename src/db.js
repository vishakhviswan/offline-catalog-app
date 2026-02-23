import { openDB } from "idb";

const DB_NAME = "catalog-db";
const DB_VERSION = 6;

const STORES = {
  products: "products_cache",
  categories: "categories_cache",
  customers: "customers_cache",
  orders: "orders_cache",
  meta: "meta_cache",
  outbox: "outbox_queue",
};

export const dbPromise = openDB(DB_NAME, DB_VERSION, {
  upgrade(db) {
    Object.values(STORES).forEach((storeName) => {
      if (!db.objectStoreNames.contains(storeName)) {
        db.createObjectStore(storeName);
      }
    });
  },
});

async function saveList(storeName, list = []) {
  const db = await dbPromise;
  await db.put(storeName, Array.isArray(list) ? list : [], "list");
}

async function loadList(storeName) {
  const db = await dbPromise;
  return (await db.get(storeName, "list")) || [];
}

async function saveUpdatedAt(storeName, timestamp = Date.now()) {
  const db = await dbPromise;
  await db.put(STORES.meta, timestamp, `${storeName}:updatedAt`);
}

export async function getUpdatedAt(storeName) {
  const db = await dbPromise;
  return (await db.get(STORES.meta, `${storeName}:updatedAt`)) || 0;
}

export async function saveProductsCache(products = []) {
  await saveList(STORES.products, products);
  await saveUpdatedAt(STORES.products);
}

export async function loadProductsCache() {
  return loadList(STORES.products);
}

export async function saveCategoriesCache(categories = []) {
  await saveList(STORES.categories, categories);
  await saveUpdatedAt(STORES.categories);
}

export async function loadCategoriesCache() {
  return loadList(STORES.categories);
}

export async function saveCustomersCache(customers = []) {
  await saveList(STORES.customers, customers);
  await saveUpdatedAt(STORES.customers);
}

export async function loadCustomersCache() {
  return loadList(STORES.customers);
}

export async function saveOrdersCache(orders = []) {
  await saveList(STORES.orders, orders);
  await saveUpdatedAt(STORES.orders);
}

export async function loadOrdersCache() {
  return loadList(STORES.orders);
}

export async function enqueueOutbox(item) {
  const db = await dbPromise;
  const queue = (await db.get(STORES.outbox, "queue")) || [];
  queue.push({ ...item, queuedAt: Date.now() });
  await db.put(STORES.outbox, queue, "queue");
}

export async function loadOutbox() {
  const db = await dbPromise;
  return (await db.get(STORES.outbox, "queue")) || [];
}

export async function clearOutbox() {
  const db = await dbPromise;
  await db.put(STORES.outbox, [], "queue");
}
