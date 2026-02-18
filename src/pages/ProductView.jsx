import { useRef, useState } from "react";

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
  const categoryProducts = product
    ? products.filter((p) => p.categoryId === product.categoryId)
    : [];
  const currentIndex = categoryProducts.findIndex((p) => p.id === product?.id);
  const prevProduct = currentIndex > 0 ? categoryProducts[currentIndex - 1] : null;
  const nextProduct =
    currentIndex < categoryProducts.length - 1 ? categoryProducts[currentIndex + 1] : null;

  const cartItem = cart.find((c) => c.productId === product?.id);
  const [selectedUnitName, setSelectedUnitName] = useState("");
  const touchStartX = useRef(0);

  if (!product) return null;

  const selectedUnit =
    product.units?.find((u) => u.name === selectedUnitName) || product.units?.[0];

  function onTouchStart(e) {
    touchStartX.current = e.touches[0].clientX;
  }

  function onTouchEnd(e) {
    const diff = e.changedTouches[0].clientX - touchStartX.current;
    if (diff < -60 && nextProduct) {
      setSelectedUnitName("");
      onChangeProduct(nextProduct);
    }

    if (diff > 60 && prevProduct) {
      setSelectedUnitName("");
      onChangeProduct(prevProduct);
    }
  }

  return (
    <div style={{ padding: 16, paddingBottom: 110, maxWidth: 980, margin: "0 auto" }}>
      <button onClick={onBack} style={backBtn}>⬅ Back</button>

      <div
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        style={{
          marginTop: 12,
          background: "#fff",
          borderRadius: 16,
          padding: 16,
          boxShadow: "0 8px 22px rgba(0,0,0,0.12)",
        }}
      >
        <div
          style={{
            position: "relative",
            height: 280,
            background: "#f3f4f6",
            borderRadius: 12,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 12,
            overflow: "hidden",
          }}
        >
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              loading="lazy"
              decoding="async"
              style={{ width: "100%", height: "100%", objectFit: "contain" }}
            />
          ) : (
            <span style={{ fontSize: 32 }}>📦</span>
          )}

          {prevProduct && (
            <button
              onClick={() => {
                setSelectedUnitName("");
                onChangeProduct(prevProduct);
              }}
              style={navBtn("left")}
            >
              ◀
            </button>
          )}
          {nextProduct && (
            <button
              onClick={() => {
                setSelectedUnitName("");
                onChangeProduct(nextProduct);
              }}
              style={navBtn("right")}
            >
              ▶
            </button>
          )}
        </div>

        <h2 style={{ marginTop: 0 }}>{product.name}</h2>

        {product.units?.length > 1 && (
          <>
            <div style={{ marginTop: 8, fontSize: 13 }}>Select Unit</div>
            <select
              value={selectedUnit?.name}
              onChange={(e) => setSelectedUnitName(e.target.value)}
              style={{ marginTop: 6, padding: 10, borderRadius: 8, width: "100%", border: "1px solid #d1d5db" }}
            >
              {product.units.map((u, i) => (
                <option key={i} value={u.name}>
                  {u.name} – ₹{product.price * u.multiplier}
                </option>
              ))}
            </select>
          </>
        )}

        <div style={{ fontWeight: 700, fontSize: 22, marginTop: 10 }}>
          ₹{product.price * (selectedUnit?.multiplier || 1)}
        </div>

        {!cartItem ? (
          <button onClick={() => addToCart(product, selectedUnit)} style={addBtn}>Add to Cart</button>
        ) : (
          <div style={qtyRow}>
            <button onClick={() => decreaseQty(product.id)} style={qtyBtn}>−</button>
            <strong>{cartItem.qty}</strong>
            <button onClick={() => increaseQty(product.id)} style={qtyBtn}>+</button>
          </div>
        )}
      </div>

      <h4 style={{ marginTop: 20 }}>More Products</h4>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: 12 }}>
        {categoryProducts.map((p) => (
          <div
            key={p.id}
            onClick={() => {
              setSelectedUnitName("");
              onChangeProduct(p);
            }}
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
                  loading="lazy"
                  decoding="async"
                  style={{ width: "100%", height: "100%", objectFit: "contain" }}
                />
              ) : (
                "📦"
              )}
            </div>
            <div style={{ fontSize: 13, fontWeight: 600 }}>{p.name}</div>
            <div style={{ fontSize: 12 }}>₹{p.price}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

const backBtn = {
  border: "1px solid #d1d5db",
  background: "#fff",
  borderRadius: 8,
  padding: "8px 12px",
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
