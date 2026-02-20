import { useEffect, useMemo, useRef } from "react";
import {
  Badge,
  Box,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Chip,
  FormControlLabel,
  Grid,
  IconButton,
  Paper,
  Stack,
  Switch,
  TextField,
  Typography,
  Button,
} from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";

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
      elevation={2}
      sx={{
        height: "100%",
        borderRadius: 2,
        opacity: out ? 0.55 : 1,
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
        "&:hover": {
          transform: { md: "scale(1.02)" },
          boxShadow: { md: 8 },
        },
      }}
    >
      <Box sx={{ position: "relative" }}>
        <CardMedia
          component="img"
          height="150"
          image={product.images?.[0] || ""}
          alt={product.name}
          sx={{ objectFit: product.images?.[0] ? "cover" : "contain", bgcolor: "#f9fafb", cursor: "pointer" }}
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

      <CardContent sx={{ pb: 1 }}>
        <Typography fontWeight={700} noWrap>
          {product.name}
        </Typography>
        <Typography sx={{ color: "#16a34a", fontWeight: 800 }}>
          ₹{(product.price * (selectedUnit.multiplier || 1)).toFixed(2)}
          <Typography component="span" variant="caption" color="text.secondary" sx={{ ml: 0.5 }}>
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
        <CardActions sx={{ pt: 0, px: 2, pb: 2 }}>
          {!activeCartItem ? (
            <Button
              fullWidth
              variant="contained"
              disabled={out}
              onClick={() => onAdd?.(product, selectedUnit)}
              sx={{ borderRadius: 2, textTransform: "none", bgcolor: "#2563eb" }}
            >
              Add
            </Button>
          ) : (
            <Stack direction="row" spacing={1} alignItems="center" sx={{ width: "100%", justifyContent: "space-between" }}>
              <Button variant="outlined" onClick={() => onDec?.(product.id, selectedUnit.name)}>
                −
              </Button>
              <Typography fontWeight={700}>{activeCartItem.qty}</Typography>
              <Button variant="outlined" onClick={() => onInc?.(product.id, selectedUnit.name)}>
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

  return (
    <Box sx={{ maxWidth: 1400, mx: "auto", px: { xs: 1.5, sm: 2 }, pb: 11 }}>
      <Paper sx={{ p: 1.5, mb: 2, bgcolor: "#f9fafb", borderRadius: 2 }}>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} alignItems={{ xs: "stretch", sm: "center" }}>
          <TextField
            value={search || ""}
            onChange={(e) => {
              setSearch?.(e.target.value);
            }}
            size="small"
            fullWidth
            placeholder="Search products"
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

          <FormControlLabel
            control={
              <Switch
                checked={mostSellingOnly}
                onChange={() => setMostSellingOnly(!mostSellingOnly)}
                sx={{ "& .MuiSwitch-switchBase.Mui-checked": { color: "#2563eb" } }}
              />
            }
            label="Most Selling Only"
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
          />
        </Stack>
      </Paper>

      <Paper sx={{ p: 1.25, mb: 2, bgcolor: "#f9fafb", position: "sticky", top: 0, zIndex: 15 }}>
        <Stack direction="row" spacing={1} sx={{ overflowX: "auto", pb: 0.5, "&::-webkit-scrollbar": { display: "none" } }}>
          <Chip
            ref={(el) => {
              categoryRefs.current.all = el;
            }}
            label="All"
            clickable
            color={selectedCategory === "all" ? "primary" : "default"}
            variant={selectedCategory === "all" ? "filled" : "outlined"}
            onClick={() => setSelectedCategory("all")}
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
            />
          ))}
        </Stack>
      </Paper>

      {customerName && visiblePrevious.length > 0 && (
        <Paper sx={{ p: 2, mb: 2, borderRadius: 2, bgcolor: "#f9fafb" }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1.5}>
            <Typography fontWeight={800}>Previously Ordered by {customerName}</Typography>
            <Badge color="warning" badgeContent={visiblePrevious.length}>
              <TrendingUpIcon />
            </Badge>
          </Stack>

          <Grid container spacing={1.5}>
            {visiblePrevious.map((p) => (
              <Grid item key={`prev-${p.id}`} xs={6} sm={4} md={3}>
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
        <Typography fontWeight={800}>Products</Typography>
        <Badge color="primary" badgeContent={filtered.length}>
          <Inventory2Icon />
        </Badge>
      </Stack>

      <Grid container spacing={1.5}>
        {filtered.map((p) => (
          <Grid item key={p.id} xs={6} sm={4} md={3}>
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
            background: orderMode ? "#2563eb" : "rgba(15,23,42,0.6)",
            color: "#fff",
            fontWeight: 700,
            textTransform: "none",
            boxShadow: "0 10px 25px rgba(0,0,0,0.25)",
            transition: "all 0.25s ease",
            "&:hover": { opacity: 0.85 },
          }}
        >
          {orderMode ? "🛒 Order Mode" : "👁 View Mode"}
        </Button>
      </Box>
    </Box>
  );
}
