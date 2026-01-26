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
  showOutOfStock = false,
}) {
  /* ================= STOCK CHECK ================= */
  const isOutOfStock = (p) =>
    p.out_of_stock === true || p.availability === false || p.stock === 0;

  /* ================= FILTER ================= */
  const filteredProducts = products
    .filter((p) =>
      selectedCategory === "all"
        ? true
        : (p.category_id || p.categoryId) === selectedCategory,
    )
    .filter((p) => p.name?.toLowerCase().includes(search.toLowerCase()))
    .filter((p) => (showOutOfStock ? true : !isOutOfStock(p)));

  return (
    <div style={page}>
      {/* ================= CATEGORIES ================= */}
      <h2 style={heading}>Product Categories</h2>

      <div style={categoryBar}>
        <CategoryChip
          active={selectedCategory === "all"}
          onClick={() => setSelectedCategory("all")}
        >
          🌈 All
        </CategoryChip>

        {categories.map((c) => (
          <CategoryChip
            key={c.id}
            active={selectedCategory === c.id}
            onClick={() => setSelectedCategory(c.id)}
          >
            {c.name}
          </CategoryChip>
        ))}
      </div>

      {/* ================= PRODUCTS ================= */}
      <h3 style={subHeading}>Products ({filteredProducts.length})</h3>

      {filteredProducts.length === 0 && (
        <p style={emptyTxt}>No products found</p>
      )}

      <div style={grid}>
        {filteredProducts.map((p) => {
          const cartItem = cart.find((c) => c.productId === p.id);

          const defaultUnit =
            p.units && p.units.length > 0
              ? p.units[0]
              : { name: "pcs", multiplier: 1 };

          const displayPrice = p.price * defaultUnit.multiplier;

          const productImage =
            p.image || (p.images && p.images.length > 0 ? p.images[0] : null);

          const out = isOutOfStock(p);

          return (
            <div
              key={p.id}
              style={{
                ...card,
                opacity: out ? 0.55 : 1,
              }}
            >
              {/* IMAGE */}
              <div style={imageWrap} onClick={() => !out && setViewProduct(p)}>
                {productImage ? (
                  <img src={productImage} alt={p.name} style={image} />
                ) : (
                  <span style={placeholder}>📦</span>
                )}

                {out && <div style={badge}>⏳ Restocking</div>}
              </div>

              {/* INFO */}
              <div style={{ flex: 1 }}>
                <div style={name}>{p.name}</div>

                <div style={price}>
                  ₹{displayPrice}
                  <span style={unit}> / {defaultUnit.name}</span>
                </div>
              </div>

              {/* CART */}
              {!cartItem && !out ? (
                <button
                  style={addBtn}
                  onClick={() => addToCart(p, defaultUnit)}
                >
                  ➕ Add
                </button>
              ) : cartItem ? (
                <div style={qtyRow}>
                  <button style={qtyBtn} onClick={() => decreaseQty(p.id)}>
                    −
                  </button>
                  <strong>{cartItem.qty}</strong>
                  <button style={qtyBtn} onClick={() => increaseQty(p.id)}>
                    +
                  </button>
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ================= CATEGORY CHIP ================= */

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
        background: active ? "#2563eb" : "#ffffff",
        color: active ? "#ffffff" : "#111827",
        boxShadow: "0 1px 3px rgba(0,0,0,0.15)",
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </button>
  );
}

/* ================= STYLES ================= */

const page = {
  padding: 16,
  maxWidth: 1200,
  margin: "0 auto",
};

const heading = {
  marginBottom: 8,
  fontSize: 20,
  fontWeight: 800,
};

const subHeading = {
  margin: "14px 0",
  fontSize: 16,
  fontWeight: 700,
};

const categoryBar = {
  display: "flex",
  gap: 8,
  overflowX: "auto",
  paddingBottom: 10,
};

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(170px, 1fr))",
  gap: 16,
  paddingBottom: 90,
};

const card = {
  background: "#ffffff",
  borderRadius: 16,
  padding: 12,
  boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
  display: "flex",
  flexDirection: "column",
  gap: 8,
};

const imageWrap = {
  height: 130,
  background: "#f3f4f6",
  borderRadius: 12,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  position: "relative", // ✅ IMPORTANT
};

const image = {
  width: "100%",
  height: "100%",
  objectFit: "contain",
};

const placeholder = {
  fontSize: 30,
  color: "#9ca3af",
};

const name = {
  fontSize: 14,
  fontWeight: 700,
};

const price = {
  fontSize: 15,
  fontWeight: 800,
  color: "#16a34a",
};

const unit = {
  fontSize: 12,
  color: "#6b7280",
  marginLeft: 4,
};

const addBtn = {
  marginTop: 6,
  padding: 10,
  borderRadius: 10,
  border: "none",
  background: "#2563eb",
  color: "#ffffff",
  fontWeight: 700,
  cursor: "pointer",
};

const qtyRow = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
};

const qtyBtn = {
  width: 36,
  height: 36,
  borderRadius: "50%",
  border: "none",
  background: "#e5e7eb",
  fontSize: 18,
  fontWeight: 700,
};

const emptyTxt = {
  color: "#6b7280",
  fontSize: 14,
};

const badge = {
  position: "absolute",
  top: 8,
  left: 8,
  background: "#f97316",
  color: "#fff",
  padding: "4px 8px",
  borderRadius: 8,
  fontSize: 11,
  fontWeight: 700,
};
