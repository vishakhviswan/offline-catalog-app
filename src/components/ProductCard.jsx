import { memo, useState, useMemo, useEffect } from "react";
import { Box, Chip, FormControl, MenuItem, Select, Typography } from "@mui/material";

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
  salesCount = 0,
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
  }, [cart, product.id, selectedUnit.name]);

  useEffect(() => {
    setSelectedUnit(units[0]);
  }, [product.id, units]);

  const displayPrice = useMemo(() => {
    return Number(product.price || 0) * Number(selectedUnit.multiplier || 1);
  }, [product.price, selectedUnit.multiplier]);

  const isNew = useMemo(() => {
    if (!product.created_at) return false;
    const created = new Date(product.created_at).getTime();
    if (Number.isNaN(created)) return false;
    return Date.now() - created <= 7 * 24 * 60 * 60 * 1000;
  }, [product.created_at]);

  return (
    <Box
      sx={{
        background: "#fff",
        borderRadius: isSmall ? 2 : 2.5,
        p: isSmall ? 1 : 1.5,
        boxShadow: "0 8px 22px rgba(0,0,0,0.08)",
        display: "flex",
        flexDirection: "column",
        gap: isSmall ? 0.75 : 1,
        width: "100%",
        minWidth: 0,
        opacity: out ? 0.5 : 1,
        filter: out ? "grayscale(100%)" : "none",
        transition: "transform 220ms ease, box-shadow 220ms ease",
        "&:hover": {
          transform: "translateY(-2px) scale(1.015)",
          boxShadow: "0 12px 28px rgba(15,23,42,0.16)",
        },
      }}
    >
      <Box
        sx={{
          width: "100%",
          aspectRatio: "1 / 1",
          background: "#f3f4f6",
          borderRadius: isSmall ? 1.5 : 2,
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
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <Box
            sx={{
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

        <Box sx={{ position: "absolute", top: 6, left: 6, display: "flex", gap: 0.5, flexWrap: "wrap" }}>
          {salesCount > 5 && <Chip size="small" label="Most Selling" color="warning" />}
          {(product.stock ?? 0) < 5 && <Chip size="small" label="Low Stock" color="error" />}
          {isNew && <Chip size="small" label="New" color="info" />}
          {out && <Chip size="small" label="Out of stock" color="error" />}
        </Box>
      </Box>

      <Typography
        sx={{
          fontWeight: 700,
          fontSize: isSmall ? 12 : isMedium ? 14 : 16,
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {product.name}
      </Typography>

      {orderMode && units.length > 1 && (
        <FormControl size="small" fullWidth>
          <Select
            value={selectedUnit.name}
            onChange={(e) => {
              const picked = units.find((u) => u.name === e.target.value);
              if (picked) setSelectedUnit(picked);
            }}
            sx={{ fontSize: 12, height: 32 }}
          >
            {units.map((unit) => (
              <MenuItem key={unit.name} value={unit.name} sx={{ fontSize: 12 }}>
                {unit.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}

      <Box
        sx={{
          fontWeight: 800,
          fontSize: isSmall ? 13 : 15,
          color: "#15803d",
          background: "linear-gradient(90deg, rgba(34,197,94,0.12), rgba(16,185,129,0.05))",
          borderRadius: 1.5,
          px: 1,
          py: 0.5,
          width: "fit-content",
        }}
      >
        ₹{displayPrice.toFixed(2)}
        <span style={{ fontSize: 11, color: "#6b7280", marginLeft: 4 }}>/ {selectedUnit.name}</span>
      </Box>

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
    </Box>
  );
}

export default memo(ProductCard);
