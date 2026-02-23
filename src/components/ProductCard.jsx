import { memo, useMemo } from "react";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Chip,
  Stack,
  Typography,
} from "@mui/material";
import ImageNotSupportedOutlinedIcon from "@mui/icons-material/ImageNotSupportedOutlined";

function normalizeUnits(units) {
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
  out = false,
  topBadge,
  metaInfo,
  layoutMode = "grid-3",
}) {
  const safeProduct = product || { id: null, units: [], price: 0, name: "" };
  const units = normalizeUnits(safeProduct.units);
  const selectedUnit = units[0];

  const activeCartItem = useMemo(
    () =>
      cart.find(
        (c) => c.productId === safeProduct.id && c.unitName === selectedUnit.name,
      ),
    [cart, safeProduct.id, selectedUnit.name],
  );

  const displayPrice = useMemo(
    () => Number(safeProduct.price || 0) * Number(selectedUnit.multiplier || 1),
    [safeProduct.price, selectedUnit.multiplier],
  );

  const outOfStock = useMemo(
    () =>
      Boolean(
        out ||
          safeProduct.out_of_stock === true ||
          safeProduct.stock === 0 ||
          safeProduct.available === false,
      ),
    [out, safeProduct.out_of_stock, safeProduct.stock, safeProduct.available],
  );

  const imageSrc = safeProduct.images?.[0] || safeProduct.image || "";
  const minCardHeight = layoutMode === "list" ? 320 : 260;

  if (!product) return null;

  return (
    <Card
      elevation={0}
      sx={{
        width: "100%",
        maxWidth: "100%",
        height: "100%",
        minHeight: minCardHeight,
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        borderRadius: 2,
        border: "1px solid #e5e7eb",
        backgroundColor: "#fff",
        overflow: "hidden",
        p: 1,
      }}
    >
      <Box
        sx={{
          width: "100%",
          aspectRatio: "1 / 1",
          backgroundColor: imageSrc ? "#fff" : "#f3f4f6",
          borderRadius: 1.25,
          position: "relative",
          cursor: "pointer",
          overflow: "hidden",
          mb: 1,
        }}
        onClick={() => {
          sessionStorage.setItem("catalog-scroll", String(window.scrollY));
          onView?.(safeProduct);
        }}
      >
        {imageSrc ? (
          <Box
            component="img"
            src={imageSrc}
            alt={safeProduct.name}
            loading="lazy"
            decoding="async"
            sx={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
              display: "block",
              p: 1,
              filter: outOfStock ? "grayscale(1)" : "none",
            }}
          />
        ) : (
          <Stack
            alignItems="center"
            justifyContent="center"
            spacing={0.5}
            sx={{
              width: "100%",
              height: "100%",
              color: "#9ca3af",
            }}
          >
            <ImageNotSupportedOutlinedIcon sx={{ fontSize: 28 }} />
            <Typography sx={{ fontSize: 10, fontWeight: 700, letterSpacing: 0.4 }}>
              NO IMAGE
            </Typography>
          </Stack>
        )}

        {outOfStock && (
          <Chip
            label="OUT OF STOCK"
            size="small"
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              fontSize: 10,
              fontWeight: 700,
              background: "#111827",
              color: "#fff",
            }}
          />
        )}

        {topBadge && (
          <Chip
            label={topBadge}
            size="small"
            sx={{
              position: "absolute",
              left: 8,
              top: 8,
              bgcolor: "#f59e0b",
              color: "#111827",
              fontWeight: 700,
            }}
          />
        )}
      </Box>

      <CardContent
        sx={{
          px: 0.25,
          py: 0.25,
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          gap: 0.5,
        }}
      >
        <Typography
          sx={{
            fontWeight: 700,
            fontSize: 14,
            lineHeight: 1.3,
            minHeight: "3.9em",
            maxHeight: "3.9em",
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            wordBreak: "break-word",
          }}
        >
          {safeProduct.name}
        </Typography>

        <Typography sx={{ fontWeight: 800, fontSize: 14, color: "#374151" }}>
          Rs {displayPrice.toFixed(2)}
          <Typography component="span" sx={{ fontSize: 11, color: "#6b7280", ml: 0.5 }}>
            / {selectedUnit.name}
          </Typography>
        </Typography>

        {units.length > 1 && (
          <Typography sx={{ fontSize: 11, color: "#6b7280" }}>
            {units.length} units available
          </Typography>
        )}

        <Box sx={{ minHeight: 16 }}>
          {metaInfo ? (
            <Typography
              variant="caption"
              color="text.secondary"
              title={metaInfo}
              sx={{
                lineHeight: 1.2,
                display: "-webkit-box",
                WebkitLineClamp: 1,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {metaInfo}
            </Typography>
          ) : null}
        </Box>
      </CardContent>

      {orderMode && !activeCartItem && (
        <CardActions sx={{ px: 0.25, pb: 0.25, pt: 0.5, mt: "auto" }}>
          <Button
            fullWidth
            onClick={() => onAdd?.(safeProduct, selectedUnit)}
            disabled={outOfStock}
            sx={{
              borderRadius: 1.25,
              py: 1,
              border: "none",
              background: outOfStock ? "#9ca3af" : "#2563eb",
              color: "#fff",
              fontWeight: 600,
              "&:hover": {
                background: outOfStock ? "#9ca3af" : "#1d4ed8",
              },
            }}
          >
            {outOfStock ? "Unavailable" : "Add to Cart"}
          </Button>
        </CardActions>
      )}

      {orderMode && activeCartItem && (
        <CardActions sx={{ px: 0.25, pb: 0.25, pt: 0.5, mt: "auto" }}>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            sx={{ width: "100%" }}
          >
            <Button
              onClick={() => onDec?.(safeProduct.id, selectedUnit.name)}
              sx={{
                width: 36,
                minWidth: 36,
                height: 36,
                borderRadius: "50%",
                bgcolor: "#e5e7eb",
                color: "#111827",
                fontSize: 18,
                fontWeight: 700,
                p: 0,
              }}
            >
              -
            </Button>
            <Typography fontWeight={800}>{activeCartItem.qty}</Typography>
            <Button
              onClick={() => onInc?.(safeProduct.id, selectedUnit.name)}
              sx={{
                width: 36,
                minWidth: 36,
                height: 36,
                borderRadius: "50%",
                bgcolor: "#e5e7eb",
                color: "#111827",
                fontSize: 18,
                fontWeight: 700,
                p: 0,
              }}
            >
              +
            </Button>
          </Stack>
        </CardActions>
      )}
    </Card>
  );
}

export default memo(ProductCard);
