import { useState } from "react";

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
}) {
  if (!product) return null;

  const units = normalizeUnits(product.units);

  /* ✅ STATE (KEY FIX) */
  const [selectedUnit, setSelectedUnit] = useState(
    cartItem?.unitName
      ? units.find((u) => u.name === cartItem.unitName) || units[0]
      : units[0],
  );

  /* 🔥 RATE CALCULATION */
  const displayPrice = product.price * (selectedUnit.multiplier || 1);

  return (
    <div
      style={{
        ...card,
        opacity: out ? 0.55 : 1,
      }}
    >
      {/* IMAGE */}
      <div style={{...imageWrap, height: compact ? 70:130} } onClick={() => !out && onView?.(product)}>
        {product.images?.[0] ? (
          <img src={product.images[0]} alt={product.name} style={image} />
        ) : (
          <span style={placeholder}>📦</span>
        )}

        {out && <div style={badge}>Out of stock</div>}
      </div>

      {/* NAME */}
      <div style={{...name, fontSize: compact ? 13:14}}>{product.name}</div>

      {/* PRICE (LIVE UPDATE ✅) */}
      <div style={{...price, fontSize: compact ? 14 : 15}}>
        ₹{displayPrice}
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
  borderRadius: 16,
  padding: 12,
  boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
  display: "flex",
  flexDirection: "column",
  gap: 8,
};

const imageWrap = {
  background: "#f3f4f6",
  borderRadius: 12,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  position: "relative",
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
  fontWeight: 700,
};

const price = {
  fontWeight: 800,
  color: "#16a34a",
};

const unitStyle = {
  fontSize: 12,
  color: "#6b7280",
  marginLeft: 4,
};

const unitSelect = {
  padding: "8px 10px",
  borderRadius: 8,
  border: "1px solid #d1d5db",
  fontSize: 13,
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
  width: 34,
  height: 34,
  borderRadius: "50%",
  border: "none",
  background: "#e5e7eb",
  fontSize: 18,
  fontWeight: 700,
};

const badge = {
  position: "absolute",
  top: 8,
  left: 8,
  background: "#ef4444",
  color: "#fff",
  padding: "4px 8px",
  borderRadius: 6,
  fontSize: 11,
  fontWeight: 700,
};

