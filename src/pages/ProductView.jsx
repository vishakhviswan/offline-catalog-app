import { useEffect, useMemo, useRef, useState } from "react";
import {
  Box,
  Stack,
  Typography,
  Button,
  IconButton,
  Chip,
  Dialog,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CloseIcon from "@mui/icons-material/Close";

/* ================= UNIT NORMALIZER ================= */
function normalizeUnits(units) {
  if (!Array.isArray(units)) return [{ name: "pcs", multiplier: 1 }];
  const valid = units.filter(
    (u) => u && typeof u.name === "string" && typeof u.multiplier === "number",
  );
  return valid.length ? valid : [{ name: "pcs", multiplier: 1 }];
}

/* ======================================================
   PRODUCT VIEW – v0.3 PREMIUM
====================================================== */

export default function ProductView({
  product,
  products = [],
  cart = [],
  addToCart,
  increaseQty,
  decreaseQty,
  onBack,
  onChangeProduct,
}) {
  if (!product) return null;

  /* ================= CATEGORY PRODUCTS (FIXED + LOOP) ================= */

  const categoryProducts = useMemo(() => {
    return products.filter(
      (p) =>
        (p.category_id || p.categoryId) ===
        (product.category_id || product.categoryId),
    );
  }, [products, product]);

  const currentIndex = categoryProducts.findIndex((p) => p.id === product.id);

  const prevProduct =
    categoryProducts[
      (currentIndex - 1 + categoryProducts.length) % categoryProducts.length
    ];

  const nextProduct =
    categoryProducts[(currentIndex + 1) % categoryProducts.length];

  /* ================= CART + UNIT ================= */

  const cartItem = cart.find((c) => c.productId === product.id);
  const units = normalizeUnits(product.units);

  const [selectedUnit, setSelectedUnit] = useState(units[0]);
  const [zoomOpen, setZoomOpen] = useState(false);

  useEffect(() => {
    setSelectedUnit(normalizeUnits(product.units)[0]);
  }, [product]);

  const unitPrice = product.price * selectedUnit.multiplier;
  const qty = cartItem?.qty || 1;
  const total = qty * unitPrice;

  /* ================= SWIPE ================= */

  const touchStartX = useRef(0);

  function onTouchStart(e) {
    touchStartX.current = e.touches[0].clientX;
  }

  function onTouchEnd(e) {
    const diff = e.changedTouches[0].clientX - touchStartX.current;
    if (diff < -60) onChangeProduct(nextProduct);
    if (diff > 60) onChangeProduct(prevProduct);
  }

  /* ================= UI ================= */

  return (
    <Box sx={{ pb: 12 }}>
      {/* ================= IMAGE HERO ================= */}
      <Box
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        sx={{
          height: "65vh",
          background: "#f3f4f6",
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        onClick={() => setZoomOpen(true)}
      >
        <IconButton
          onClick={(e) => {
            e.stopPropagation();
            onBack();
          }}
          sx={{
            position: "absolute",
            top: 12,
            left: 12,
            background: "rgba(0,0,0,0.55)",
            color: "#fff",
          }}
        >
          <ArrowBackIcon />
        </IconButton>

        {product.images?.[0] ? (
          <img
            src={product.images[0]}
            alt={product.name}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
            }}
          />
        ) : (
          <Typography fontSize={40}>📦</Typography>
        )}
      </Box>

      {/* ================= INFO SHEET ================= */}
      <Box sx={{ p: 2 }}>
        <Typography fontSize={22} fontWeight={800}>
          {product.name}
        </Typography>

        <Chip label="Category" size="small" sx={{ mt: 0.5, mb: 1 }} />

        <Typography fontSize={20} fontWeight={800} color="primary">
          ₹{unitPrice}{" "}
          <Typography component="span" fontSize={13} color="text.secondary">
            / {selectedUnit.name}
          </Typography>
        </Typography>

        {/* ================= UNIT PILLS ================= */}
        {units.length > 1 && (
          <Stack direction="row" spacing={1} mt={2}>
            {units.map((u) => (
              <Button
                key={u.name}
                variant={
                  selectedUnit.name === u.name ? "contained" : "outlined"
                }
                onClick={() => setSelectedUnit(u)}
                size="small"
              >
                {u.name}
              </Button>
            ))}
          </Stack>
        )}
      </Box>

      {/* ================= SAME CATEGORY ================= */}
      {categoryProducts.length > 1 && (
        <Box sx={{ px: 2 }}>
          <Typography fontWeight={800} mb={1}>
            More from this category
          </Typography>

          <Box
            sx={{
              display: "flex",
              gap: 1.5,
              overflowX: "auto",
              pb: 2,
            }}
          >
            {categoryProducts.map((p) => (
              <Box
                key={p.id}
                sx={{
                  minWidth: 140,
                  background: "#fff",
                  borderRadius: 2,
                  p: 1,
                  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                  cursor: "pointer",
                }}
                onClick={() => onChangeProduct(p)}
              >
                <Box
                  sx={{
                    height: 90,
                    background: "#f3f4f6",
                    borderRadius: 1,
                    mb: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {p.images?.[0] ? (
                    <img
                      src={p.images[0]}
                      alt={p.name}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                      }}
                    />
                  ) : (
                    "📦"
                  )}
                </Box>
                <Typography fontSize={13} fontWeight={700}>
                  {p.name}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      )}

      {/* ================= STICKY BAR ================= */}
      <Box
        sx={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          background: "#fff",
          borderTop: "1px solid #e5e7eb",
          p: 1.5,
          display: "flex",
          alignItems: "center",
          gap: 2,
          zIndex: 999,
        }}
      >
        <Box flex={1}>
          <Typography fontSize={13} color="text.secondary">
            {qty} × ₹{unitPrice} / {selectedUnit.name}
          </Typography>
          <Typography fontSize={22} fontWeight={800}>
            ₹{total}
          </Typography>
        </Box>

        {!cartItem ? (
          <Button
            variant="contained"
            size="large"
            onClick={() => addToCart(product, selectedUnit)}
          >
            Add
          </Button>
        ) : (
          <Stack direction="row" spacing={1}>
            <Button onClick={() => decreaseQty(product.id)}>-</Button>
            <Typography fontWeight={700}>{cartItem.qty}</Typography>
            <Button onClick={() => increaseQty(product.id)}>+</Button>
          </Stack>
        )}
      </Box>

      {/* ================= ZOOM MODAL ================= */}
      <Dialog open={zoomOpen} onClose={() => setZoomOpen(false)} fullScreen>
        <IconButton
          onClick={() => setZoomOpen(false)}
          sx={{ position: "absolute", top: 12, right: 12, color: "#fff" }}
        >
          <CloseIcon />
        </IconButton>

        <Box
          sx={{
            background: "#000",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <img
            src={product.images?.[0]}
            alt={product.name}
            style={{
              maxWidth: "100%",
              maxHeight: "100%",
              objectFit: "contain",
            }}
          />
        </Box>
      </Dialog>
    </Box>
  );
}
