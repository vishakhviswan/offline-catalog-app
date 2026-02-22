import { useEffect, useMemo, useRef } from "react";
import {
  Badge,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Chip,
  Divider,
  FormControlLabel,
  Grid,
  IconButton,
  Paper,
  Stack,
  Switch,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import ViewColumnIcon from "@mui/icons-material/ViewColumn";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ViewModuleIcon from "@mui/icons-material/ViewModule";
import GridViewIcon from "@mui/icons-material/GridView";

function normalizeUnits(units) {
  if (!Array.isArray(units) || units.length === 0) {
    return [{ name: "pcs", multiplier: 1 }];
  }

  const validUnits = units.filter(
    (u) => u && typeof u.name === "string" && typeof u.multiplier === "number",
  );

  return validUnits.length ? validUnits : [{ name: "pcs", multiplier: 1 }];
}

function CatalogProductCard({
  product,
  cart,
  onView,
  onAdd,
  onInc,
  onDec,
  orderMode,
  viewOnly = false,
  badgeText,
  summaryText,
}) {
  const units = normalizeUnits(product.units);
  const selectedUnit = units[0];

  const activeCartItem = cart.find(
    (c) => c.productId === product.id && c.unitName === selectedUnit.name,
  );

  const out = (product.stock ?? 0) <= 0;

  return (
    <Card
      elevation={0}
      sx={{
        height: "100%",
        borderRadius: 2.25,
        border: "1px solid",
        borderColor: "rgba(148,163,184,0.2)",
        background: "linear-gradient(140deg, rgba(255,255,255,0.95), rgba(248,250,252,0.92))",
        backdropFilter: "blur(6px)",
        opacity: out ? 0.6 : 1,
        transition: "transform 260ms ease, box-shadow 260ms ease, border-color 260ms ease",
        boxShadow: "0 8px 24px rgba(15,23,42,0.08)",
        display: "flex",
        flexDirection: "column",
        "@media (hover: hover) and (pointer: fine)": {
          "&:hover": {
            transform: "translateY(-4px)",
            boxShadow: "0 16px 28px rgba(15,23,42,0.12)",
            borderColor: "rgba(37,99,235,0.3)",
          },
        },
      }}
    >
      <Box sx={{ p: 1.25, pb: 0.5 }}>
        <Box
          sx={{
            position: "relative",
            borderRadius: 2,
            overflow: "hidden",
            boxShadow: "0 6px 18px rgba(15,23,42,0.12)",
            bgcolor: "#f8fafc",
          }}
        >
          <CardMedia
            component="img"
            height="160"
            image={product.images?.[0] || ""}
            alt={product.name}
            sx={{ objectFit: product.images?.[0] ? "cover" : "contain", cursor: "pointer" }}
            onClick={() => onView?.(product)}
          />

          {!product.images?.[0] && (
            <Box
              sx={{
                position: "absolute",
                inset: 0,
                display: "grid",
                placeItems: "center",
                fontSize: 32,
                pointerEvents: "none",
              }}
            >
              📦
            </Box>
          )}

          {badgeText && (
            <Chip
              label={badgeText}
              size="small"
              sx={{
                position: "absolute",
                top: 8,
                right: 8,
                bgcolor: "#f59e0b",
                color: "#111827",
                fontWeight: 700,
                borderRadius: 999,
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
                borderRadius: 999,
              }}
            />
          )}
        </Box>
      </Box>

      <CardContent sx={{ pb: 1, px: 1.5, pt: 0.75, flexGrow: 1 }}>
        <Typography fontWeight={700} sx={{ fontSize: { xs: 14, sm: 15 }, mb: 0.5 }} noWrap>
          {product.name}
        </Typography>
        <Typography sx={{ color: "#16a34a", fontWeight: 800, fontSize: { xs: 15, sm: 16 } }}>
          ₹{(product.price * (selectedUnit.multiplier || 1)).toFixed(2)}
          <Typography component="span" variant="caption" color="text.secondary" sx={{ ml: 0.75 }}>
            / {selectedUnit.name}
          </Typography>
        </Typography>
        {summaryText && (
          <Typography variant="caption" color="text.secondary" noWrap title={summaryText}>
            {summaryText}
          </Typography>
        )}
      </CardContent>

      {!viewOnly && orderMode && (
        <CardActions sx={{ pt: 0, px: 1.5, pb: 1.5 }}>
          {!activeCartItem ? (
            <Button
              fullWidth
              variant="contained"
              disabled={out}
              onClick={() => onAdd?.(product, selectedUnit)}
              sx={{
                borderRadius: 99,
                textTransform: "none",
                fontWeight: 700,
                py: 1,
                background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
                boxShadow: "0 8px 18px rgba(37,99,235,0.28)",
              }}
            >
              Add to cart
            </Button>
          ) : (
            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
              sx={{
                width: "100%",
                justifyContent: "space-between",
                p: 0.5,
                borderRadius: 99,
                border: "1px solid rgba(37,99,235,0.2)",
                bgcolor: "rgba(37,99,235,0.05)",
              }}
            >
              <Button
                variant="contained"
                onClick={() => onDec?.(product.id, selectedUnit.name)}
                sx={{ minWidth: 36, borderRadius: 99, px: 0, bgcolor: "#e2e8f0", color: "#0f172a" }}
              >
                −
              </Button>
              <Typography fontWeight={800} sx={{ minWidth: 22, textAlign: "center" }}>
                {activeCartItem.qty}
              </Typography>
              <Button
                variant="contained"
                onClick={() => onInc?.(product.id, selectedUnit.name)}
                sx={{ minWidth: 36, borderRadius: 99, px: 0, bgcolor: "#2563eb" }}
              >
                +
              </Button>
            </Stack>
          )}
        </CardActions>
      )}
    </Card>
  );
}

export default function Catalog({
  categories = [],
  selectedCategory,
  setSelectedCategory,
  products = [],
  cart = [],
  addToCart,
  increaseQty,
  decreaseQty,
  setViewProduct,
  setOrderMode,
  layoutMode,
  setLayoutMode,
  imageFilter,
  sortOption,
  search,
  setSearch,
  orderMode,
  showOutOfStock,
  setShowOutOfStock,
  mostSellingOnly,
  setMostSellingOnly,
  orders = [],
  customerName = "",
}) {
  const categoryRefs = useRef({});

  const mostSellingProducts = useMemo(() => {
    const repeatMap = {};

    orders.forEach((order) => {
      order.order_items?.forEach((item) => {
        const productId = String(item.product_id);
        repeatMap[productId] = (repeatMap[productId] || 0) + 1;
      });
    });

    return [...products]
      .filter((p) => repeatMap[String(p.id)])
      .sort((a, b) => repeatMap[String(b.id)] - repeatMap[String(a.id)]);
  }, [orders, products]);

  const previousOrderedProducts = useMemo(() => {
    if (!customerName) return [];

    const customerOrders = orders.filter(
      (order) => order.customer_name === customerName,
    );

    const aggregateMap = {};

    customerOrders.forEach((order) => {
      order.order_items?.forEach((item) => {
        const key = String(item.product_id);
        const qty = Number(item.qty || 0);
        const unitMultiplier = Number(item.unit_multiplier || 1);
        const lineAmount = qty * Number(item.price || 0) * unitMultiplier;

        if (!aggregateMap[key]) {
          aggregateMap[key] = {
            totalQtyPurchased: 0,
            totalTimesOrdered: 0,
            totalAmountPurchased: 0,
          };
        }

        aggregateMap[key].totalQtyPurchased += qty;
        aggregateMap[key].totalTimesOrdered += 1;
        aggregateMap[key].totalAmountPurchased += lineAmount;
      });
    });

    return Object.entries(aggregateMap)
      .map(([id, stats]) => {
        const product = products.find((p) => String(p.id) === id);
        if (!product) return null;

        return {
          ...product,
          previousStats: stats,
        };
      })
      .filter(Boolean)
      .sort(
        (a, b) =>
          b.previousStats.totalTimesOrdered - a.previousStats.totalTimesOrdered,
      );
  }, [customerName, orders, products]);

  const filtered = useMemo(() => {
    let list = mostSellingOnly ? [...mostSellingProducts] : [...products];

    if (selectedCategory && selectedCategory !== "all") {
      list = list.filter(
        (p) => String(p.category_id || p.categoryId) === String(selectedCategory),
      );
    }

    if (search) {
      list = list.filter((p) =>
        p.name?.toLowerCase().includes(search.toLowerCase()),
      );
    }

    if (imageFilter === "with") {
      list = list.filter((p) => p.images?.length);
    }

    if (imageFilter === "without") {
      list = list.filter((p) => !p.images?.length);
    }

    if (!showOutOfStock) {
      list = list.filter((p) => (p.stock ?? 0) > 0);
    }

    if (sortOption === "price-low") {
      list.sort((a, b) => a.price - b.price);
    }

    if (sortOption === "price-high") {
      list.sort((a, b) => b.price - a.price);
    }

    if (sortOption === "az") {
      list.sort((a, b) => a.name.localeCompare(b.name));
    }

    return list;
  }, [
    products,
    mostSellingProducts,
    mostSellingOnly,
    selectedCategory,
    search,
    imageFilter,
    showOutOfStock,
    sortOption,
  ]);

  const visiblePrevious = useMemo(() => {
    const filteredIds = new Set(filtered.map((p) => String(p.id)));
    return previousOrderedProducts.filter((p) => filteredIds.has(String(p.id)));
  }, [previousOrderedProducts, filtered]);

  useEffect(() => {
    const active = categoryRefs.current[String(selectedCategory || "all")];
    if (active) {
      active.scrollIntoView({ behavior: "smooth", inline: "start", block: "nearest" });
    }
  }, [selectedCategory]);

  const gridColumns = {
    "grid-1": { xs: 12 },
    "grid-2": { xs: 6, md: 6 },
    "grid-3": { xs: 6, sm: 4, md: 4 },
    "grid-4": { xs: 6, sm: 4, md: 3 },
  };

  const currentGrid = gridColumns[layoutMode] || gridColumns["grid-3"];

  return (
    <Box
      sx={{
        maxWidth: 1440,
        mx: "auto",
        px: { xs: 1.5, sm: 2.5 },
        pb: 12,
        pt: 1,
        background: "linear-gradient(180deg, #f8fafc 0%, #f1f5ff 100%)",
      }}
    >
      <Paper
        elevation={0}
        sx={{
          p: 2,
          mb: 2,
          borderRadius: 2.5,
          border: "1px solid rgba(148,163,184,0.24)",
          boxShadow: "0 12px 30px rgba(15,23,42,0.08)",
          background: "rgba(255,255,255,0.88)",
          backdropFilter: "blur(10px)",
        }}
      >
        <Stack spacing={1.5}>
          <Stack direction={{ xs: "column", md: "row" }} spacing={1.5} alignItems={{ xs: "stretch", md: "center" }}>
            <TextField
              value={search || ""}
              onChange={(e) => {
                setSearch?.(e.target.value);
              }}
              size="small"
              fullWidth
              placeholder="Search products"
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 99, bgcolor: "#fff" } }}
              InputProps={{
                endAdornment: (search || "") ? (
                  <IconButton
                    size="small"
                    onClick={() => {
                      setSearch?.("");
                    }}
                  >
                    <ClearIcon fontSize="small" />
                  </IconButton>
                ) : null,
              }}
            />

            <Divider flexItem orientation="vertical" sx={{ display: { xs: "none", md: "block" } }} />

            <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between" sx={{ flexWrap: "wrap" }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={mostSellingOnly}
                    onChange={() => setMostSellingOnly(!mostSellingOnly)}
                    sx={{ "& .MuiSwitch-switchBase.Mui-checked": { color: "#2563eb" } }}
                  />
                }
                label="Most Selling"
                sx={{ m: 0 }}
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={showOutOfStock}
                    onChange={() => setShowOutOfStock(!showOutOfStock)}
                    sx={{ "& .MuiSwitch-switchBase.Mui-checked": { color: "#16a34a" } }}
                  />
                }
                label="Show Out of Stock"
                sx={{ m: 0 }}
              />
            </Stack>
          </Stack>

          <Divider />

          <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems={{ xs: "flex-start", sm: "center" }} spacing={1.25}>
            <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 600, letterSpacing: 0.2 }}>
              Layout
            </Typography>
            <ToggleButtonGroup
              size="small"
              exclusive
              value={layoutMode}
              onChange={(_, value) => {
                if (value) setLayoutMode?.(value);
              }}
              sx={{
                bgcolor: "#eef2ff",
                borderRadius: 99,
                p: 0.5,
                "& .MuiToggleButton-root": {
                  border: "none",
                  borderRadius: 99,
                  px: 1.2,
                  color: "#475569",
                  transition: "all 220ms ease",
                },
                "& .Mui-selected": {
                  bgcolor: "#2563eb !important",
                  color: "#fff !important",
                  boxShadow: "0 8px 14px rgba(37,99,235,0.28)",
                },
              }}
            >
              <ToggleButton value="grid-1" aria-label="1 column"><ViewColumnIcon fontSize="small" /></ToggleButton>
              <ToggleButton value="grid-2" aria-label="2 columns"><DashboardIcon fontSize="small" /></ToggleButton>
              <ToggleButton value="grid-3" aria-label="3 columns"><ViewModuleIcon fontSize="small" /></ToggleButton>
              <ToggleButton value="grid-4" aria-label="4 columns"><GridViewIcon fontSize="small" /></ToggleButton>
            </ToggleButtonGroup>
          </Stack>
        </Stack>
      </Paper>

      <Paper
        elevation={0}
        sx={{
          p: 1.25,
          mb: 2,
          bgcolor: "rgba(255,255,255,0.92)",
          borderRadius: 2.5,
          border: "1px solid rgba(148,163,184,0.2)",
          position: "sticky",
          top: 8,
          zIndex: 15,
          boxShadow: "0 8px 20px rgba(15,23,42,0.08)",
        }}
      >
        <Stack direction="row" spacing={1} sx={{ overflowX: "auto", pb: 0.5, px: 0.25, "&::-webkit-scrollbar": { display: "none" } }}>
          <Chip
            ref={(el) => {
              categoryRefs.current.all = el;
            }}
            label="All"
            clickable
            color={selectedCategory === "all" ? "primary" : "default"}
            variant={selectedCategory === "all" ? "filled" : "outlined"}
            onClick={() => setSelectedCategory("all")}
            sx={{ borderRadius: 99, fontWeight: 700, transition: "all 220ms ease" }}
          />
          {categories.map((c) => (
            <Chip
              key={c.id}
              ref={(el) => {
                categoryRefs.current[String(c.id)] = el;
              }}
              label={c.name}
              clickable
              color={String(selectedCategory) === String(c.id) ? "primary" : "default"}
              variant={String(selectedCategory) === String(c.id) ? "filled" : "outlined"}
              onClick={() => setSelectedCategory(c.id)}
              sx={{ borderRadius: 99, fontWeight: 700, transition: "all 220ms ease" }}
            />
          ))}
        </Stack>
      </Paper>

      {customerName && visiblePrevious.length > 0 && (
        <Paper sx={{ p: 2, mb: 2.5, borderRadius: 2.5, bgcolor: "#eef6ff", border: "1px solid rgba(37,99,235,0.2)" }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1.75}>
            <Typography variant="h6" fontWeight={800}>Previously Ordered by {customerName}</Typography>
            <Badge color="warning" badgeContent={visiblePrevious.length}>
              <TrendingUpIcon />
            </Badge>
          </Stack>

          <Grid container spacing={{ xs: 1.5, sm: 2 }}>
            {visiblePrevious.map((p) => (
              <Grid item key={`prev-${p.id}`} {...currentGrid} sx={{ transition: "all 260ms ease" }}>
                <CatalogProductCard
                  product={p}
                  cart={cart}
                  onView={setViewProduct}
                  onAdd={addToCart}
                  onInc={increaseQty}
                  onDec={decreaseQty}
                  orderMode={false}
                  viewOnly
                  badgeText="Previously Ordered"
                  summaryText={`Qty ${p.previousStats.totalQtyPurchased} • Orders ${p.previousStats.totalTimesOrdered} • ₹${p.previousStats.totalAmountPurchased.toFixed(0)}`}
                />
              </Grid>
            ))}
          </Grid>
        </Paper>
      )}

      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1.5}>
        <Typography variant="h6" fontWeight={800}>Products</Typography>
        <Badge color="primary" badgeContent={filtered.length}>
          <Inventory2Icon />
        </Badge>
      </Stack>

      <Grid container spacing={{ xs: 1.5, sm: 2.25 }}>
        {filtered.map((p) => (
          <Grid item key={p.id} {...currentGrid} sx={{ transition: "all 260ms ease" }}>
            <CatalogProductCard
              product={p}
              cart={cart}
              onView={setViewProduct}
              onAdd={addToCart}
              onInc={increaseQty}
              onDec={decreaseQty}
              orderMode={orderMode}
            />
          </Grid>
        ))}
      </Grid>

      <Box sx={{ position: "fixed", bottom: 20, right: 20, zIndex: 1000 }}>
        <Button
          onClick={() => setOrderMode(!orderMode)}
          sx={{
            borderRadius: 999,
            px: 3,
            py: 1.2,
            backdropFilter: "blur(10px)",
            background: orderMode ? "linear-gradient(135deg, #2563eb, #1d4ed8)" : "rgba(15,23,42,0.65)",
            color: "#fff",
            fontWeight: 700,
            textTransform: "none",
            boxShadow: "0 12px 26px rgba(0,0,0,0.22)",
            transition: "all 0.25s ease",
            "&:hover": { opacity: 0.9 },
          }}
        >
          {orderMode ? "🛒 Order Mode" : "👁 View Mode"}
        </Button>
      </Box>
    </Box>
  );
}
