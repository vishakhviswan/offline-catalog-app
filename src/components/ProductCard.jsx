import { memo, useState, useMemo, useEffect } from "react";

export function normalizeUnits(units) {
  if (!Array.isArray(units)) {
    return [{ name: "pcs", multiplier: 1 }];
  }

  const valid = units.filter(
    (u) => u && typeof u.name === "string" && typeof u.multiplier === "number",
  );

  return valid.length ? valid : [{ name: "pcs", multiplier: 1 }];
}

function ProductCard({
  product,
  cart = [],
  onView,
  onAdd,
  onInc,
  onDec,
  orderMode = false,
  layoutMode = "grid-3",
  out = false,
}) {
  if (!product) return null;

  const units = normalizeUnits(product.units);

  const isSmall = layoutMode === "grid-4";
  const isMedium = layoutMode === "grid-3";

  const [selectedUnit, setSelectedUnit] = useState(units[0]);

  const activeCartItem = useMemo(() => {
    return cart.find(
      (c) => c.productId === product.id && c.unitName === selectedUnit.name,
    );
  }, [cart, product.id, selectedUnit]);

  useEffect(() => {
    const existing = cart.find((c) => c.productId === product.id);
    if (existing) {
      const matched = units.find((u) => u.name === existing.unitName);
      if (matched && matched.name !== selectedUnit.name) {
        setSelectedUnit(matched);
      }
    }
  }, [cart, product.id, units, selectedUnit.name]);

  const displayPrice = useMemo(() => {
    return product.price * (selectedUnit.multiplier || 1);
  }, [product.price, selectedUnit]);

  return (
    <div
      style={{
        background: "#fff",
        borderRadius: isSmall ? 12 : 18,
        padding: isSmall ? 8 : 12,
        boxShadow: "0 8px 22px rgba(0,0,0,0.08)",
        display: "flex",
        flexDirection: "column",
        gap: isSmall ? 6 : 8,
        width: "100%",
        minWidth: 0,
        opacity: out ? 0.5 : 1,
        filter: out ? "grayscale(100%)" : "none",
      }}
    >
      <div
        style={{
          width: "100%",
          aspectRatio: "1 / 1",
          background: "#f3f4f6",
          borderRadius: isSmall ? 10 : 14,
          overflow: "hidden",
          cursor: "pointer",
          position: "relative",
        }}
        onClick={() => onView?.(product)}
      >
        {product.images?.[0] ? (
          <img
            src={product.images[0]}
            alt={product.name}
            loading="lazy"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        ) : (
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: isSmall ? 22 : 32,
            }}
          >
            📦
          </div>
        )}

        {out && (
          <div
            style={{
              position: "absolute",
              top: 8,
              left: 8,
              background: "#ef4444",
              color: "#fff",
              padding: "4px 8px",
              borderRadius: 6,
              fontSize: 11,
              fontWeight: 700,
            }}
          >
            Out of stock
          </div>
        )}
      </div>

      <div
        style={{
          fontWeight: 700,
          fontSize: isSmall ? 12 : isMedium ? 14 : 16,
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {product.name}
      </div>

      <div
        style={{
          fontWeight: 800,
          fontSize: isSmall ? 13 : 15,
          color: "#16a34a",
        }}
      >
        ₹{displayPrice.toFixed(2)}
        <span style={{ fontSize: 11, color: "#6b7280", marginLeft: 4 }}>
          / {selectedUnit.name}
        </span>
      </div>

      {orderMode && !activeCartItem && (
        <button
          onClick={() => onAdd?.(product, selectedUnit)}
          style={{
            padding: isSmall ? "6px 0" : "10px 0",
            borderRadius: 12,
            border: "none",
            background: "#0EA5A4",
            color: "#fff",
            fontWeight: 700,
            fontSize: isSmall ? 12 : 14,
            cursor: "pointer",
          }}
        >
          Add
        </button>
      )}

      {orderMode && activeCartItem && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <button
            onClick={() => onDec?.(product.id, selectedUnit.name)}
            style={{
              width: isSmall ? 28 : 36,
              height: isSmall ? 28 : 36,
              borderRadius: "50%",
              border: "none",
              background: "#e5e7eb",
              fontWeight: 800,
              cursor: "pointer",
            }}
          >
            −
          </button>

          <strong>{activeCartItem.qty}</strong>

          <button
            onClick={() => onInc?.(product.id, selectedUnit.name)}
            style={{
              width: isSmall ? 28 : 36,
              height: isSmall ? 28 : 36,
              borderRadius: "50%",
              border: "none",
              background: "#e5e7eb",
              fontWeight: 800,
              cursor: "pointer",
            }}
          >
            +
          </button>
        </div>
      )}
    </div>
  );
}

export default memo(ProductCard);
