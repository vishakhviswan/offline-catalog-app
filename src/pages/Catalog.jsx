import { useEffect, useMemo } from "react";
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
  useEffect(() => {
    if (!selectedCategory && categories.length > 0) {
      setSelectedCategory(categories[0].id);
    }
  }, [categories, selectedCategory, setSelectedCategory]);

  useEffect(() => {
    const savedY = sessionStorage.getItem("catalog-scroll");
    if (!savedY) return;
    requestAnimationFrame(() => {
      window.scrollTo({ top: Number(savedY), behavior: "instant" });
      sessionStorage.removeItem("catalog-scroll");
    });
  }, []);

  const normalizedSearch = search.toLowerCase();

  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => (selectedCategory ? p.categoryId === selectedCategory : true))
      .filter((p) => p.name.toLowerCase().includes(normalizedSearch))
      .filter((p) => {
        if (showOutOfStock) return true;
        return !(
          p.out_of_stock === true ||
          p.stock === 0 ||
          p.available === false
        );
      })
      .filter((p) => (mostSellingOnly ? p.most_selling === true || p.is_most_selling === true : true));
  }, [products, selectedCategory, normalizedSearch, showOutOfStock, mostSellingOnly]);

  const gridTemplateColumns =
    layoutMode === "compact"
      ? "repeat(auto-fill, minmax(130px, 1fr))"
      : "repeat(auto-fill, minmax(170px, 1fr))";

  return (
    <div style={{ padding: 16, maxWidth: 1200, margin: "0 auto" }}>
      <h2 style={{ marginBottom: 10 }}>Product Categories</h2>

      <div style={{ marginBottom: 12, display: "flex", flexWrap: "wrap" }}>
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => setSelectedCategory(c.id)}
            style={{
              margin: 4,
              padding: "10px 16px",
              borderRadius: 999,
              border: "none",
              fontSize: 14,
              background: selectedCategory === c.id ? "#2563eb" : "#ffffff",
              color: selectedCategory === c.id ? "#ffffff" : "#111",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            }}
          >
            {c.name}
          </button>
        ))}
      </div>

      <div style={{ display: "grid", gap: 8, marginBottom: 12 }}>
        <input
          placeholder="🔍 Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ width: "100%", padding: 10, borderRadius: 8, border: "1px solid #d1d5db" }}
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

          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <span style={{ fontSize: 13, color: "#374151" }}>Layout</span>
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

      <div
        style={{
          display: "grid",
          gridTemplateColumns,
          gap: 14,
          paddingBottom: 80,
          contain: "layout paint",
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
  padding: "4px 8px",
};

const activeModeBtn = {
  ...modeBtn,
  border: "1px solid #2563eb",
  color: "#2563eb",
  fontWeight: 700,
};
