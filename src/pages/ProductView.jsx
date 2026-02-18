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
    <div className="page-wrap product-view-wrap">
      <button onClick={onBack} className="btn-soft">⬅ Back</button>

      <div onTouchStart={onTouchStart} onTouchEnd={onTouchEnd} className="product-main-card">
        <div className="product-hero">
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
              className="select-unit"
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
          <button onClick={() => addToCart(product, selectedUnit)} className="add-btn">Add to Cart</button>
        ) : (
          <div className="qty-row">
            <button onClick={() => decreaseQty(product.id)} className="qty-btn">−</button>
            <strong>{cartItem.qty}</strong>
            <button onClick={() => increaseQty(product.id)} className="qty-btn">+</button>
          </div>
        )}
      </div>

      <h4 style={{ marginTop: 20 }}>More Products</h4>
      <div className="more-products-grid">
        {categoryProducts.map((p) => (
          <div
            key={p.id}
            onClick={() => {
              setSelectedUnitName("");
              onChangeProduct(p);
            }}
            className="mini-product-card"
          >
            <div className="mini-product-thumb">
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
