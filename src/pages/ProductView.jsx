import { useEffect, useMemo, useRef, useState } from "react";
import {
  AppBar,
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Container,
  Dialog,
  IconButton,
  MenuItem,
  Paper,
  Select,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CloseIcon from "@mui/icons-material/Close";

function normalizeUnits(units) {
  if (!Array.isArray(units)) return [{ name: "pcs", multiplier: 1 }];
  const valid = units.filter(
    (u) => u && typeof u.name === "string" && typeof u.multiplier === "number",
  );
  return valid.length ? valid : [{ name: "pcs", multiplier: 1 }];
}

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
  const safeProduct = product || {};

  const units = useMemo(() => normalizeUnits(safeProduct.units), [safeProduct.units]);
  const [selectedUnits, setSelectedUnits] = useState({});
  const [zoomOpen, setZoomOpen] = useState(false);
  const touchStartX = useRef(0);

  const categoryProducts = useMemo(() => {
    return products.filter(
      (p) =>
        String(p.category_id || p.categoryId) ===
        String(safeProduct.category_id || safeProduct.categoryId),
    );
  }, [products, safeProduct.category_id, safeProduct.categoryId]);

  const currentIndex = categoryProducts.findIndex((p) => p.id === safeProduct.id);
  const prevProduct =
    currentIndex >= 0 && categoryProducts.length
      ? categoryProducts[
          (currentIndex - 1 + categoryProducts.length) % categoryProducts.length
        ]
      : null;

  const nextProduct =
    currentIndex >= 0 && categoryProducts.length
      ? categoryProducts[(currentIndex + 1) % categoryProducts.length]
      : null;


  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [safeProduct.id]);

  const selectedUnitName = selectedUnits[safeProduct.id] || units[0]?.name || "pcs";
  const selectedUnit =
    units.find((u) => u.name === selectedUnitName) || units[0] || { name: "pcs", multiplier: 1 };

  const cartItem = cart.find(
    (c) => c.productId === safeProduct.id && c.unitName === selectedUnit.name,
  );

  const unitPrice = Number(safeProduct.price || 0) * Number(selectedUnit.multiplier || 1);
  const qty = cartItem?.qty || 1;
  const total = qty * unitPrice;

  function onTouchStart(e) {
    touchStartX.current = e.touches[0].clientX;
  }

  function onTouchEnd(e) {
    const diff = e.changedTouches[0].clientX - touchStartX.current;
    if (diff < -60 && nextProduct) onChangeProduct(nextProduct);
    if (diff > 60 && prevProduct) onChangeProduct(prevProduct);
  }

  if (!product) return null;

  return (
    <Box sx={{ pb: 12 }}>
      <AppBar position="sticky" color="inherit" elevation={0} sx={{ borderBottom: "1px solid #e5e7eb" }}>
        <Toolbar>
          <IconButton onClick={onBack} edge="start">
            <ArrowBackIcon />
          </IconButton>
          <Typography fontWeight={800} sx={{ ml: 1 }} noWrap>
            {safeProduct.name}
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" sx={{ pt: 2 }}>
        <Card sx={{ borderRadius: 3, overflow: "hidden", mb: 2 }}>
          <Box
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
            sx={{ bgcolor: "#f9fafb", cursor: "zoom-in" }}
            onClick={() => setZoomOpen(true)}
          >
            {safeProduct.images?.[0] ? (
              <CardMedia
                component="img"
                image={safeProduct.images[0]}
                alt={safeProduct.name}
                sx={{ width: "100%", maxHeight: { xs: 320, md: 440 }, objectFit: "contain" }}
              />
            ) : (
              <Box sx={{ height: 280, display: "grid", placeItems: "center", fontSize: 44 }}>
                📦
              </Box>
            )}
          </Box>

          <CardContent>
            <Stack spacing={1.25}>
              <Typography variant="h5" fontWeight={800}>
                {safeProduct.name}
              </Typography>

              <Stack direction="row" spacing={1} alignItems="center">
                <Chip label="Category" size="small" />
                <Typography color="text.secondary" variant="body2">
                  Swipe image to move between same category products
                </Typography>
              </Stack>

              <Typography fontSize={22} fontWeight={800} color="primary.main">
                ₹{unitPrice.toFixed(2)}
                <Typography component="span" variant="body2" color="text.secondary" sx={{ ml: 0.5 }}>
                  / {selectedUnit.name}
                </Typography>
              </Typography>

              <Stack direction={{ xs: "column", sm: "row" }} spacing={1.2} alignItems={{ sm: "center" }}>
                <Typography fontWeight={700}>Unit</Typography>
                <Select
                  size="small"
                  value={selectedUnit.name}
                  onChange={(e) => setSelectedUnits((prev) => ({ ...prev, [safeProduct.id]: e.target.value }))}
                  sx={{ minWidth: 140 }}
                >
                  {units.map((u) => (
                    <MenuItem key={u.name} value={u.name}>
                      {u.name}
                    </MenuItem>
                  ))}
                </Select>
              </Stack>
            </Stack>
          </CardContent>
        </Card>

        {categoryProducts.length > 1 && (
          <Paper sx={{ p: 1.5, mb: 2, bgcolor: "#f9fafb" }}>
            <Typography fontWeight={800} mb={1}>
              More from this category
            </Typography>
            <Stack direction="row" spacing={1.25} sx={{ overflowX: "auto", pb: 0.5 }}>
              {categoryProducts.map((p) => (
                <Card
                  key={p.id}
                  onClick={() => onChangeProduct(p)}
                  sx={{ minWidth: 140, cursor: "pointer", border: p.id === safeProduct.id ? "2px solid #2563eb" : "none" }}
                >
                  <CardMedia
                    component="img"
                    image={p.images?.[0] || ""}
                    alt={p.name}
                    sx={{ height: 90, objectFit: "contain", bgcolor: "#fff" }}
                  />
                  <CardContent sx={{ p: 1 }}>
                    <Typography fontSize={13} fontWeight={700} noWrap>
                      {p.name}
                    </Typography>
                  </CardContent>
                </Card>
              ))}
            </Stack>
          </Paper>
        )}
      </Container>

      <Paper
        elevation={8}
        sx={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          borderTop: "1px solid #e5e7eb",
          p: 1.25,
          zIndex: 999,
        }}
      >
        <Container maxWidth="md">
          <Stack direction="row" alignItems="center" spacing={2}>
            <Box sx={{ flex: 1 }}>
              <Typography variant="caption" color="text.secondary">
                {qty} × ₹{unitPrice.toFixed(2)} / {selectedUnit.name}
              </Typography>
              <Typography fontSize={22} fontWeight={800}>
                ₹{total.toFixed(2)}
              </Typography>
            </Box>

            {!cartItem ? (
              <Button
                variant="contained"
                size="large"
                onClick={() => addToCart(safeProduct, selectedUnit)}
                sx={{ bgcolor: "#2563eb" }}
              >
                Add
              </Button>
            ) : (
              <Stack direction="row" spacing={1} alignItems="center">
                <Button variant="outlined" onClick={() => decreaseQty(safeProduct.id, selectedUnit.name)}>
                  -
                </Button>
                <Typography fontWeight={700}>{cartItem.qty}</Typography>
                <Button variant="outlined" onClick={() => increaseQty(safeProduct.id, selectedUnit.name)}>
                  +
                </Button>
              </Stack>
            )}
          </Stack>
        </Container>
      </Paper>

      <Dialog open={zoomOpen} onClose={() => setZoomOpen(false)} fullScreen>
        <IconButton
          onClick={() => setZoomOpen(false)}
          sx={{ position: "absolute", top: 12, right: 12, color: "#fff", zIndex: 2 }}
        >
          <CloseIcon />
        </IconButton>
        <Box sx={{ bgcolor: "#000", height: "100%", display: "grid", placeItems: "center" }}>
          {safeProduct.images?.[0] ? (
            <img
              src={safeProduct.images[0]}
              alt={safeProduct.name}
              style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }}
            />
          ) : (
            <Typography color="#fff" fontSize={44}>
              📦
            </Typography>
          )}
        </Box>
      </Dialog>
    </Box>
  );
}
