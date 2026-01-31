import { useRef, useState, useEffect, useMemo } from "react";

/* ================= UNIT NORMALIZER ================= */
function normalizeUnits(units) {
  if (!Array.isArray(units)) {
    return [{ name: "pcs", multiplier: 1 }];
  }

  const valid = units.filter(
    (u) => u && typeof u.name === "string" && typeof u.multiplier === "number",
  );

  return valid.length ? valid : [{ name: "pcs", multiplier: 1 }];
}

export default function ProductView({
  product,
  products = [],
  cart = [],
  addToCart,
  increaseQty,
  decreaseQty,
  onBack,
  onChangeProduct,
}) {
  if (!product) return null;

  /* ================= CATEGORY PRODUCTS (FIXED) ================= */

  const categoryProducts = useMemo(() => {
    return products.filter(
      (p) =>
        p.id !== product.id &&
        (p.category_id || p.categoryId) ===
          (product.category_id || product.categoryId),
    );
  }, [products, product]);

  const currentIndex = categoryProducts.findIndex((p) => p.id === product.id);

  const prevProduct =
    currentIndex > 0 ? categoryProducts[currentIndex - 1] : null;

  const nextProduct =
    currentIndex < categoryProducts.length - 1
      ? categoryProducts[currentIndex + 1]
      : null;

  const cartItem = cart.find((c) => c.productId === product.id);

  /* ================= UNIT STATE ================= */

  const units = normalizeUnits(product.units);

  const [selectedUnit, setSelectedUnit] = useState(units[0]);

  useEffect(() => {
    setSelectedUnit(normalizeUnits(product.units)[0]);
  }, [product]);

  /* ================= SWIPE ================= */

  const touchStartX = useRef(0);

  function onTouchStart(e) {
    touchStartX.current = e.touches[0].clientX;
  }

  function onTouchEnd(e) {
    const diff = e.changedTouches[0].clientX - touchStartX.current;

    if (diff < -60 && nextProduct) onChangeProduct(nextProduct);
    if (diff > 60 && prevProduct) onChangeProduct(prevProduct);
  }

  const unitPrice = product.price * (selectedUnit.multiplier || 1);
  const qty = cartItem?.qty || 1;
  const total = qty * unitPrice;

  /* ================= UI ================= */

  return (
    <div style={{ padding: 16, paddingBottom: 120 }}>
      {/* BACK */}
      <button onClick={onBack}>⬅ Back</button>

      {/* ================= MAIN CARD ================= */}
      <div onTouchStart={onTouchStart} onTouchEnd={onTouchEnd} style={mainCard}>
        {/* IMAGE */}
        <div style={imageWrap}>
          {product.images?.[0] ? (
            <img src={product.images[0]} alt={product.name} style={image} />
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
        {units.length > 1 && (
          <>
            <div style={{ fontSize: 13, marginTop: 6 }}>Select Unit</div>
            <select
              value={selectedUnit.name}
              onChange={(e) =>
                setSelectedUnit(units.find((u) => u.name === e.target.value))
              }
              style={select}
            >
              {units.map((u) => (
                <option key={u.name} value={u.name}>
                  {u.name} – ₹{product.price * u.multiplier}
                </option>
              ))}
            </select>
          </>
        )}

        {/* PRICE */}
        <div style={{ fontWeight: 700, marginTop: 10 }}>₹{unitPrice}</div>

        {/* CART */}
        {!cartItem ? (
          <button
            onClick={() => addToCart(product, selectedUnit)}
            style={addBtn}
          >
            Add to Cart
          </button>
        ) : (
          <div style={qtyRow}>
            <button onClick={() => decreaseQty(product.id)} style={qtyBtn}>
              −
            </button>
            <strong>{cartItem.qty}</strong>
            <button onClick={() => increaseQty(product.id)} style={qtyBtn}>
              +
            </button>
          </div>
        )}
      </div>

      {/* ================= MORE PRODUCTS (SAME CATEGORY) ================= */}
      {categoryProducts.length > 0 && (
        <>
          <h4 style={{ marginTop: 22 }}>More from this category</h4>

          <div style={grid}>
            {categoryProducts.slice(0, 12).map((p) => (
              <div
                key={p.id}
                onClick={() => onChangeProduct(p)}
                style={miniCard}
              >
                <div style={miniImage}>
                  {p.images?.[0] ? (
                    <img src={p.images[0]} alt={p.name} style={image} />
                  ) : (
                    "📦"
                  )}
                </div>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{p.name}</div>
                <div style={{ fontSize: 12 }}>₹{p.price}</div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* ================= STICKY BAR ================= */}
      <div style={stickyBar}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, color: "#6b7280" }}>{product.name}</div>
          <div style={{ fontSize: 22, fontWeight: 700 }}>₹{total}</div>
          <div style={{ fontSize: 12, color: "#9ca3af" }}>
            {qty} × ₹{unitPrice} / {selectedUnit.name}
          </div>
        </div>

        {!cartItem ? (
          <button
            onClick={() => addToCart(product, selectedUnit)}
            style={stickyBtn}
          >
            Add
          </button>
        ) : (
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => decreaseQty(product.id)} style={qtyBtn}>
              −
            </button>
            <strong>{cartItem.qty}</strong>
            <button onClick={() => increaseQty(product.id)} style={qtyBtn}>
              +
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ================= STYLES ================= */

const mainCard = {
  marginTop: 12,
  background: "#fff",
  borderRadius: 16,
  padding: 16,
  boxShadow: "0 4px 14px rgba(0,0,0,0.1)",
};

const imageWrap = {
  position: "relative",
  height: "55vh",
  background: "#f3f4f6",
  borderRadius: 12,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  marginBottom: 12,
};

const image = {
  width: "100%",
  height: "100%",
  objectFit: "contain",
};

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill,minmax(140px,1fr))",
  gap: 12,
};

const miniCard = {
  background: "#fff",
  borderRadius: 12,
  padding: 10,
  boxShadow: "0 2px 6px rgba(0,0,0,0.06)",
  cursor: "pointer",
};

const miniImage = {
  height: 90,
  background: "#f3f4f6",
  borderRadius: 8,
  marginBottom: 6,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const select = {
  marginTop: 6,
  padding: 8,
  borderRadius: 8,
  width: "100%",
};

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

const stickyBar = {
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
