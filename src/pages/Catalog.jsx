import { useEffect, useMemo, useRef, useState } from "react";
import {
  Badge,
  Box,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
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
  Button,
} from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import ProductCard from "../components/ProductCard";

const columnToLayout = {
  1: "list",
  2: "grid-2",
  3: "grid-3",
  4: "grid-4",
};

const layoutToColumn = {
  list: 1,
  "grid-2": 2,
  "grid-3": 3,
  "grid-4": 4,
};

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
  layoutMode = "grid-3",
}) {
  const categoryScrollRef = useRef(null);
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);

  const selectedCategoryObj = useMemo(
    () => categories.find((c) => String(c.id) === String(selectedCategory)),
    [categories, selectedCategory],
  );

  const remainingCategories = useMemo(() => {
    if (!selectedCategoryObj) return categories;
    return categories.filter((c) => String(c.id) !== String(selectedCategoryObj.id));
  }, [categories, selectedCategoryObj]);

  const mostSellingProducts = useMemo(() => {
    const repeatMap = {};

    orders.forEach((order) => {
      (order.order_items || []).forEach((item) => {
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
      (order.order_items || []).forEach((item) => {
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
    if (categoryScrollRef.current) {
      categoryScrollRef.current.scrollTo({ left: 0, behavior: "auto" });
    }
  }, [selectedCategory]);

  const gridColumns = useMemo(() => {
    const col = layoutToColumn[layoutMode] || 3;
    if (col === 1) return { xs: 12, sm: 12, md: 12, lg: 12 };
    if (col === 2) return { xs: 6, sm: 6, md: 6, lg: 6 };
    if (col === 3) return { xs: 6, sm: 4, md: 4, lg: 3 };
    return { xs: 6, sm: 4, md: 3, lg: 3 };
  }, [layoutMode]);

  return (
    <Box sx={{ maxWidth: 1400, mx: "auto", px: { xs: 1.5, sm: 2 }, pb: 11 }}>
      <Paper sx={{ p: 1.5, mb: 2, bgcolor: "#f9fafb", borderRadius: 2, boxShadow: "0 4px 16px rgba(15,23,42,0.08)" }}>
        <Stack spacing={1.4}>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} alignItems={{ xs: "stretch", sm: "center" }}>
            <TextField
              value={search || ""}
              onChange={(e) => setSearch?.(e.target.value)}
              size="small"
              fullWidth
              placeholder="Search products"
              InputProps={{
                endAdornment: (search || "") ? (
                  <IconButton size="small" onClick={() => setSearch?.("")}>
                    <ClearIcon fontSize="small" />
                  </IconButton>
                ) : null,
              }}
            />

            <ToggleButtonGroup
              exclusive
              size="small"
              value={layoutToColumn[layoutMode] || 3}
              onChange={(_, value) => {
                if (!value) return;
                setLayoutMode?.(columnToLayout[value]);
              }}
            >
              <ToggleButton value={1}>1</ToggleButton>
              <ToggleButton value={2}>2</ToggleButton>
              <ToggleButton value={3}>3</ToggleButton>
              <ToggleButton value={4}>4</ToggleButton>
            </ToggleButtonGroup>
          </Stack>

          <Stack direction={{ xs: "column", sm: "row" }} spacing={1.2}>
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
        </Stack>
      </Paper>

      <Paper
        sx={{
          position: "sticky",
          top: 72,
          zIndex: 15,
          p: 1,
          mb: 2,
          borderRadius: 2,
          bgcolor: "#f9fafb",
          boxShadow: "0 4px 16px rgba(15,23,42,0.08)",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Box sx={{ position: "sticky", left: 0, zIndex: 4, display: "flex", gap: 1, pr: 1, bgcolor: "#f9fafb" }}>
            <Chip
              label="All"
              clickable
              color={selectedCategory === "all" ? "primary" : "default"}
              variant={selectedCategory === "all" ? "filled" : "outlined"}
              onClick={() => {
                if (selectedCategory === "all") {
                  setCategoryModalOpen(true);
                } else {
                  setSelectedCategory("all");
                }
              }}
            />

            {selectedCategory !== "all" && selectedCategoryObj && (
              <Chip
                label={selectedCategoryObj.name}
                clickable
                color="primary"
                variant="filled"
                onClick={() => setSelectedCategory(selectedCategoryObj.id)}
              />
            )}
          </Box>

          <Box
            ref={categoryScrollRef}
            sx={{
              display: "flex",
              gap: 1,
              overflowX: "auto",
              pb: 0.5,
              scrollBehavior: "smooth",
              "&::-webkit-scrollbar": { display: "none" },
            }}
          >
            {remainingCategories.map((c) => (
              <Chip
                key={c.id}
                label={c.name}
                clickable
                color={String(selectedCategory) === String(c.id) ? "primary" : "default"}
                variant={String(selectedCategory) === String(c.id) ? "filled" : "outlined"}
                onClick={() => setSelectedCategory(c.id)}
              />
            ))}
          </Box>
        </Box>
      </Paper>

      <Dialog open={categoryModalOpen} onClose={() => setCategoryModalOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Choose Category</DialogTitle>
        <DialogContent>
          <Grid container spacing={1.25} sx={{ pt: 0.5 }}>
            {categories.map((c) => (
              <Grid item xs={6} sm={4} key={`modal-cat-${c.id}`}>
                <Chip
                  label={c.name}
                  clickable
                  color={String(selectedCategory) === String(c.id) ? "primary" : "default"}
                  variant={String(selectedCategory) === String(c.id) ? "filled" : "outlined"}
                  onClick={() => {
                    setSelectedCategory(c.id);
                    setCategoryModalOpen(false);
                  }}
                  sx={{ width: "100%", justifyContent: "center" }}
                />
              </Grid>
            ))}
          </Grid>
        </DialogContent>
      </Dialog>

      {customerName && visiblePrevious.length > 0 && (
        <Paper sx={{ p: 2, mb: 2, borderRadius: 2, bgcolor: "#f9fafb", boxShadow: "0 4px 16px rgba(15,23,42,0.08)" }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1.2}>
            <Typography fontWeight={800}>Previously Ordered by {customerName}</Typography>
            <Badge color="warning" badgeContent={visiblePrevious.length} max={1000000}>
              <TrendingUpIcon />
            </Badge>
          </Stack>
          <Divider sx={{ mb: 1.5 }} />

          <Grid container spacing={1.5}>
            {visiblePrevious.map((p) => (
              <Grid item key={`prev-${p.id}`} {...gridColumns}>
                <ProductCard
                  product={p}
                  cart={cart}
                  onView={setViewProduct}
                  onAdd={addToCart}
                  onInc={increaseQty}
                  onDec={decreaseQty}
                  orderMode={orderMode}
                  out={(p.stock ?? 0) <= 0}
                  topBadge="Previously Ordered"
                  metaInfo={`Qty ${p.previousStats.totalQtyPurchased} • Orders ${p.previousStats.totalTimesOrdered} • ₹${p.previousStats.totalAmountPurchased.toFixed(0)}`}
                />
              </Grid>
            ))}
          </Grid>
        </Paper>
      )}

      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1.1}>
        <Typography fontWeight={800}>Products</Typography>
        <Badge color="primary" badgeContent={filtered.length} max={1000000}>
          <Inventory2Icon />
        </Badge>
      </Stack>
      <Divider sx={{ mb: 1.5 }} />

      <Grid container spacing={1.5}>
        {filtered.map((p) => (
          <Grid item key={p.id} {...gridColumns}>
            <ProductCard
              product={p}
              cart={cart}
              onView={setViewProduct}
              onAdd={addToCart}
              onInc={increaseQty}
              onDec={decreaseQty}
              orderMode={orderMode}
              out={(p.stock ?? 0) <= 0}
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
