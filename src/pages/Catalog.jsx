import { Box, Button, Typography } from "@mui/material";
import ProductCard from "../components/ProductCard";
import { useMemo } from "react";

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
  layoutMode,
  search,
  orderMode,
  showOutOfStock,
  setShowOutOfStock,
  mostSellingOnly,
  setMostSellingOnly,
  salesMap = {},
}) {
  /* ================= FILTER + SORT ================= */

  const filtered = useMemo(() => {
    let list = [...products];

    // CATEGORY
    if (selectedCategory && selectedCategory !== "all") {
      list = list.filter(
        (p) => (p.category_id || p.categoryId) === selectedCategory,
      );
    }

    // SEARCH
    if (search) {
      list = list.filter((p) =>
        p.name?.toLowerCase().includes(search.toLowerCase()),
      );
    }

    // IMAGE FILTER
    if (imageFilter === "with") {
      list = list.filter((p) => p.images?.length);
    }

    if (imageFilter === "without") {
      list = list.filter((p) => !p.images?.length);
    }

    // MOST SELLING
    if (mostSellingOnly) {
      list = list.filter((p) => (salesMap[p.id] ?? 0) > 0);
    }

    // OUT OF STOCK
    if (!showOutOfStock) {
      list = list.filter((p) => (p.stock ?? 0) > 0);
    }

    // SORT
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
    sortOption,
    mostSellingOnly,
    showOutOfStock,
  ]);

  const topSelling = useMemo(() => {
    const sorted = [...products]
      .filter((p) => (salesMap[p.id] ?? 0) > 0)
      .sort((a, b) => (salesMap[b.id] ?? 0) - (salesMap[a.id] ?? 0))
      .slice(0, 10); // top 10 only

    return sorted;
  }, [products, salesMap]);

  /* ================= RESPONSIVE GRID ================= */

  const getGridColumns = (screen) => {
    if (layoutMode === "list") return "1fr";

    if (screen === "xs") return "repeat(2, 1fr)";
    if (screen === "sm") return "repeat(3, 1fr)";
    if (screen === "md") {
      if (layoutMode === "grid-2") return "repeat(2, 1fr)";
      if (layoutMode === "grid-4") return "repeat(4, 1fr)";
      return "repeat(3, 1fr)";
    }
    if (screen === "lg") {
      if (layoutMode === "grid-2") return "repeat(2, 1fr)";
      if (layoutMode === "grid-4") return "repeat(4, 1fr)";
      return "repeat(4, 1fr)";
    }
  };

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 1400,
        mx: "auto",
        px: { xs: 1.5, sm: 2 },
        pb: 10,
      }}
    >
      {/* ================= TOP FILTER CONTROLS ================= */}

      <Box
        sx={{
          display: "flex",
          gap: 3,
          alignItems: "center",
          mb: 2,
          flexWrap: "wrap",
        }}
      >
        {/* Show Out Of Stock Toggle */}
        <Button
          variant={showOutOfStock ? "contained" : "outlined"}
          onClick={() => setShowOutOfStock(!showOutOfStock)}
          sx={{
            textTransform: "none",
            borderRadius: 999,
            fontWeight: 600,
          }}
        >
          {showOutOfStock ? "Hide Out of Stock" : "Show Out of Stock"}
        </Button>

        {/* Most Selling Toggle */}
        <Button
          variant={mostSellingOnly ? "contained" : "outlined"}
          onClick={() => setMostSellingOnly(!mostSellingOnly)}
          sx={{
            textTransform: "none",
            borderRadius: 999,
            fontWeight: 600,
          }}
        >
          {mostSellingOnly ? "Showing Most Selling" : "Most Selling"}
        </Button>
      </Box>

      {/* ================= CATEGORIES ================= */}

      {categories.length > 0 && (
        <Box
          sx={{
            display: "flex",
            gap: 1,
            overflowX: "auto",
            flexWrap: "nowrap",
            pb: 1,
            scrollbarWidth: "thin",
            "&::-webkit-scrollbar": { height: 6 },
          }}
        >
          <Typography
            sx={{
              fontWeight: 700,
              mb: 1.5,
              fontSize: { xs: 15, sm: 18 },
            }}
          >
            Categories
          </Typography>

          <Box
            sx={{
              display: "flex",
              gap: 1,
              overflowX: { xs: "auto", md: "visible" },
              flexWrap: { xs: "nowrap", md: "wrap" },
              justifyContent: { md: "flex-start" },
              pb: 1,
              scrollbarWidth: "none",
              "&::-webkit-scrollbar": { display: "none" },
            }}
          >
            {/* ALL BUTTON */}
            <Button
              variant={selectedCategory === "all" ? "contained" : "outlined"}
              onClick={() => setSelectedCategory("all")}
              sx={{
                borderRadius: 999,
                flexShrink: 0,
                textTransform: "none",
                fontWeight: 600,
                px: 2.5,
              }}
            >
              All
            </Button>

            {categories.map((c) => (
              <Button
                key={c.id}
                variant={selectedCategory === c.id ? "contained" : "outlined"}
                onClick={() => setSelectedCategory(c.id)}
                sx={{
                  borderRadius: 999,
                  flexShrink: 0,
                  textTransform: "none",
                  fontWeight: 600,
                  px: 2.5,
                }}
              >
                {c.name}
              </Button>
            ))}
          </Box>
        </Box>
      )}

      {topSelling.length > 0 && !mostSellingOnly && (
        <Box sx={{ mb: 4 }}>
          <Typography
            sx={{
              fontWeight: 800,
              fontSize: { xs: 16, sm: 20 },
              mb: 2,
            }}
          >
            🔥 Most Selling
          </Typography>

          <Box
            sx={{
              display: "flex",
              gap: 2,
              overflowX: "auto",
              pb: 1,
              scrollbarWidth: "none",
              "&::-webkit-scrollbar": { display: "none" },
            }}
          >
            {topSelling.map((p) => (
              <Box
                key={p.id}
                sx={{
                  minWidth: 180,
                  maxWidth: 200,
                  flexShrink: 0,
                }}
              >
                <ProductCard
                  product={p}
                  cart={cart}
                  onView={setViewProduct}
                  onAdd={addToCart}
                  onInc={increaseQty}
                  onDec={decreaseQty}
                  orderMode={orderMode}
                  layoutMode="grid-2"
                  out={(p.stock ?? 0) <= 0}
                />
              </Box>
            ))}
          </Box>
        </Box>
      )}

      {/* ================= PRODUCT GRID ================= */}

      <Box
        sx={{
          display: "grid",
          gap: 2,
          gridTemplateColumns: {
            xs:
              layoutMode === "list"
                ? "1fr"
                : layoutMode === "grid-2"
                  ? "repeat(2, 1fr)"
                  : layoutMode === "grid-3"
                    ? "repeat(3, 1fr)"
                    : layoutMode === "grid-4"
                      ? "repeat(4, 1fr)"
                      : "repeat(2, 1fr)",

            sm:
              layoutMode === "list"
                ? "1fr"
                : layoutMode === "grid-2"
                  ? "repeat(2, 1fr)"
                  : layoutMode === "grid-3"
                    ? "repeat(3, 1fr)"
                    : layoutMode === "grid-4"
                      ? "repeat(4, 1fr)"
                      : "repeat(3, 1fr)",

            md:
              layoutMode === "list"
                ? "1fr"
                : layoutMode === "grid-2"
                  ? "repeat(2, 1fr)"
                  : layoutMode === "grid-3"
                    ? "repeat(3, 1fr)"
                    : layoutMode === "grid-4"
                      ? "repeat(4, 1fr)"
                      : "repeat(4, 1fr)",

            lg:
              layoutMode === "list"
                ? "1fr"
                : layoutMode === "grid-2"
                  ? "repeat(2, 1fr)"
                  : layoutMode === "grid-3"
                    ? "repeat(3, 1fr)"
                    : layoutMode === "grid-4"
                      ? "repeat(4, 1fr)"
                      : "repeat(4, 1fr)",
          },
        }}
      >
        {filtered.map((p) => (
          <ProductCard
            key={p.id}
            product={p}
            cart={cart}
            onView={setViewProduct}
            onAdd={addToCart}
            onInc={increaseQty}
            onDec={decreaseQty}
            orderMode={orderMode}
            layoutMode={layoutMode}
            out={(p.stock ?? 0) <= 0}
          />
        ))}
      </Box>

      {/* ================= FLOATING MODE BUTTON ================= */}

      <Box
        sx={{
          position: "fixed",
          bottom: 20,
          right: 20,
          zIndex: 1000,
        }}
      >
        <Button
          onClick={() => setOrderMode(!orderMode)}
          sx={{
            borderRadius: 999,
            px: 3,
            py: 1.2,
            backdropFilter: "blur(10px)",
            background: orderMode
              ? "rgba(14,165,164,0.9)"
              : "rgba(15,23,42,0.6)",
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
