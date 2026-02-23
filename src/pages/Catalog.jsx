import { startTransition, useEffect, useMemo, useRef } from "react";
import {
  Badge,
  Box,
  Button,
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
import ViewAgendaIcon from "@mui/icons-material/ViewAgenda";
import ViewColumnIcon from "@mui/icons-material/ViewColumn";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ViewModuleIcon from "@mui/icons-material/ViewModule";
import GridViewIcon from "@mui/icons-material/GridView";
import ProductCard from "../components/ProductCard";

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
  showByCategory = false,
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

  const filteredMostSelling = useMemo(() => {
    let list = [...mostSellingProducts];

    if (selectedCategory && selectedCategory !== "all") {
      list = list.filter(
        (p) =>
          String(p.category_id || p.categoryId) === String(selectedCategory),
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
    mostSellingProducts,
    selectedCategory,
    search,
    imageFilter,
    showOutOfStock,
    sortOption,
  ]);

  const filteredProducts = useMemo(() => {
    let list = [...products];

    if (selectedCategory && selectedCategory !== "all") {
      list = list.filter(
        (p) =>
          String(p.category_id || p.categoryId) === String(selectedCategory),
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
    selectedCategory,
    search,
    imageFilter,
    showOutOfStock,
    sortOption,
  ]);

  const visiblePrevious = useMemo(() => {
    const filteredIds = new Set(filteredProducts.map((p) => String(p.id)));
    return previousOrderedProducts.filter((p) => filteredIds.has(String(p.id)));
  }, [previousOrderedProducts, filteredProducts]);

  const groupedProducts = useMemo(() => {
    if (!showByCategory) return [];

    const categoryOrder = new Map(
      categories.map((category, index) => [String(category.id), index]),
    );
    const categoryName = new Map(
      categories.map((category) => [String(category.id), category.name]),
    );
    const groups = new Map();

    filteredProducts.forEach((product) => {
      const key = String(product.category_id || product.categoryId || "uncategorized");
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push(product);
    });

    return Array.from(groups.entries())
      .map(([key, items]) => ({
        key,
        items,
        rank: categoryOrder.has(key) ? categoryOrder.get(key) : Number.MAX_SAFE_INTEGER,
        name: categoryName.get(key) || "Uncategorized",
      }))
      .sort((a, b) => a.rank - b.rank || a.name.localeCompare(b.name));
  }, [showByCategory, categories, filteredProducts]);

  const gridConfig = {
    list: { xs: 12, sm: 12, md: 12, lg: 12 },
    "grid-1": { xs: 12, sm: 12, md: 12, lg: 12 },
    "grid-2": { xs: 6, sm: 6, md: 6, lg: 6 },
    "grid-3": { xs: 6, sm: 4, md: 4, lg: 4 },
    "grid-4": { xs: 6, sm: 4, md: 3, lg: 3 },
  };

  const normalizedLayoutMode = gridConfig[layoutMode] ? layoutMode : "grid-3";
  const currentGrid = gridConfig[normalizedLayoutMode];

  const selectedCategoryKey = String(selectedCategory || "all");
  const selectedCategoryData = categories.find(
    (c) => String(c.id) === selectedCategoryKey,
  );

  const scrollableCategories = categories.filter(
    (c) => String(c.id) !== selectedCategoryKey,
  );

  useEffect(() => {
    const active = categoryRefs.current[selectedCategoryKey];
    if (active) {
      active.scrollIntoView({
        behavior: "smooth",
        inline: "nearest",
        block: "nearest",
      });
    }
  }, [selectedCategoryKey]);

  const chipStyles = (active, pinned = false) => ({
    borderRadius: 99,
    height: 34,
    px: 0.25,
    fontWeight: 700,
    transition: "all 220ms ease",
    borderColor: active ? "transparent" : "rgba(148,163,184,0.35)",
    color: active ? "#fff" : "#334155",
    background: active
      ? "linear-gradient(135deg, #2563eb, #1d4ed8)"
      : pinned
        ? "rgba(241,245,249,0.95)"
        : "rgba(255,255,255,0.92)",
    boxShadow: active ? "0 8px 16px rgba(37,99,235,0.28)" : "none",
    "&:hover": {
      background: active
        ? "linear-gradient(135deg, #2563eb, #1d4ed8)"
        : "rgba(226,232,240,0.9)",
    },
  });

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: { xs: "100%", md: "100%", lg: 1440 },
        mx: { xs: 0, lg: "auto" },
        px: { xs: 1, sm: 1.5, md: 2, lg: 2.5 },
        pb: 12,
        pt: 1,
        background: "linear-gradient(180deg, #f8fafc 0%, #f1f5ff 100%)",
      }}
    >
      <Paper
        elevation={0}
        sx={{
          p: 2,
          mb: 1.5,
          borderRadius: 2.5,
          border: "1px solid rgba(148,163,184,0.24)",
          boxShadow: "0 12px 30px rgba(15,23,42,0.08)",
          background: "rgba(255,255,255,0.88)",
          backdropFilter: "blur(10px)",
        }}
      >
        <Stack spacing={1.5}>
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={1.5}
            alignItems={{ xs: "stretch", md: "center" }}
          >
            <TextField
              value={search || ""}
              onChange={(e) => {
                setSearch?.(e.target.value);
              }}
              size="small"
              fullWidth
              placeholder="Search products"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 99,
                  bgcolor: "#fff",
                },
              }}
              InputProps={{
                endAdornment:
                  search || "" ? (
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

            <Divider
              flexItem
              orientation="vertical"
              sx={{ display: { xs: "none", md: "block" } }}
            />

            <Stack
              direction="row"
              spacing={2}
              alignItems="center"
              justifyContent="space-between"
              sx={{ flexWrap: "wrap" }}
            >
              <FormControlLabel
                control={
                  <Switch
                    checked={mostSellingOnly}
                    onChange={() => setMostSellingOnly(!mostSellingOnly)}
                    sx={{
                      "& .MuiSwitch-switchBase.Mui-checked": {
                        color: "#2563eb",
                      },
                    }}
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
                    sx={{
                      "& .MuiSwitch-switchBase.Mui-checked": {
                        color: "#16a34a",
                      },
                    }}
                  />
                }
                label="Show Out of Stock"
                sx={{ m: 0 }}
              />
            </Stack>
          </Stack>

          <Divider />

          <Stack
            direction={{ xs: "column", sm: "row" }}
            justifyContent="space-between"
            alignItems={{ xs: "flex-start", sm: "center" }}
            spacing={1.25}
          >
            <Typography
              variant="caption"
              sx={{
                color: "text.secondary",
                fontWeight: 600,
                letterSpacing: 0.2,
              }}
            >
              Layout
            </Typography>
            <ToggleButtonGroup
              size="small"
              exclusive
              value={normalizedLayoutMode}
              onChange={(_, value) => {
                if (value && gridConfig[value]) {
                  startTransition(() => {
                    setLayoutMode(value);
                  });
                }
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
              <ToggleButton value="list" aria-label="list">
                <ViewAgendaIcon fontSize="small" />
              </ToggleButton>
              <ToggleButton value="grid-1" aria-label="1 column">
                <ViewColumnIcon fontSize="small" />
              </ToggleButton>
              <ToggleButton value="grid-2" aria-label="2 columns">
                <DashboardIcon fontSize="small" />
              </ToggleButton>
              <ToggleButton value="grid-3" aria-label="3 columns">
                <ViewModuleIcon fontSize="small" />
              </ToggleButton>
              <ToggleButton value="grid-4" aria-label="4 columns">
                <GridViewIcon fontSize="small" />
              </ToggleButton>
            </ToggleButtonGroup>
          </Stack>
        </Stack>
      </Paper>

      <Paper
        elevation={0}
        sx={{
          p: 1.25,
          mb: 1.5,
          bgcolor: "rgba(255,255,255,0.95)",
          borderRadius: 2.5,
          border: "1px solid rgba(148,163,184,0.2)",
          position: "sticky",
          top: 8,
          zIndex: 15,
          boxShadow: "0 10px 22px rgba(15,23,42,0.09)",
          "&::after": {
            content: '""',
            position: "absolute",
            left: 10,
            right: 10,
            bottom: -8,
            height: 8,
            borderRadius: 8,
            background:
              "linear-gradient(180deg, rgba(15,23,42,0.16), rgba(15,23,42,0))",
            pointerEvents: "none",
          },
        }}
      >
        <Stack direction="row" alignItems="center" spacing={1.25}>
          <Stack
            direction="row"
            spacing={1}
            sx={{
              flexShrink: 0,
              pr: 1.25,
              mr: 0.5,
              borderRight: "1px solid rgba(148,163,184,0.25)",
            }}
          >
            <Chip
              ref={(el) => {
                categoryRefs.current.all = el;
              }}
              label="All"
              clickable
              onClick={() => setSelectedCategory("all")}
              sx={chipStyles(selectedCategoryKey === "all", true)}
            />

            {selectedCategoryKey !== "all" && selectedCategoryData && (
              <Chip
                ref={(el) => {
                  categoryRefs.current[selectedCategoryKey] = el;
                }}
                label={selectedCategoryData.name}
                clickable
                onClick={() => setSelectedCategory(selectedCategoryData.id)}
                sx={chipStyles(true, true)}
              />
            )}
          </Stack>

          <Box
            sx={{
              minWidth: 0,
              flex: 1,
              overflowX: "auto",
              scrollBehavior: "smooth",
              pb: 0.25,
              "&::-webkit-scrollbar": {
                height: 7,
              },
              "&::-webkit-scrollbar-thumb": {
                background: "rgba(148,163,184,0.45)",
                borderRadius: 99,
              },
              "&::-webkit-scrollbar-track": {
                background: "transparent",
              },
            }}
          >
            <Stack direction="row" spacing={1}>
              {scrollableCategories.map((c) => (
                <Chip
                  key={c.id}
                  ref={(el) => {
                    categoryRefs.current[String(c.id)] = el;
                  }}
                  label={c.name}
                  clickable
                  onClick={() => setSelectedCategory(c.id)}
                  sx={chipStyles(false)}
                />
              ))}
            </Stack>
          </Box>
        </Stack>
      </Paper>

      {customerName && visiblePrevious.length > 0 && (
        <Paper
          sx={{
            p: 2,
            mb: 1.75,
            borderRadius: 2.5,
            bgcolor: "#eef6ff",
            border: "1px solid rgba(37,99,235,0.2)",
          }}
        >
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            mb={1.75}
          >
            <Typography variant="h5" fontWeight={800} sx={{ fontSize: { xs: "1.35rem", sm: "1.5rem" } }}>
              Previously Ordered by {customerName}
            </Typography>
            <Badge color="warning" badgeContent={visiblePrevious.length}>
              <TrendingUpIcon />
            </Badge>
          </Stack>

          <Grid
            container
            spacing={2}
            alignItems="stretch"
          >
            {visiblePrevious.map((p) => (
              <Grid key={`prev-${p.id}`} size={currentGrid} sx={{ display: "flex" }}>
                <Box sx={{ flex: 1, display: "flex" }}>
                  <ProductCard
                    product={p}
                    cart={cart}
                    onView={setViewProduct}
                    onAdd={addToCart}
                    onInc={increaseQty}
                    onDec={decreaseQty}
                    layoutMode={normalizedLayoutMode}
                    orderMode={false}
                    topBadge="Previously Ordered"
                    metaInfo={`Qty ${p.previousStats.totalQtyPurchased} | Orders ${p.previousStats.totalTimesOrdered} | Rs ${p.previousStats.totalAmountPurchased.toFixed(0)}`}
                  />
                </Box>
              </Grid>
            ))}
          </Grid>
        </Paper>
      )}

      {mostSellingOnly && filteredMostSelling.length > 0 && (
        <>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            mb={1}
          >
            <Typography variant="h5" fontWeight={800} sx={{ fontSize: { xs: "1.35rem", sm: "1.5rem" } }}>
              Most Selling
            </Typography>
            <Badge color="warning" badgeContent={filteredMostSelling.length} max={999999}>
              <TrendingUpIcon />
            </Badge>
          </Stack>

          <Grid container spacing={2} alignItems="stretch">
            {filteredMostSelling.map((p) => (
              <Grid key={`ms-${p.id}`} size={currentGrid} sx={{ display: "flex" }}>
                <Box sx={{ flex: 1, display: "flex" }}>
                  <ProductCard
                    product={p}
                    cart={cart}
                    onView={setViewProduct}
                    onAdd={addToCart}
                    onInc={increaseQty}
                    onDec={decreaseQty}
                    layoutMode={normalizedLayoutMode}
                    orderMode={orderMode}
                    out={(p.stock ?? 0) <= 0}
                    topBadge="Most Selling"
                  />
                </Box>
              </Grid>
            ))}
          </Grid>

          <Divider sx={{ my: 2 }} />
        </>
      )}

      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
        <Typography variant="h5" fontWeight={800} sx={{ fontSize: { xs: "1.35rem", sm: "1.5rem" } }}>
          {showByCategory ? "Products By Category" : "Products"}
        </Typography>
        <Badge color="primary" badgeContent={filteredProducts.length} max={999999}>
          <Inventory2Icon />
        </Badge>
      </Stack>

      {!showByCategory && (
        <Grid
          container
          spacing={2}
          alignItems="stretch"
        >
          {filteredProducts.map((p) => (
            <Grid key={p.id} size={currentGrid} sx={{ display: "flex" }}>
              <Box sx={{ flex: 1, display: "flex" }}>
                <ProductCard
                  product={p}
                  cart={cart}
                  onView={setViewProduct}
                  onAdd={addToCart}
                  onInc={increaseQty}
                  onDec={decreaseQty}
                  layoutMode={normalizedLayoutMode}
                  orderMode={orderMode}
                  out={(p.stock ?? 0) <= 0}
                />
              </Box>
            </Grid>
          ))}
        </Grid>
      )}

      {showByCategory && groupedProducts.map((group) => (
        <Box key={group.key} sx={{ mb: 2 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
            <Typography fontWeight={800} color="text.secondary" sx={{ fontSize: { xs: "1.05rem", sm: "1.15rem" } }}>
              {group.name}
            </Typography>
            <Badge color="secondary" badgeContent={group.items.length} max={999999}>
              <Inventory2Icon fontSize="small" />
            </Badge>
          </Stack>

          <Grid container spacing={2} alignItems="stretch">
            {group.items.map((p) => (
              <Grid key={`${group.key}-${p.id}`} size={currentGrid} sx={{ display: "flex" }}>
                <Box sx={{ flex: 1, display: "flex" }}>
                  <ProductCard
                    product={p}
                    cart={cart}
                    onView={setViewProduct}
                    onAdd={addToCart}
                    onInc={increaseQty}
                    onDec={decreaseQty}
                    layoutMode={normalizedLayoutMode}
                    orderMode={orderMode}
                    out={(p.stock ?? 0) <= 0}
                  />
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>
      ))}

      <Box sx={{ position: "fixed", bottom: 20, right: 20, zIndex: 1000 }}>
        <Button
          onClick={() => setOrderMode(!orderMode)}
          sx={{
            borderRadius: 999,
            px: 3,
            py: 1.2,
            backdropFilter: "blur(10px)",
            background: orderMode
              ? "linear-gradient(135deg, #2563eb, #1d4ed8)"
              : "rgba(15,23,42,0.65)",
            color: "#fff",
            fontWeight: 700,
            textTransform: "none",
            boxShadow: "0 12px 26px rgba(0,0,0,0.22)",
            transition: "all 0.25s ease",
            "&:hover": { opacity: 0.9 },
          }}
        >
          {orderMode ? "Order Mode" : "View Mode"}
        </Button>
      </Box>
    </Box>
  );
}
