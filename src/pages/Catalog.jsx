import { useState, useMemo } from "react";
import CategorySelectModal from "../components/CategorySelectModal";
import ProductCard from "../components/ProductCard";

export default function Catalog({
  categories = [],
  selectedCategory,
  setSelectedCategory,
  products = [],
  setViewProduct,
  cart = [],
  addToCart,
  increaseQty,
  decreaseQty,
  search = "",
  orders = [],
  customerName = "",
}) {
  const [catOpen, setCatOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  /* ================= SAFE PRODUCTS ================= */
  const safeProducts = useMemo(() => {
    return Array.isArray(products)
      ? products.filter(
          (p) =>
            p &&
            typeof p === "object" &&
            typeof p.name === "string" &&
            typeof p.price === "number",
        )
      : [];
  }, [products]);

  /* ================= CUSTOMER PREVIOUS PRODUCTS ================= */
  const customerProducts = useMemo(() => {
    if (!customerName || !orders.length) return [];

    const map = new Map();

    orders
      .filter((o) => o.customer_name === customerName)
      .forEach((order) => {
        (order.order_items || []).forEach((it) => {
          const prod = safeProducts.find((p) => p.id === it.product_id);
          if (prod && !map.has(prod.id)) {
            map.set(prod.id, prod);
          }
        });
      });

    return Array.from(map.values());
  }, [orders, customerName, safeProducts]);

  /* ================= MOST SELLING (FRONTEND ANALYTICS) ================= */
  const mostSellingProducts = useMemo(() => {
    if (!orders.length) return [];

    const count = {};

    orders.forEach((o) => {
      (o.order_items || []).forEach((it) => {
        count[it.product_id] =
          (count[it.product_id] || 0) + Number(it.qty || 0);
      });
    });

    return safeProducts
      .map((p) => ({
        ...p,
        sold_qty: count[p.id] || 0,
      }))
      .filter((p) => p.sold_qty > 0)
      .sort((a, b) => b.sold_qty - a.sold_qty)
      .slice(0, 8);
  }, [orders, safeProducts]);

  /* ================= FILTER ================= */
  const filteredProducts = useMemo(() => {
    const q = search?.toLowerCase() || "";
    return safeProducts
      .filter((p) =>
        selectedCategory === "all"
          ? true
          : (p.category_id || p.categoryId) === selectedCategory,
      )
      .filter((p) => p.name.toLowerCase().includes(q));
  }, [safeProducts, selectedCategory, search]);

  const getSelectedCategoryName = () => {
    if (selectedCategory === "all") return "All Categories";
    const cat = categories.find((c) => c.id === selectedCategory);
    return cat?.name || "All Categories";
  };

  const isOutOfStock = (p) =>
    Number(p.stock || 0) === 0 || p.availability === false;

  const findCartItem = (id) => cart.find((c) => c.productId === id);

  return (
    <div style={page}>
      {/* SEARCH BAR */}
      <div style={{ marginBottom: 12 }}>
        {!showSearch ? (
          <button
            onClick={() => setShowSearch(true)}
            style={{
              padding: 8,
              borderRadius: 8,
              border: "1px solid #e5e7eb",
              background: "#fff",
              cursor: "pointer",
            }}
          >
            🔍 Search products
          </button>
        ) : (
          <div style={{ display: "flex", gap: 8 }}>
            <input
              autoFocus
              placeholder="Search product name…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                flex: 1,
                padding: "10px 12px",
                borderRadius: 10,
                border: "1px solid #d1d5db",
              }}
            />
            <button
              onClick={() => setShowSearch(false)}
              style={{
                padding: "0 12px",
                borderRadius: 10,
                border: "none",
                background: "#ef4444",
                color: "#fff",
                fontWeight: 700,
              }}
            >
              ✕
            </button>
          </div>
        )}
      </div>
      <h2 style={heading}>Product Categories</h2>

      {/* CATEGORY BAR */}
      <div style={categoryBar}>
        <button style={allBtn} onClick={() => setCatOpen(true)}>
          📂 {getSelectedCategoryName()}
        </button>

        {categories.slice(0, 6).map((c) => (
          <CategoryChip
            key={c.id}
            active={selectedCategory === c.id}
            onClick={() => setSelectedCategory(c.id)}
          >
            {c.name}
          </CategoryChip>
        ))}
      </div>

      {/* ================= CUSTOMER PREVIOUS ================= */}
      {customerName && customerProducts.length > 0 && (
        <>
          <h3 style={rowTitle}>
            🔁 Previously ordered by <b>{customerName}</b>
          </h3>

          <div style={horizontalRow}>
            {customerProducts.map((p) => (
              <div key={p.id} style={{ minWidth: 160 }}>
                <ProductCard
                  product={p}
                  cartItem={findCartItem(p.id)}
                  out={isOutOfStock(p)}
                  onView={setViewProduct}
                  onAdd={addToCart}
                  onInc={increaseQty}
                  onDec={decreaseQty}
                />
              </div>
            ))}
          </div>
        </>
      )}

      {/* ================= MOST SELLING ================= */}
      {mostSellingProducts.length > 0 && (
        <>
          <h3 style={sectionTitle}>🔥 Most Selling</h3>

          <div style={horizontalRow}>
            {mostSellingProducts.map((p) => (
              <div key={p.id} style={{ minWidth: 160 }}>
                <ProductCard
                  product={p}
                  compact
                  cartItem={findCartItem(p.id)}
                  out={isOutOfStock(p)}
                  onView={setViewProduct}
                  onAdd={addToCart}
                  onInc={increaseQty}
                  onDec={decreaseQty}
                />
              </div>
            ))}
          </div>
        </>
      )}

      {/* ================= GRID ================= */}
      <h3 style={subHeading}>Products ({filteredProducts.length})</h3>

      {filteredProducts.length === 0 && (
        <p style={emptyTxt}>No products found</p>
      )}

      <div style={grid}>
        {filteredProducts.map((p) => (
          <ProductCard
            key={p.id}
            product={p}
            cartItem={findCartItem(p.id)}
            out={isOutOfStock(p)}
            onView={setViewProduct}
            onAdd={addToCart}
            onInc={increaseQty}
            onDec={decreaseQty}
          />
        ))}
      </div>

      {/* CATEGORY MODAL */}
      <CategorySelectModal
        open={catOpen}
        onClose={() => setCatOpen(false)}
        categories={categories}
        selected={selectedCategory}
        onSelect={(id) => {
          setSelectedCategory(id);
          setCatOpen(false);
        }}
      />
    </div>
  );
}

/* ================= CHIP ================= */

function CategoryChip({ active, children, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "10px 16px",
        borderRadius: 999,
        border: "none",
        fontSize: 14,
        cursor: "pointer",
        background: active ? "#2563eb" : "#fff",
        color: active ? "#fff" : "#111827",
        boxShadow: "0 1px 3px rgba(0,0,0,0.15)",
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </button>
  );
}

/* ================= STYLES ================= */

const page = { padding: 16, maxWidth: 1200, margin: "0 auto" };
const heading = { marginBottom: 8, fontSize: 20, fontWeight: 800 };
const subHeading = { margin: "14px 0", fontSize: 16, fontWeight: 700 };
const categoryBar = {
  display: "flex",
  gap: 8,
  overflowX: "auto",
  paddingBottom: 10,
};
const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill,minmax(160px,1fr))",
  gap: 16,
  paddingBottom: 90,
};
const emptyTxt = { color: "#6b7280", fontSize: 14 };
const allBtn = {
  padding: "10px 16px",
  borderRadius: 999,
  border: "none",
  background: "#111827",
  color: "#fff",
  fontWeight: 700,
};
const sectionTitle = { margin: "18px 0 10px", fontSize: 16, fontWeight: 800 };
const rowTitle = { margin: "16px 0 8px", fontSize: 16, fontWeight: 800 };
const horizontalRow = {
  display: "flex",
  gap: 12,
  overflowX: "auto",
  paddingBottom: 12,
};
