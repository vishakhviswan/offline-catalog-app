export default function Catalog({
  categories,
  selectedCategory,
  setSelectedCategory,
  products,
  setViewProduct,
  cart,
  addToCart,
  increaseQty,
  decreaseQty,
  search,
}) {
  const filtered = products
    .filter((p) => p.categoryId === selectedCategory)
    .filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div style={{ padding: 16, maxWidth: 1260, margin: "0 auto" }}>
      <h2 style={{ marginBottom: 10 }}>Product Categories</h2>

      <div style={{ marginBottom: 16, display: "flex", flexWrap: "wrap", gap: 8 }}>
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => setSelectedCategory(c.id)}
            style={{
              padding: "9px 14px",
              borderRadius: 999,
              border: "none",
              fontSize: 14,
              fontWeight: 600,
              background: selectedCategory === c.id ? "#2563eb" : "#ffffff",
              color: selectedCategory === c.id ? "#ffffff" : "#111",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            }}
          >
            {c.name}
          </button>
        ))}
      </div>

      <h3 style={{ marginBottom: 10 }}>Products ({filtered.length})</h3>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
          gap: 14,
          paddingBottom: 80,
        }}
      >
        {filtered.map((p) => {
          const cartItem = cart.find((c) => c.productId === p.id);
          const defaultUnit = p.units?.[0];
          const displayPrice = p.price * (defaultUnit?.multiplier || 1);

          return (
            <div
              key={p.id}
              style={{
                background: "#fff",
                borderRadius: 14,
                padding: 10,
                boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                display: "flex",
                flexDirection: "column",
                minHeight: 245,
              }}
            >
              <div
                onClick={() => setViewProduct(p)}
                style={{
                  cursor: "pointer",
                  marginBottom: 8,
                  height: 120,
                  background: "#f3f4f6",
                  borderRadius: 10,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "hidden",
                }}
              >
                {p.image ? (
                  <img
                    src={p.image}
                    alt={p.name}
                    loading="lazy"
                    decoding="async"
                    style={{ width: "100%", height: "100%", objectFit: "contain" }}
                  />
                ) : (
                  <span style={{ fontSize: 28, color: "#9ca3af" }}>📦</span>
                )}
              </div>

              <strong style={{ fontSize: 14, marginBottom: 4 }}>{p.name}</strong>
              <div style={{ fontSize: 13, color: "#374151", marginBottom: 4 }}>
                ₹{displayPrice} / {defaultUnit?.name}
              </div>

              {p.units?.length > 1 && (
                <div style={{ fontSize: 11, color: "#6b7280", marginBottom: 6 }}>
                  {p.units.length} units available
                </div>
              )}

              {!cartItem ? (
                <button
                  onClick={() => addToCart(p, defaultUnit)}
                  style={{
                    marginTop: "auto",
                    padding: 10,
                    borderRadius: 10,
                    border: "none",
                    background: "#2563eb",
                    color: "#ffffff",
                    fontWeight: 600,
                  }}
                >
                  Add to Cart
                </button>
              ) : (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginTop: "auto",
                  }}
                >
                  <button onClick={() => decreaseQty(p.id)} style={qtyBtn}>−</button>
                  <strong>{cartItem.qty}</strong>
                  <button onClick={() => increaseQty(p.id)} style={qtyBtn}>+</button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

const qtyBtn = {
  width: 36,
  height: 36,
  borderRadius: "50%",
  border: "none",
  background: "#e5e7eb",
  fontSize: 18,
  fontWeight: 700,
};
