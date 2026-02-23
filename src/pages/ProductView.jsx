import { useEffect, useMemo, useRef, useState } from "react";
import {
  AppBar,
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  Chip,
  Container,
  Dialog,
  Divider,
  IconButton,
  MenuItem,
  Paper,
  Select,
  Skeleton,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";
import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import CloseIcon from "@mui/icons-material/Close";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";

function normalizeUnits(units) {
  if (!Array.isArray(units)) return [{ name: "pcs", multiplier: 1 }];
  const valid = units.filter(
    (u) => u && typeof u.name === "string" && typeof u.multiplier === "number",
  );
  return valid.length ? valid : [{ name: "pcs", multiplier: 1 }];
}

function getProductImages(product) {
  const images = [];

  if (Array.isArray(product?.images)) {
    product.images.forEach((img) => {
      if (typeof img === "string" && img.trim()) images.push(img.trim());
    });
  }

  if (typeof product?.image === "string" && product.image.trim()) {
    images.push(product.image.trim());
  }

  return [...new Set(images)];
}

function formatCurrency(value) {
  const amount = Number(value || 0);
  return `Rs ${amount.toFixed(2)}`;
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
  const images = useMemo(
    () => getProductImages({ images: safeProduct.images, image: safeProduct.image }),
    [safeProduct.images, safeProduct.image],
  );

  const [selectedUnits, setSelectedUnits] = useState({});
  const [zoomOpen, setZoomOpen] = useState(false);
  const [imageIndexByProduct, setImageIndexByProduct] = useState({});
  const [loadedImages, setLoadedImages] = useState({});
  const [brokenImages, setBrokenImages] = useState({});
  const touchStartX = useRef(0);
  const requestedImagesRef = useRef(new Set());

  const categoryProducts = useMemo(
    () =>
      products.filter(
        (p) =>
          String(p.category_id || p.categoryId) ===
          String(safeProduct.category_id || safeProduct.categoryId),
      ),
    [products, safeProduct.category_id, safeProduct.categoryId],
  );

  const currentIndex = categoryProducts.findIndex((p) => p.id === safeProduct.id);
  const prevProduct =
    currentIndex >= 0 && categoryProducts.length > 1
      ? categoryProducts[(currentIndex - 1 + categoryProducts.length) % categoryProducts.length]
      : null;
  const nextProduct =
    currentIndex >= 0 && categoryProducts.length > 1
      ? categoryProducts[(currentIndex + 1) % categoryProducts.length]
      : null;

  const relatedProducts = useMemo(
    () => categoryProducts.filter((p) => p.id !== safeProduct.id).slice(0, 12),
    [categoryProducts, safeProduct.id],
  );
  const relatedWithImages = useMemo(
    () =>
      relatedProducts.map((item) => ({
        ...item,
        previewImage: getProductImages(item)[0] || "",
      })),
    [relatedProducts],
  );

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [safeProduct.id]);

  const selectedUnitName = selectedUnits[safeProduct.id] || units[0]?.name || "pcs";

  const selectedUnit =
    units.find((unit) => unit.name === selectedUnitName) ||
    units[0] || { name: "pcs", multiplier: 1 };

  const cartItem = cart.find(
    (item) => item.productId === safeProduct.id && item.unitName === selectedUnit.name,
  );

  const unitPrice = Number(safeProduct.price || 0) * Number(selectedUnit.multiplier || 1);
  const qty = cartItem?.qty || 1;
  const total = qty * unitPrice;
  const activeImageIndex = Math.min(
    imageIndexByProduct[safeProduct.id] || 0,
    Math.max(images.length - 1, 0),
  );
  const activeImage = images[activeImageIndex] || "";
  const activeImageLoaded = activeImage ? Boolean(loadedImages[activeImage]) : false;
  const activeImageBroken = activeImage ? Boolean(brokenImages[activeImage]) : false;
  const shouldShowImage = Boolean(activeImage) && !activeImageBroken;

  const outOfStock =
    safeProduct.out_of_stock === true ||
    safeProduct.stock === 0 ||
    safeProduct.available === false;

  const prefetchUrls = useMemo(() => {
    const nearActiveImages = images.length
      ? [
          images[activeImageIndex],
          images[(activeImageIndex + 1) % images.length],
          images[(activeImageIndex - 1 + images.length) % images.length],
        ]
      : [];

    const nextProductImage = nextProduct ? getProductImages(nextProduct)[0] : "";
    const prevProductImage = prevProduct ? getProductImages(prevProduct)[0] : "";
    const relatedPreviewImages = relatedWithImages
      .slice(0, 6)
      .map((item) => item.previewImage);

    return [...new Set([...nearActiveImages, nextProductImage, prevProductImage, ...relatedPreviewImages])]
      .filter(Boolean);
  }, [activeImageIndex, images, nextProduct, prevProduct, relatedWithImages]);

  useEffect(() => {
    if (typeof window === "undefined" || typeof window.Image === "undefined") return;

    prefetchUrls.forEach((url) => {
      if (!url || requestedImagesRef.current.has(url)) return;
      requestedImagesRef.current.add(url);

      const prefetchImage = new window.Image();
      prefetchImage.decoding = "async";
      prefetchImage.src = url;
      prefetchImage.onload = () => {
        setLoadedImages((prev) => (prev[url] ? prev : { ...prev, [url]: true }));
      };
      prefetchImage.onerror = () => {
        setBrokenImages((prev) => (prev[url] ? prev : { ...prev, [url]: true }));
      };
    });
  }, [prefetchUrls]);

  function onTouchStart(e) {
    touchStartX.current = e.touches[0].clientX;
  }

  function onTouchEnd(e) {
    const diff = e.changedTouches[0].clientX - touchStartX.current;
    if (diff < -60 && nextProduct) onChangeProduct(nextProduct);
    if (diff > 60 && prevProduct) onChangeProduct(prevProduct);
  }

  function gotoPrevImage(e) {
    e.stopPropagation();
    if (images.length < 2) return;
    setImageIndexByProduct((prev) => ({
      ...prev,
      [safeProduct.id]: ((prev[safeProduct.id] || 0) - 1 + images.length) % images.length,
    }));
  }

  function gotoNextImage(e) {
    e.stopPropagation();
    if (images.length < 2) return;
    setImageIndexByProduct((prev) => ({
      ...prev,
      [safeProduct.id]: ((prev[safeProduct.id] || 0) + 1) % images.length,
    }));
  }

  if (!product) return null;

  return (
    <Box sx={{ pb: { xs: 12, sm: 13 }, bgcolor: "#f2f5fa", minHeight: "100vh" }}>
      <AppBar
        position="sticky"
        color="inherit"
        elevation={0}
        sx={{
          borderBottom: "1px solid #e5e7eb",
          backgroundColor: "rgba(255,255,255,0.95)",
          backdropFilter: "blur(10px)",
        }}
      >
        <Toolbar sx={{ minHeight: 64 }}>
          <IconButton onClick={onBack} edge="start" sx={{ mr: 1 }}>
            <ArrowBackIcon />
          </IconButton>

          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography noWrap fontWeight={800}>
              {safeProduct.name}
            </Typography>
            <Typography variant="caption" color="text.secondary" noWrap>
              Product #{safeProduct.id ?? "-"}
            </Typography>
          </Box>

          {nextProduct ? (
            <Button
              variant="outlined"
              size="small"
              endIcon={<ArrowForwardIosRoundedIcon sx={{ fontSize: 14 }} />}
              onClick={() => onChangeProduct(nextProduct)}
              sx={{ borderRadius: 3 }}
            >
              Next
            </Button>
          ) : null}
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: { xs: 1.5, md: 2.5 } }}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Paper sx={{ borderRadius: 4, overflow: "hidden", border: "1px solid #e2e8f0" }}>
              <Box
                onTouchStart={onTouchStart}
                onTouchEnd={onTouchEnd}
                sx={{
                  width: "100%",
                  aspectRatio: "1 / 1",
                  position: "relative",
                  bgcolor: activeImage ? "#fff" : "#e2e8f0",
                  cursor: activeImage ? "zoom-in" : "default",
                }}
                onClick={() => shouldShowImage && setZoomOpen(true)}
              >
                {shouldShowImage ? (
                  <>
                    <Box
                      component="img"
                      src={activeImage}
                      alt={safeProduct.name}
                      loading="eager"
                      fetchPriority="high"
                      decoding="async"
                      onLoad={() =>
                        setLoadedImages((prev) =>
                          prev[activeImage] ? prev : { ...prev, [activeImage]: true },
                        )
                      }
                      onError={() =>
                        setBrokenImages((prev) =>
                          prev[activeImage] ? prev : { ...prev, [activeImage]: true },
                        )
                      }
                      sx={{
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                        objectPosition: "center",
                        p: 2,
                        opacity: activeImageLoaded ? 1 : 0,
                        transition: "opacity 180ms ease",
                      }}
                    />
                    {!activeImageLoaded ? (
                      <Skeleton
                        variant="rectangular"
                        animation="wave"
                        sx={{ position: "absolute", inset: 0, bgcolor: "#e2e8f0" }}
                      />
                    ) : null}
                  </>
                ) : (
                  <Stack
                    alignItems="center"
                    justifyContent="center"
                    spacing={1}
                    sx={{ width: "100%", height: "100%", color: "#64748b" }}
                  >
                    <Inventory2OutlinedIcon sx={{ fontSize: 42 }} />
                    <Typography variant="body2" fontWeight={700}>
                      NO IMAGE
                    </Typography>
                  </Stack>
                )}

                {images.length > 1 ? (
                  <>
                    <IconButton
                      onClick={gotoPrevImage}
                      size="small"
                      sx={{
                        position: "absolute",
                        top: "50%",
                        left: 10,
                        transform: "translateY(-50%)",
                        bgcolor: "rgba(17,24,39,0.6)",
                        color: "#fff",
                        "&:hover": { bgcolor: "rgba(17,24,39,0.75)" },
                      }}
                    >
                      <ChevronLeftRoundedIcon />
                    </IconButton>
                    <IconButton
                      onClick={gotoNextImage}
                      size="small"
                      sx={{
                        position: "absolute",
                        top: "50%",
                        right: 10,
                        transform: "translateY(-50%)",
                        bgcolor: "rgba(17,24,39,0.6)",
                        color: "#fff",
                        "&:hover": { bgcolor: "rgba(17,24,39,0.75)" },
                      }}
                    >
                      <ChevronRightRoundedIcon />
                    </IconButton>
                  </>
                ) : null}
              </Box>

              {images.length > 1 ? (
                <Stack
                  direction="row"
                  spacing={1}
                  sx={{
                    p: 1.25,
                    overflowX: "auto",
                    borderTop: "1px solid #e2e8f0",
                    bgcolor: "#f8fafc",
                  }}
                >
                  {images.map((img, index) => (
                    <Box
                      key={`${img}-${index}`}
                      component="button"
                      type="button"
                      onClick={() =>
                        setImageIndexByProduct((prev) => ({
                          ...prev,
                          [safeProduct.id]: index,
                        }))
                      }
                      sx={{
                        border: index === activeImageIndex ? "2px solid #2563eb" : "1px solid #cbd5e1",
                        borderRadius: 2,
                        p: 0,
                        overflow: "hidden",
                        flex: "0 0 auto",
                        width: 68,
                        height: 68,
                        bgcolor: "#fff",
                        cursor: "pointer",
                      }}
                    >
                      <Box
                        component="img"
                        src={img}
                        alt={`${safeProduct.name}-${index + 1}`}
                        loading="lazy"
                        decoding="async"
                        sx={{ width: "100%", height: "100%", objectFit: "contain", display: "block" }}
                      />
                    </Box>
                  ))}
                </Stack>
              ) : null}
            </Paper>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Paper
              sx={{
                p: { xs: 1.75, sm: 2.25 },
                borderRadius: 4,
                border: "1px solid #e2e8f0",
              }}
            >
              <Stack spacing={1.5}>
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                  <Chip
                    size="small"
                    color={outOfStock ? "error" : "success"}
                    label={outOfStock ? "Out of stock" : "In stock"}
                  />
                  <Chip
                    size="small"
                    variant="outlined"
                    label={safeProduct.category_name || "General"}
                  />
                </Stack>

                <Typography
                  sx={{
                    fontSize: { xs: 24, md: 30 },
                    lineHeight: 1.15,
                    fontWeight: 800,
                    letterSpacing: "-0.01em",
                    display: "-webkit-box",
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
                  {safeProduct.name}
                </Typography>

                <Box>
                  <Typography sx={{ fontSize: { xs: 28, md: 34 }, fontWeight: 900, color: "#0f172a" }}>
                    {formatCurrency(unitPrice)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    per {selectedUnit.name}
                  </Typography>
                </Box>

                <Stack direction={{ xs: "column", sm: "row" }} spacing={1} alignItems={{ sm: "center" }}>
                  <Typography fontWeight={700}>Unit</Typography>
                  <Select
                    size="small"
                    value={selectedUnit.name}
                    onChange={(e) =>
                      setSelectedUnits((prev) => ({
                        ...prev,
                        [safeProduct.id]: e.target.value,
                      }))
                    }
                    sx={{ minWidth: 160, bgcolor: "#fff" }}
                  >
                    {units.map((unit) => (
                      <MenuItem key={unit.name} value={unit.name}>
                        {unit.name}
                      </MenuItem>
                    ))}
                  </Select>
                </Stack>

                <Divider />

                <Stack spacing={0.75} color="text.secondary">
                  <Typography variant="body2">Swipe image left/right to jump between same category products.</Typography>
                  <Typography variant="body2">Tap image for fullscreen zoom view.</Typography>
                  <Typography variant="body2">Selected unit is remembered while this page is open.</Typography>
                </Stack>
              </Stack>
            </Paper>
          </Grid>
        </Grid>

        {relatedProducts.length ? (
          <Paper
            sx={{
              mt: 2,
              p: 1.5,
              borderRadius: 4,
              border: "1px solid #e2e8f0",
            }}
          >
            <Typography sx={{ fontWeight: 800, fontSize: 18, mb: 1 }}>
              More From This Category
            </Typography>
            <Stack direction="row" spacing={1.25} sx={{ overflowX: "auto", pb: 0.5 }}>
              {relatedWithImages.map((item) => (
                <Card
                  key={item.id}
                  sx={{
                    minWidth: 180,
                    maxWidth: 180,
                    borderRadius: 2.5,
                    border: "1px solid #e2e8f0",
                    flex: "0 0 auto",
                  }}
                >
                  <CardActionArea onClick={() => onChangeProduct(item)}>
                    <Box
                      sx={{
                        width: "100%",
                        aspectRatio: "1 / 1",
                        bgcolor: item.previewImage ? "#fff" : "#e2e8f0",
                        display: "grid",
                        placeItems: "center",
                        p: 1,
                      }}
                    >
                      {item.previewImage ? (
                        <Box
                          component="img"
                          src={item.previewImage}
                          alt={item.name}
                          loading="lazy"
                          decoding="async"
                          sx={{ width: "100%", height: "100%", objectFit: "contain" }}
                        />
                      ) : (
                        <Inventory2OutlinedIcon sx={{ color: "#94a3b8" }} />
                      )}
                    </Box>
                    <CardContent sx={{ p: 1.1 }}>
                      <Typography
                        sx={{
                          fontSize: 13,
                          fontWeight: 700,
                          lineHeight: 1.25,
                          minHeight: "2.5em",
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {item.name}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              ))}
            </Stack>
          </Paper>
        ) : null}
      </Container>

      <Paper
        elevation={10}
        sx={{
          position: "fixed",
          left: 0,
          right: 0,
          bottom: 0,
          borderTop: "1px solid #e2e8f0",
          p: 1.25,
          zIndex: 1200,
        }}
      >
        <Container maxWidth="lg">
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={1.25}
            alignItems={{ xs: "stretch", sm: "center" }}
          >
            <Box sx={{ flex: 1 }}>
              <Typography variant="caption" color="text.secondary">
                {qty} x {formatCurrency(unitPrice)} / {selectedUnit.name}
              </Typography>
              <Typography sx={{ fontSize: 26, lineHeight: 1.05, fontWeight: 900 }}>
                {formatCurrency(total)}
              </Typography>
            </Box>

            {!cartItem ? (
              <Button
                variant="contained"
                size="large"
                disabled={outOfStock}
                onClick={() => addToCart(safeProduct, selectedUnit)}
                sx={{
                  minWidth: { xs: "100%", sm: 220 },
                  borderRadius: 3,
                  py: 1.15,
                  fontWeight: 800,
                }}
              >
                {outOfStock ? "Unavailable" : "Add To Cart"}
              </Button>
            ) : (
              <Stack direction="row" spacing={1} alignItems="center" sx={{ minWidth: { sm: 220 } }}>
                <Button
                  variant="outlined"
                  onClick={() => decreaseQty(safeProduct.id, selectedUnit.name)}
                  sx={{ minWidth: 52, py: 1, borderRadius: 3 }}
                >
                  -
                </Button>
                <Typography sx={{ minWidth: 36, textAlign: "center", fontWeight: 800 }}>
                  {cartItem.qty}
                </Typography>
                <Button
                  variant="contained"
                  onClick={() => increaseQty(safeProduct.id, selectedUnit.name)}
                  sx={{ minWidth: 52, py: 1, borderRadius: 3 }}
                >
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
          sx={{ position: "absolute", top: 10, right: 10, color: "#fff", zIndex: 2 }}
        >
          <CloseIcon />
        </IconButton>
        <Box sx={{ bgcolor: "#000", width: "100%", height: "100%", display: "grid", placeItems: "center" }}>
          {activeImage ? (
            <Box
              component="img"
              src={activeImage}
              alt={safeProduct.name}
              sx={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }}
            />
          ) : (
            <Typography color="#fff">No image</Typography>
          )}
        </Box>
      </Dialog>
    </Box>
  );
}
