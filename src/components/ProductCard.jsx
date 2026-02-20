import { useState, useMemo } from "react";

function normalizeUnits(units) {
  if (!Array.isArray(units)) {
    return [{ name: "pcs", multiplier: 1 }];
  }

  const valid = units.filter(
    (u) => u && typeof u.name === "string" && typeof u.multiplier === "number",
  );

  return valid.length ? valid : [{ name: "pcs", multiplier: 1 }];
}

export default function ProductCard({
  product,
  cart = [],
  onView,
  onAdd,
  onInc,
  onDec,
  orderMode = false,
  out = false,
  topBadge,
  metaInfo,
}) {
  const safeProduct = product || { id: null, units: [], price: 0, name: "" };

  const units = normalizeUnits(safeProduct.units);
  const isSmall = layoutMode === "grid-4";
  const isMedium = layoutMode === "grid-3";
  const [isHover, setIsHover] = useState(false);
  const selectedUnit = units[0];

  const canHoverDesktop =
    typeof window !== "undefined" &&
    window.matchMedia("(min-width: 900px) and (hover: hover)").matches;

  const activeCartItem = useMemo(() => {
    return cart.find(
      (c) => c.productId === safeProduct.id && c.unitName === selectedUnit.name,
    );
  }, [cart, safeProduct.id, selectedUnit]);

  const displayPrice = useMemo(() => {
    return safeProduct.price * (selectedUnit.multiplier || 1);
  }, [safeProduct.price, selectedUnit]);

  if (!product) return null;

  return (
    <div
      onMouseEnter={() => canHoverDesktop && setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
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
        transform: isHover ? "scale(1.02)" : "scale(1)",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
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
        onClick={() => onView?.(safeProduct)}
      >
        {safeProduct.images?.[0] ? (
          <img
            src={safeProduct.images?.[0]}
            alt={safeProduct.name}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
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
          </Box>
        )}

        {topBadge && (
          <Chip
            label={topBadge}
            size="small"
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              bgcolor: "#f59e0b",
              color: "#111827",
              fontWeight: 700,
            }}
          />
        )}

        {topBadge && (
          <div
            style={{
              position: "absolute",
              top: 8,
              right: 8,
              background: "#f59e0b",
              color: "#111827",
              padding: "4px 8px",
              borderRadius: 999,
              fontSize: 10,
              fontWeight: 700,
            }}
          >
            {topBadge}
          </div>
        )}

        {out && (
          <Chip
            label="Out of stock"
            size="small"
            sx={{
              position: "absolute",
              top: 8,
              left: 8,
              bgcolor: "#ef4444",
              color: "#fff",
              fontWeight: 700,
            }}
          />
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
        {safeProduct.name}
      </div>

      <div style={{ fontWeight: 800, fontSize: isSmall ? 13 : 15, color: "#16a34a" }}>
        ₹{displayPrice.toFixed(2)}
        <span style={{ fontSize: 11, color: "#6b7280", marginLeft: 4 }}>
          / {selectedUnit.name}
        </span>
      </div>

      {metaInfo && (
        <div
          style={{
            fontSize: 11,
            color: "#6b7280",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
          title={metaInfo}
        >
          {metaInfo}
        </div>
      )}

      {orderMode && !activeCartItem && (
        <button
          onClick={() => onAdd?.(safeProduct, selectedUnit)}
          style={{
            padding: isSmall ? "6px 0" : "10px 0",
            borderRadius: 12,
            border: "none",
            background: "#2563eb",
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
            onClick={() => onDec?.(safeProduct.id, selectedUnit.name)}
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
            onClick={() => onInc?.(safeProduct.id, selectedUnit.name)}
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
    </Card>
  );
}
