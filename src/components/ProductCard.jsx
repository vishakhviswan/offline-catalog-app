import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Chip,
  Stack,
  Typography,
} from "@mui/material";

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
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    setImageError(false);
  }, [safeProduct.id, safeProduct.images]);

  const units = normalizeUnits(safeProduct.units);
  const selectedUnit = units[0];

  const activeCartItem = useMemo(() => {
    return cart.find(
      (c) => c.productId === safeProduct.id && c.unitName === selectedUnit.name,
    );
  }, [cart, safeProduct.id, selectedUnit.name]);

  const displayPrice = useMemo(() => {
    return safeProduct.price * (selectedUnit.multiplier || 1);
  }, [safeProduct.price, selectedUnit.multiplier]);

  if (!product) return null;

  return (
    <Card
      elevation={2}
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        borderRadius: 2,
        opacity: out ? 0.6 : 1,
        transition: "transform .22s ease, box-shadow .22s ease",
        "&:hover": {
          transform: { md: "translateY(-2px) scale(1.01)" },
          boxShadow: { md: 8 },
        },
      }}
    >
      <Box sx={{ position: "relative", aspectRatio: "1 / 1", cursor: "pointer" }} onClick={() => onView?.(safeProduct)}>
        <CardMedia
          component="img"
          image={safeProduct.images?.[0] || ""}
          alt={safeProduct.name}
          onError={(e) => {
            e.currentTarget.style.display = "none";
            setImageError(true);
          }}
          sx={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
            bgcolor: "#f9fafb",
            p: 1,
            display: safeProduct.images?.[0] && !imageError ? "block" : "none",
          }}
        />

        {(!safeProduct.images?.[0] || imageError) && (
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              display: "grid",
              placeItems: "center",
              fontSize: 34,
              bgcolor: "#f9fafb",
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
      </Box>

      <CardContent sx={{ flexGrow: 1, pb: 1.25 }}>
        <Typography
          fontWeight={700}
          sx={{
            minHeight: 42,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {safeProduct.name}
        </Typography>

        <Typography sx={{ fontWeight: 800, color: "#16a34a" }}>
          ₹{displayPrice.toFixed(2)}
          <Typography component="span" variant="caption" color="text.secondary" sx={{ ml: 0.5 }}>
            / {selectedUnit.name}
          </Typography>
        </Typography>

        {metaInfo && (
          <Typography variant="caption" color="text.secondary" title={metaInfo} noWrap>
            {metaInfo}
          </Typography>
        )}
      </CardContent>

      {orderMode && (
        <CardActions sx={{ px: 1.5, pb: 1.5, pt: 0, mt: "auto" }}>
          {!activeCartItem ? (
            <Button
              fullWidth
              variant="contained"
              disabled={out}
              onClick={() => onAdd?.(safeProduct, selectedUnit)}
              sx={{ textTransform: "none", bgcolor: "#2563eb", borderRadius: 2 }}
            >
              Add
            </Button>
          ) : (
            <Stack direction="row" alignItems="center" spacing={1} sx={{ width: "100%", justifyContent: "space-between" }}>
              <Button variant="outlined" onClick={() => onDec?.(safeProduct.id, selectedUnit.name)}>
                −
              </Button>
              <Typography fontWeight={800}>{activeCartItem.qty}</Typography>
              <Button variant="outlined" onClick={() => onInc?.(safeProduct.id, selectedUnit.name)}>
                +
              </Button>
            </Stack>
          )}
        </CardActions>
      )}
    </Card>
  );
}
