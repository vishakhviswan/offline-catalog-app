import { useRef, useState, useEffect } from "react";

export default function ProductView({
  product,
  products,
  cart,
  addToCart,
  increaseQty,
  decreaseQty,
  onBack,
  onChangeProduct,
}) {
  if (!product) return null;

  /* ================= CATEGORY PRODUCTS ================= */

  const categoryProducts = products.filter(
    (p) => p.categoryId === product.categoryId
  );

  const currentIndex = categoryProducts.findIndex(
    (p) => p.id === product.id
  );

  const prevProduct =
    currentIndex > 0 ? categoryProducts[currentIndex - 1] : null;

  const nextProduct =
    currentIndex < categoryProducts.length - 1
      ? categoryProducts[currentIndex + 1]
      : null;

  const cartItem = cart.find(
    (c) => c.productId === product.id
  );

  /* ================= UNIT STATE (IMPORTANT) ================= */

  const [selectedUnit, setSelectedUnit] = useState(
    product.units?.[0]
  );

  // 🔁 RESET UNIT WHEN PRODUCT CHANGES
  useEffect(() => {
    if (product?.units?.length) {
      setSelectedUnit(product.units[0]);
    }
  }, [product]);

  /* ================= SWIPE ================= */

  const touchStartX = useRef(0);

  function onTouchStart(e) {
    touchStartX.current = e.touches[0].clientX;
  }

  function onTouchEnd(e) {
    const diff =
      e.changedTouches[0].clientX - touchStartX.current;

    if (diff < -60 && nextProduct) {
      onChangeProduct(nextProduct);
    }

    if (diff > 60 && prevProduct) {
      onChangeProduct(prevProduct);
    }
  }

  /* ================= UI ================= */

  return (
    <div style={{ padding: 16, paddingBottom: 110 }}>

      {/* BACK */}
      <button onClick={onBack}>⬅ Back</button>

      {/* ================= TOP BLOCK ================= */}
      <div
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        style={{
          marginTop: 12,
          background: "#fff",
          borderRadius: 16,
          padding: 16,
          boxShadow: "0 4px 14px rgba(0,0,0,0.1)",
        }}
      >
        {/* IMAGE */}
        <div
          style={{
            position: "relative",
            height: "55vh",
            background: "#f3f4f6",
            borderRadius: 12,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 12,
          }}
        >
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
              }}
            />
          ) : (
            <span style={{ fontSize: 32 }}>📦</span>
          )}

          {prevProduct && (
            <button
              onClick={() => onChangeProduct(prevProduct)}
              style={navBtn("left")}
            >
              ◀
            </button>
          )}

          {nextProduct && (
            <button
              onClick={() => onChangeProduct(nextProduct)}
              style={navBtn("right")}
            >
              ▶
            </button>
          )}
        </div>

        {/* INFO */}
        <h2>{product.name}</h2>

        {/* UNIT SELECT */}
        {product.units?.length > 1 && (
          <>
            <div style={{ marginTop: 8, fontSize: 13 }}>
              Select Unit
            </div>
            <select
              value={selectedUnit?.name}
              onChange={(e) =>
                setSelectedUnit(
                  product.units.find(
                    (u) => u.name === e.target.value
                  )
                )
              }
              style={{
                marginTop: 6,
                padding: 8,
                borderRadius: 8,
                width: "100%",
              }}
            >
              {product.units.map((u, i) => (
                <option key={i} value={u.name}>
                  {u.name} – ₹{product.price * u.multiplier}
                </option>
              ))}
            </select>
          </>
        )}

        {/* PRICE */}
        <div style={{ fontWeight: 700, marginTop: 10 }}>
          ₹{product.price * (selectedUnit?.multiplier || 1)}
        </div>

        {/* CART */}
        {!cartItem ? (
          <button
            onClick={() =>
              addToCart(product, selectedUnit)
            }
            style={addBtn}
          >
            Add to Cart
          </button>
        ) : (
          <div style={qtyRow}>
            <button
              onClick={() => decreaseQty(product.id)}
              style={qtyBtn}
            >
              −
            </button>
            <strong>{cartItem.qty}</strong>
            <button
              onClick={() => increaseQty(product.id)}
              style={qtyBtn}
            >
              +
            </button>
          </div>
        )}
      </div>

      {/* ================= MORE PRODUCTS ================= */}
      <h4 style={{ marginTop: 20 }}>More Products</h4>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fill, minmax(140px, 1fr))",
          gap: 12,
        }}
      >
        {categoryProducts.map((p) => (
          <div
            key={p.id}
            onClick={() => onChangeProduct(p)}
            style={{
              background: "#fff",
              borderRadius: 12,
              padding: 10,
              boxShadow: "0 2px 6px rgba(0,0,0,0.06)",
              cursor: "pointer",
            }}
          >
            <div
              style={{
                height: 90,
                background: "#f3f4f6",
                borderRadius: 8,
                marginBottom: 6,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {p.image ? (
                <img
                  src={p.image}
                  alt={p.name}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                  }}
                />
              ) : (
                "📦"
              )}
            </div>

            <div style={{ fontSize: 13, fontWeight: 600 }}>
              {p.name}
            </div>
            <div style={{ fontSize: 12 }}>
              ₹{p.price}
            </div>
          </div>
        ))}
      </div>

      {/* ================= STICKY BAR ================= */}
      <div
        style={{
          position: "fixed",
          left: 0,
          right: 0,
          bottom: 0,
          background: "#fff",
          borderTop: "1px solid #e5e7eb",
          padding: "12px 14px",
          display: "flex",
          alignItems: "center",
          gap: 12,
          zIndex: 9999,
        }}
      >
        <div style={{ flex: 1 }}>
  <div style={{ fontSize: 13, color: "#6b7280" }}>
    {product.name}
  </div>

  <div style={{ fontSize: 14, color: "#6b7280", marginTop: 2 }}>
    Total
  </div>

  <div style={{ fontSize: 22, fontWeight: 700 }}>
    ₹{(cartItem?.qty || 1) * product.price * (selectedUnit?.multiplier || 1)}
  </div>

  <div style={{ fontSize: 12, color: "#9ca3af" }}>
    {(cartItem?.qty || 1)} × ₹{product.price * (selectedUnit?.multiplier || 1)}
    {selectedUnit ? ` / ${selectedUnit.name}` : ""}
  </div>
</div>

        {!cartItem ? (
          <button
            onClick={() =>
              addToCart(product, selectedUnit)
            }
            style={stickyBtn}
          >
            Add to Cart
          </button>
        ) : (
          <div style={{ display: "flex", gap: 8 }}>
            <button
              onClick={() => decreaseQty(product.id)}
              style={qtyBtn}
            >
              −
            </button>
            <strong>{cartItem.qty}</strong>
            <button
              onClick={() => increaseQty(product.id)}
              style={qtyBtn}
            >
              +
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ================= STYLES ================= */

const addBtn = {
  width: "100%",
  marginTop: 12,
  padding: 12,
  background: "#2563eb",
  color: "#fff",
  border: "none",
  borderRadius: 10,
  fontWeight: 600,
};

const stickyBtn = {
  padding: "10px 16px",
  background: "#2563eb",
  color: "#fff",
  border: "none",
  borderRadius: 10,
  fontWeight: 600,
};

const qtyRow = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginTop: 12,
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

const navBtn = (side) => ({
  position: "absolute",
  top: "50%",
  [side]: 8,
  transform: "translateY(-50%)",
  background: "rgba(0,0,0,0.6)",
  color: "#fff",
  border: "none",
  borderRadius: "50%",
  width: 36,
  height: 36,
  fontSize: 18,
});