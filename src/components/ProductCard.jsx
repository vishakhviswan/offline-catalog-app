import { memo } from "react";
import { Link } from "react-router-dom";

function ProductCard({
  product,
  cartItem,
  layoutMode,
  onAddToCart,
  onIncreaseQty,
  onDecreaseQty,
}) {
  const defaultUnit = product.units?.[0] || { name: "Piece", multiplier: 1 };
  const displayPrice = product.price * (defaultUnit?.multiplier || 1);

  const outOfStock =
    product.out_of_stock === true ||
    product.stock === 0 ||
    product.available === false;

  const cardStyle = {
    background: "#fff",
    borderRadius: 14,
    padding: 10,
    boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
    display: "flex",
    flexDirection: "column",
    minHeight: layoutMode === "compact" ? 210 : 260,
  };

  return (
    <div style={cardStyle}>
      <Link
        to={`/product/${product.id}`}
        onClick={() =>
          sessionStorage.setItem("catalog-scroll", String(window.scrollY))
        }
        style={{
          cursor: "pointer",
          marginBottom: 8,
          height: layoutMode === "compact" ? 86 : 120,
          background: "#f3f4f6",
          borderRadius: 10,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textDecoration: "none",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {product.images?.[0] ? (
          <img
            src={product.images[0]}
            alt={product.name}
            loading="lazy"
            decoding="async"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
              borderRadius: 10,
              filter: outOfStock ? "grayscale(1)" : "none",
            }}
          />
        ) : (
          <span style={{ fontSize: 28, color: "#9ca3af" }}>📦</span>
        )}

        {outOfStock && (
          <span
            style={{
              position: "absolute",
              right: 8,
              top: 8,
              fontSize: 10,
              fontWeight: 700,
              background: "#111827",
              color: "#fff",
              borderRadius: 6,
              padding: "2px 6px",
            }}
          >
            OUT OF STOCK
          </span>
        )}
      </Link>

      <strong style={{ fontSize: 14, marginBottom: 4 }}>{product.name}</strong>

      <div style={{ fontSize: 13, color: "#374151", marginBottom: 4 }}>
        ₹{displayPrice} / {defaultUnit?.name}
      </div>

      {product.units?.length > 1 && (
        <div style={{ fontSize: 11, color: "#6b7280", marginBottom: 6 }}>
          {product.units.length} units available
        </div>
      )}

      {!cartItem ? (
        <button
          onClick={() => onAddToCart(product, defaultUnit)}
          disabled={outOfStock}
          style={{
            marginTop: "auto",
            padding: 10,
            borderRadius: 10,
            border: "none",
            background: outOfStock ? "#9ca3af" : "#2563eb",
            color: "#ffffff",
            fontWeight: 600,
            cursor: outOfStock ? "not-allowed" : "pointer",
          }}
        >
          {outOfStock ? "Unavailable" : "Add to Cart"}
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
          <button onClick={() => onDecreaseQty(product.id)} style={qtyBtn}>
            −
          </button>
          <strong>{cartItem.qty}</strong>
          <button onClick={() => onIncreaseQty(product.id)} style={qtyBtn}>
            +
          </button>
        </div>
      )}
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

export default memo(ProductCard);
