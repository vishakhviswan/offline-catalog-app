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
    <div className="page-wrap">
      <h2 style={{ marginBottom: 10 }}>Product Categories</h2>

      <div className="category-row">
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => setSelectedCategory(c.id)}
            className={selectedCategory === c.id ? "category-pill active" : "category-pill"}
          >
            {c.name}
          </button>
        ))}
      </div>

      <h3 style={{ marginBottom: 10 }}>Products ({filtered.length})</h3>

      <div className="catalog-grid">
        {filtered.map((p) => {
          const cartItem = cart.find((c) => c.productId === p.id);
          const defaultUnit = p.units?.[0] || { name: "Piece", multiplier: 1 };
          const displayPrice = p.price * (defaultUnit?.multiplier || 1);

          return (
            <div key={p.id} className="product-card">
              <div onClick={() => setViewProduct(p)} className="product-thumb">
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
                <button onClick={() => addToCart(p, defaultUnit)} className="add-btn">
                  Add to Cart
                </button>
              ) : (
                <div className="qty-row">
                  <button onClick={() => decreaseQty(p.id)} className="qty-btn">−</button>
                  <strong>{cartItem.qty}</strong>
                  <button onClick={() => increaseQty(p.id)} className="qty-btn">+</button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
