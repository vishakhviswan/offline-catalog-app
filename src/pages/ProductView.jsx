import { useMemo, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

export default function ProductView({
  products = [],
  cart = [],
  addToCart,
  increaseQty,
  decreaseQty,
}) {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const product = useMemo(
    () => products.find((p) => String(p.id) === id),
    [products, id],
  );

  const [selectedUnitName, setSelectedUnitName] = useState("");
  const touchStartX = useRef(0);

  const units = product?.units?.length
    ? product.units
    : [{ name: "pcs", multiplier: 1 }];

  const selectedUnit =
    units.find((u) => u.name === selectedUnitName) || units[0];

  const cartItem = cart.find(
    (c) => c.productId === product?.id && c.unitName === selectedUnit.name,
  );

  const categoryProducts = useMemo(() => {
    if (!product) return [];
    return products.filter(
      (p) =>
        (p.category_id || p.categoryId) ===
        (product.category_id || product.categoryId),
    );
  }, [products, product]);

  const currentIndex = categoryProducts.findIndex((p) => p.id === product?.id);

  const prevProduct =
    currentIndex > 0 ? categoryProducts[currentIndex - 1] : null;

  const nextProduct =
    currentIndex >= 0 && currentIndex < categoryProducts.length - 1
      ? categoryProducts[currentIndex + 1]
      : null;

  if (!product) {
    return (
      <div style={{ padding: 16 }}>
        <button onClick={() => navigate("/")}>⬅ Back</button>
        <p>Product not found.</p>
      </div>
    );
  }

  function goBack() {
    if (location.key !== "default") {
      navigate(-1);
    } else {
      navigate("/");
    }
  }

  function navigateProduct(target) {
    setSelectedUnitName("");
    navigate(`/product/${target.id}`);
  }

  function onTouchStart(e) {
    touchStartX.current = e.touches[0].clientX;
  }

  function onTouchEnd(e) {
    const diff = e.changedTouches[0].clientX - touchStartX.current;

    if (diff < -60 && nextProduct) navigateProduct(nextProduct);

    if (diff > 60 && prevProduct) navigateProduct(prevProduct);
  }

  const price = product.price * (selectedUnit.multiplier || 1);

  return (
    <div style={{ padding: 16, paddingBottom: 120 }}>
      <button onClick={goBack}>⬅ Back</button>

      {/* IMAGE SECTION */}
      <div
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        style={{
          height: 300,
          background: "#f3f4f6",
          borderRadius: 12,
          marginTop: 12,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {product.images?.[0] ? (
          <img
            src={product.images[0]}
            alt={product.name}
            loading="lazy"
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
            onClick={() => navigateProduct(prevProduct)}
            style={navBtn("left")}
          >
            ◀
          </button>
        )}

        {nextProduct && (
          <button
            onClick={() => navigateProduct(nextProduct)}
            style={navBtn("right")}
          >
            ▶
          </button>
        )}
      </div>

      {/* PRODUCT INFO */}
      <h2 style={{ marginTop: 16 }}>{product.name}</h2>

      {/* UNIT SELECT */}
      {units.length > 1 && (
        <>
          <div style={{ marginTop: 8, fontSize: 13 }}>Select Unit</div>

          <select
            value={selectedUnit.name}
            onChange={(e) => setSelectedUnitName(e.target.value)}
            style={{
              marginTop: 6,
              padding: 8,
              borderRadius: 8,
              width: "100%",
            }}
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
      <div
        style={{
          fontWeight: 700,
          marginTop: 12,
          fontSize: 18,
        }}
      >
        ₹{price}
      </div>

      {/* CART CONTROLS */}
      {!cartItem ? (
        <button onClick={() => addToCart(product, selectedUnit)} style={addBtn}>
          Add to Cart
        </button>
      ) : (
        <div style={qtyRow}>
          <button
            onClick={() => decreaseQty(product.id, selectedUnit.name)}
            style={qtyBtn}
          >
            −
          </button>

          <strong>{cartItem.qty}</strong>

          <button
            onClick={() => increaseQty(product.id, selectedUnit.name)}
            style={qtyBtn}
          >
            +
          </button>
        </div>
      )}
    </div>
  );
}

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
});
