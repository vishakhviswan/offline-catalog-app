import { useState, useMemo } from "react";

/* ================= UNIT NORMALIZER ================= */
export function normalizeUnits(units) {
  if (!Array.isArray(units)) {
    return [{ name: "pcs", multiplier: 1 }];
  }

  const valid = units.filter(
    (u) => u && typeof u.name === "string" && typeof u.multiplier === "number",
  );

  return valid.length ? valid : [{ name: "pcs", multiplier: 1 }];
}

/* ================= PRODUCT CARD ================= */
export default function ProductCard({
  product,
  compact = false,
  cartItem,
  out = false,
  onView,
  onAdd,
  onInc,
  onDec,
  imageHero = false, // 🔥 for big catalog grid
}) {
  if (!product) return null;

  const units = normalizeUnits(product.units);

  const [selectedUnit, setSelectedUnit] = useState(
    cartItem?.unitName
      ? units.find((u) => u.name === cartItem.unitName) || units[0]
      : units[0],
  );

  const displayPrice = useMemo(() => {
    return product.price * (selectedUnit.multiplier || 1);
  }, [product.price, selectedUnit]);

  return (
    <div
      style={{
        ...card,
        opacity: out ? 0.55 : 1,
      }}
    >
      {/* ================= IMAGE ================= */}
      <div
        style={{
          ...imageWrap,
          height: imageHero ? 220 : compact ? 90 : 150,
        }}
        onClick={() => !out && onView?.(product)}
      >
        {product.images?.[0] ? (
          <img
            src={product.images[0]}
            alt={product.name}
            style={image}
            loading="lazy"
          />
        ) : (
          <div style={placeholder}>📦</div>
        )}

        {/* OUT OF STOCK */}
        {out && <div style={badge}>Out of stock</div>}

        {/* NAME OVERLAY (IMAGE HERO MODE) */}
        {imageHero && (
          <div style={overlay}>
            <div style={overlayName} title={product.name}>
              {product.name}
            </div>
          </div>
        )}
      </div>

      {/* ================= CONTENT ================= */}
      {!imageHero && (
        <div style={name} title={product.name}>
          {product.name}
        </div>
      )}

      {/* PRICE */}
      <div style={price}>
        ₹{displayPrice.toFixed(2)}
        <span style={unitStyle}> / {selectedUnit.name}</span>
      </div>

      {/* UNIT SELECT */}
      {units.length > 1 && !cartItem && (
        <select
          style={unitSelect}
          value={selectedUnit.name}
          onChange={(e) => {
            const u = units.find((x) => x.name === e.target.value);
            if (u) setSelectedUnit(u);
          }}
        >
          {units.map((u) => (
            <option key={u.name} value={u.name}>
              {u.name}
            </option>
          ))}
        </select>
      )}

      {/* ADD / QTY */}
      {!out && !cartItem && (
        <button style={addBtn} onClick={() => onAdd?.(product, selectedUnit)}>
          ➕ Add
        </button>
      )}

      {cartItem && (
        <div style={qtyRow}>
          <button style={qtyBtn} onClick={() => onDec?.(product.id)}>
            −
          </button>
          <strong>{cartItem.qty}</strong>
          <button style={qtyBtn} onClick={() => onInc?.(product.id)}>
            +
          </button>
        </div>
      )}
    </div>
  );
}

/* ================= STYLES ================= */

const card = {
  background: "#ffffff",
  borderRadius: 18,
  padding: 10,
  boxShadow: "0 10px 26px rgba(0,0,0,0.08)",
  display: "flex",
  flexDirection: "column",
  gap: 8,
};

const imageWrap = {
  width: "100%",
  background: "#f3f4f6",
  borderRadius: 14,
  overflow: "hidden",
  position: "relative",
  cursor: "pointer",
};

const image = {
  width: "100%",
  height: "100%",
  objectFit: "cover", // 🔥 perfect for 1080x1080
};

const placeholder = {
  width: "100%",
  height: "100%",
  fontSize: 36,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#9ca3af",
};

/* ===== IMAGE OVERLAY ===== */
const overlay = {
  position: "absolute",
  bottom: 0,
  left: 0,
  right: 0,
  padding: "10px 12px",
  background: "linear-gradient(to top, rgba(0,0,0,0.65), rgba(0,0,0,0.05))",
};

const overlayName = {
  color: "#ffffff",
  fontSize: 14,
  fontWeight: 800,
  lineHeight: 1.2,
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
};

/* ===== TEXT ===== */
const name = {
  fontWeight: 800,
  fontSize: 14,
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
};

const price = {
  fontWeight: 900,
  fontSize: 15,
  color: "#16a34a",
};

const unitStyle = {
  fontSize: 12,
  color: "#6b7280",
  marginLeft: 4,
};

/* ===== CONTROLS ===== */
const unitSelect = {
  padding: "8px 10px",
  borderRadius: 10,
  border: "1px solid #d1d5db",
  fontSize: 13,
};

const addBtn = {
  marginTop: 4,
  padding: "10px 0",
  borderRadius: 12,
  border: "none",
  background: "#0EA5A4",
  color: "#ffffff",
  fontWeight: 800,
  fontSize: 14,
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
  fontWeight: 800,
  cursor: "pointer",
};

/* ===== BADGE ===== */
const badge = {
  position: "absolute",
  top: 8,
  left: 8,
  background: "#ef4444",
  color: "#fff",
  padding: "4px 8px",
  borderRadius: 6,
  fontSize: 11,
  fontWeight: 800,
};
