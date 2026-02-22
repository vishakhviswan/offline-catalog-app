import { useMemo } from "react";
import { Box, Button, Card, Chip, Stack, Typography } from "@mui/material";

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
  layoutMode = "grid-3",
}) {
  const safeProduct = product || { id: null, units: [], price: 0, name: "" };
  const units = normalizeUnits(safeProduct.units);
  const selectedUnit = units[0];

  const compact = layoutMode === "grid-4";

  const activeCartItem = useMemo(
    () =>
      cart.find(
        (c) => c.productId === safeProduct.id && c.unitName === selectedUnit.name,
      ),
    [cart, safeProduct.id, selectedUnit.name],
  );

  const displayPrice = useMemo(
    () => safeProduct.price * (selectedUnit.multiplier || 1),
    [safeProduct.price, selectedUnit.multiplier],
  );

  if (!product) return null;

  return (
    <Card
      elevation={0}
      sx={{
        height: "100%",
        p: compact ? 1 : 1.5,
        borderRadius: 2.25,
        border: "1px solid rgba(148,163,184,0.2)",
        boxShadow: "0 10px 24px rgba(15,23,42,0.08)",
        background: "linear-gradient(145deg, #ffffff, #f8fafc)",
        opacity: out ? 0.55 : 1,
        transition: "transform 240ms ease, box-shadow 240ms ease",
        display: "flex",
        flexDirection: "column",
        gap: 1,
        "@media (hover: hover) and (pointer: fine)": {
          "&:hover": {
            transform: "translateY(-4px)",
            boxShadow: "0 16px 28px rgba(15,23,42,0.12)",
          },
        },
      }}
    >
      <Box
        sx={{
          width: "100%",
          aspectRatio: "1 / 1",
          bgcolor: "#f1f5f9",
          borderRadius: 2,
          overflow: "hidden",
          cursor: "pointer",
          position: "relative",
          boxShadow: "inset 0 0 0 1px rgba(148,163,184,0.2), 0 6px 18px rgba(15,23,42,0.08)",
        }}
        onClick={() => onView?.(safeProduct)}
      >
        {safeProduct.images?.[0] ? (
          <Box
            component="img"
            src={safeProduct.images[0]}
            alt={safeProduct.name}
            sx={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <Box sx={{ width: "100%", height: "100%", display: "grid", placeItems: "center", fontSize: compact ? 22 : 32 }}>
            📦
          </Box>
        )}

        {topBadge && (
          <Chip
            label={topBadge}
            size="small"
            sx={{ position: "absolute", top: 8, right: 8, bgcolor: "#f59e0b", color: "#111827", fontWeight: 700 }}
          />
        )}

        {out && (
          <Chip
            label="Out of stock"
            size="small"
            sx={{ position: "absolute", top: 8, left: 8, bgcolor: "#ef4444", color: "#fff", fontWeight: 700 }}
          />
        )}
      </Box>

      <Typography sx={{ fontWeight: 700, fontSize: compact ? 13 : 15 }} noWrap>
        {safeProduct.name}
      </Typography>

      <Typography sx={{ fontWeight: 800, fontSize: compact ? 14 : 16, color: "#16a34a" }}>
        ₹{displayPrice.toFixed(2)}
        <Typography component="span" sx={{ fontSize: 11, color: "#64748b", ml: 0.5 }}>
          / {selectedUnit.name}
        </Typography>
      </Typography>

      {metaInfo && (
        <Typography variant="caption" color="text.secondary" noWrap title={metaInfo}>
          {metaInfo}
        </Typography>
      )}

      {orderMode && !activeCartItem && (
        <Button
          onClick={() => onAdd?.(safeProduct, selectedUnit)}
          sx={{
            mt: "auto",
            borderRadius: 99,
            background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
            color: "#fff",
            fontWeight: 700,
            py: 0.9,
            "&:hover": { opacity: 0.9 },
          }}
        >
          Add
        </Button>
      )}

      {orderMode && activeCartItem && (
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mt: "auto", p: 0.5, borderRadius: 99, bgcolor: "#eff6ff", border: "1px solid rgba(37,99,235,0.2)" }}>
          <Button onClick={() => onDec?.(safeProduct.id, selectedUnit.name)} sx={{ minWidth: 34, borderRadius: 99, bgcolor: "#e2e8f0", color: "#0f172a", px: 0 }}>
            −
          </Button>
          <Typography fontWeight={800}>{activeCartItem.qty}</Typography>
          <Button onClick={() => onInc?.(safeProduct.id, selectedUnit.name)} sx={{ minWidth: 34, borderRadius: 99, bgcolor: "#2563eb", color: "#fff", px: 0 }}>
            +
          </Button>
        </Stack>
      )}
    </Card>
  );
}
