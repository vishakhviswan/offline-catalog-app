import { useEffect, useMemo, useRef } from "react";
import ProductCard from "../components/ProductCard";

export default function Catalog({
  categories,
  selectedCategory,
  setSelectedCategory,
  products,
  cart,
  addToCart,
  increaseQty,
  decreaseQty,
  search,
  setSearch,
  layoutMode,
  setLayoutMode,
  showOutOfStock,
  setShowOutOfStock,
  mostSellingOnly,
  setMostSellingOnly,
}) {
  const scrollRef = useRef(null);

  /* ================= DEFAULT CATEGORY = ALL ================= */

  useEffect(() => {
    if (!selectedCategory) {
      setSelectedCategory("all");
    }
  }, [selectedCategory, setSelectedCategory]);

  /* ================= CATEGORY LIST WITH ALL ================= */

 const orderedCategories = useMemo(() => {
   const base = [{ id: "all", name: "All" }, ...categories];

   if (!selectedCategory || selectedCategory === "all") {
     return base;
   }

   const selected = base.find((c) => c.id === selectedCategory);
   const others = base.filter(
     (c) => c.id !== selectedCategory && c.id !== "all",
   );

   return [{ id: "all", name: "All" }, selected, ...others].filter(Boolean);
 }, [categories, selectedCategory]);

  /* ================= SCROLL SELECTED INTO VIEW ================= */

  useEffect(() => {
    if (!scrollRef.current) return;
    const activeBtn = scrollRef.current.querySelector(
      `[data-id="${selectedCategory}"]`,
    );
    if (activeBtn) {
      activeBtn.scrollIntoView({
        behavior: "smooth",
        inline: "start",
        block: "nearest",
      });
    }
  }, [selectedCategory]);

  /* ================= FILTER ================= */

  const normalizedSearch = (search || "").toLowerCase();

  const filteredProducts = useMemo(() => {
    return products
      .filter((p) =>
        selectedCategory === "all" ? true : p.category_id === selectedCategory,
      )
      .filter((p) => p.name.toLowerCase().includes(normalizedSearch))
      .filter((p) => {
        if (showOutOfStock) return true;
        return !(
          p.out_of_stock === true ||
          p.stock === 0 ||
          p.availability === false
        );
      })
      .filter((p) =>
        mostSellingOnly
          ? p.most_selling === true || p.is_most_selling === true
          : true,
      );
  }, [
    products,
    selectedCategory,
    normalizedSearch,
    showOutOfStock,
    mostSellingOnly,
  ]);

  const gridTemplateColumns =
    layoutMode === "compact"
      ? "repeat(auto-fill, minmax(130px, 1fr))"
      : "repeat(auto-fill, minmax(170px, 1fr))";

  /* ================= RENDER ================= */

  return (
    <div style={{ padding: 16, maxWidth: 1200, margin: "0 auto" }}>
      <h2 style={{ marginBottom: 10 }}>Product Categories</h2>

      {/* ===== CATEGORY PILLS ===== */}
      <div
        ref={scrollRef}
        style={{
          display: "flex",
          gap: 10,
          overflowX: "auto",
          paddingBottom: 6,
          marginBottom: 14,
          scrollbarWidth: "none",
          WebkitOverflowScrolling: "touch",
          scrollBehavior:"smooth",
        }}
      >
        {orderedCategories.map((c) => {
          const active = selectedCategory === c.id;

          return (
            <button
              key={c.id}
              data-id={c.id}
              onClick={() => setSelectedCategory(c.id)}
              style={{
                padding: "8px 16px",
                borderRadius: 999,
                border: active ? "none" : "1px solid #e5e7eb",
                background: active ? "#2563eb" : "#f9fafb",
                color: active ? "#fff" : "#111",
                fontWeight: 600,
                fontSize:14,
                whiteSpace: "nowrap",
                cursor: "pointer",
                transition: "all 0.2s ease",
                transform: active ? "scale(1.05)" : "scale(1)",
                boxShadow:active?"0 4px 14px rgba(37,99,235,0.3)":"none",
                
              }}
            >
              {c.name}
            </button>
          );
        })}
      </div>

      {/* ===== SEARCH + FILTERS ===== */}
      <div style={{ display: "grid", gap: 8, marginBottom: 12 }}>
        <input
          placeholder="🔍 Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: "100%",
            padding: 10,
            borderRadius: 8,
            border: "1px solid #d1d5db",
          }}
        />

        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <label style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <input
              type="checkbox"
              checked={mostSellingOnly}
              onChange={(e) => setMostSellingOnly(e.target.checked)}
            />
            Most selling only
          </label>

          <label style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <input
              type="checkbox"
              checked={showOutOfStock}
              onChange={(e) => setShowOutOfStock(e.target.checked)}
            />
            Show out of stock
          </label>

          <div style={{ display: "flex", gap: 6 }}>
            <button
              onClick={() => setLayoutMode("grid")}
              style={layoutMode === "grid" ? activeModeBtn : modeBtn}
            >
              Grid
            </button>
            <button
              onClick={() => setLayoutMode("compact")}
              style={layoutMode === "compact" ? activeModeBtn : modeBtn}
            >
              Compact
            </button>
          </div>
        </div>
      </div>

      <h3 style={{ marginBottom: 10 }}>Products ({filteredProducts.length})</h3>

      {/* ===== PRODUCT GRID ===== */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns,
          gap: 14,
          paddingBottom: 80,
        }}
      >
        {filteredProducts.map((product) => {
          const cartItem = cart.find((c) => c.productId === product.id);

          return (
            <ProductCard
              key={product.id}
              product={product}
              cartItem={cartItem}
              layoutMode={layoutMode}
              onAddToCart={addToCart}
              onIncreaseQty={increaseQty}
              onDecreaseQty={decreaseQty}
            />
          );
        })}
      </div>
    </div>
  );
}

const modeBtn = {
  border: "1px solid #d1d5db",
  background: "#fff",
  borderRadius: 8,
  padding: "6px 10px",
  fontWeight: 500,
};

const activeModeBtn = {
  ...modeBtn,
  border: "1px solid #2563eb",
  color: "#2563eb",
  fontWeight: 700,
};
