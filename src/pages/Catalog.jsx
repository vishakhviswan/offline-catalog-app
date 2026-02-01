import { useState, useMemo, useEffect } from "react";
import { Box, Typography, Stack, Button, Switch } from "@mui/material";

import CategorySelectModal from "../components/CategorySelectModal";
import ProductCard from "../components/ProductCard";

export default function Catalog({
  categories = [],
  selectedCategory,
  setSelectedCategory,
  products = [],
  setViewProduct,
  cart = [],
  addToCart,
  increaseQty,
  decreaseQty,
  search = "",
  orders = [],
  customerName = "",
}) {
  const [catOpen, setCatOpen] = useState(false);
  const [localSearch, setLocalSearch] = useState(search);

  const [showOutOfStock, setShowOutOfStock] = useState(false);
  const [showMostSelling, setShowMostSelling] = useState(true);
  const [showCustomerPrev, setShowCustomerPrev] = useState(true);

  useEffect(() => {
    setLocalSearch(search);
  }, [search]);

  /* ================= SAFE PRODUCTS ================= */
  const safeProducts = useMemo(() => {
    return Array.isArray(products)
      ? products.filter((p) => p && p.name && typeof p.price === "number")
      : [];
  }, [products]);

  const isOutOfStock = (p) =>
    Number(p.stock || 0) === 0 || p.availability === false;

  const findCartItem = (id) => cart.find((c) => c.productId === id);

  /* ================= FILTER ================= */
  const filteredProducts = useMemo(() => {
    const q = localSearch.toLowerCase();
    return safeProducts
      .filter((p) =>
        selectedCategory === "all"
          ? true
          : (p.category_id || p.categoryId) === selectedCategory,
      )
      .filter((p) => p.name.toLowerCase().includes(q))
      .filter((p) => (showOutOfStock ? true : !isOutOfStock(p)));
  }, [safeProducts, selectedCategory, localSearch, showOutOfStock]);

  /* ================= MOST SELLING ================= */
  const mostSellingProducts = useMemo(() => {
    if (!orders.length) return [];

    const count = {};
    orders.forEach((o) =>
      (o.order_items || []).forEach((it) => {
        count[it.product_id] =
          (count[it.product_id] || 0) + Number(it.qty || 0);
      }),
    );

    return safeProducts
      .map((p) => ({ ...p, sold: count[p.id] || 0 }))
      .filter((p) => p.sold > 0)
      .sort((a, b) => b.sold - a.sold)
      .slice(0, 10);
  }, [orders, safeProducts]);

  /* ================= CUSTOMER PREVIOUS ================= */
  const customerProducts = useMemo(() => {
    if (!customerName || !orders.length) return [];

    const map = new Map();
    orders
      .filter((o) => o.customer_name === customerName)
      .forEach((o) =>
        (o.order_items || []).forEach((it) => {
          const p = safeProducts.find((x) => x.id === it.product_id);
          if (p) map.set(p.id, p);
        }),
      );

    return Array.from(map.values());
  }, [orders, customerName, safeProducts]);

  /* ================= UI ================= */
  return (
    <Box sx={{ px: 2, maxWidth: 1400, mx: "auto" }}>
      {/* ================= SEARCH ================= */}
      <input
        value={localSearch}
        onChange={(e) => setLocalSearch(e.target.value)}
        placeholder="🔍 Search products…"
        style={{
          width: "100%",
          padding: "14px 16px",
          borderRadius: 16,
          border: "1px solid #e5e7eb",
          fontSize: 16,
          marginBottom: 14,
        }}
      />

      {/* ================= CATEGORY BAR ================= */}
      {/* CATEGORY BAR */}
      <Typography fontWeight={800} mb={1}>
        Categories
      </Typography>

      <Box sx={categoryBar}>
        <CategoryPill
          active={selectedCategory === "all"}
          onClick={() => setCatOpen(true)}
        >
          📂 All
        </CategoryPill>

        {categories.map((c) => (
          <CategoryPill
            key={c.id}
            active={selectedCategory === c.id}
            onClick={() => setSelectedCategory(c.id)}
            title={c.name}
          >
            {c.name}
          </CategoryPill>
        ))}
      </Box>

      {/* ================= TOGGLES ================= */}
      <Stack direction="row" spacing={3} mt={2} alignItems="center">
        <Toggle
          label="Show out of stock"
          value={showOutOfStock}
          onChange={setShowOutOfStock}
        />
        <Toggle
          label="Most selling"
          value={showMostSelling}
          onChange={setShowMostSelling}
        />
        {customerName && (
          <Toggle
            label="Previous orders"
            value={showCustomerPrev}
            onChange={setShowCustomerPrev}
          />
        )}
      </Stack>

      {/* ================= CUSTOMER PREVIOUS ================= */}
      {showCustomerPrev && customerProducts.length > 0 && (
        <>
          <SectionTitle>🔁 Previously ordered by {customerName}</SectionTitle>
          <HorizontalRow>
            {customerProducts.map((p) => (
              <SmallCard key={p.id}>
                <ProductCard
                  product={p}
                  compact
                  cartItem={findCartItem(p.id)}
                  out={isOutOfStock(p)}
                  onView={setViewProduct}
                  onAdd={addToCart}
                  onInc={increaseQty}
                  onDec={decreaseQty}
                />
              </SmallCard>
            ))}
          </HorizontalRow>
        </>
      )}

      {/* ================= MOST SELLING ================= */}
      {showMostSelling && mostSellingProducts.length > 0 && (
        <>
          <SectionTitle>🔥 Most Selling</SectionTitle>
          <HorizontalRow>
            {mostSellingProducts.map((p) => (
              <SmallCard key={p.id}>
                <ProductCard
                  product={p}
                  compact
                  cartItem={findCartItem(p.id)}
                  out={isOutOfStock(p)}
                  onView={setViewProduct}
                  onAdd={addToCart}
                  onInc={increaseQty}
                  onDec={decreaseQty}
                />
              </SmallCard>
            ))}
          </HorizontalRow>
        </>
      )}

      {/* ================= MAIN GRID ================= */}
      <SectionTitle>Products ({filteredProducts.length})</SectionTitle>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "repeat(2,1fr)",
            sm: "repeat(3,1fr)",
            md: "repeat(4,1fr)",
            lg: "repeat(5,1fr)",
          },
          gap: 2,
          pb: 10,
        }}
      >
        {filteredProducts.map((p) => (
          <ProductCard
            key={p.id}
            product={p}
            cartItem={findCartItem(p.id)}
            out={isOutOfStock(p)}
            onView={setViewProduct}
            onAdd={addToCart}
            onInc={increaseQty}
            onDec={decreaseQty}
            imageHero
          />
        ))}
      </Box>

      {/* ================= CATEGORY MODAL ================= */}
      <CategorySelectModal
        open={catOpen}
        onClose={() => setCatOpen(false)}
        categories={categories}
        selected={selectedCategory}
        onSelect={(id) => {
          setSelectedCategory(id);
          setCatOpen(false);
        }}
      />
    </Box>
  );
}

/* ================= SMALL COMPONENTS ================= */

function Toggle({ label, value, onChange }) {
  return (
    <Stack direction="row" spacing={1} alignItems="center">
      <Switch checked={value} onChange={(e) => onChange(e.target.checked)} />
      <Typography fontSize={14}>{label}</Typography>
    </Stack>
  );
}

function SectionTitle({ children }) {
  return (
    <Typography fontWeight={800} mt={3} mb={1}>
      {children}
    </Typography>
  );
}

function HorizontalRow({ children }) {
  return (
    <Box sx={{ display: "flex", gap: 1.5, overflowX: "auto", pb: 2 }}>
      {children}
    </Box>
  );
}

function SmallCard({ children }) {
  return <Box sx={{ minWidth: 170 }}>{children}</Box>;
}

function CategoryPill({ active, children, onClick, title }) {
  return (
    <button
      onClick={onClick}
      title={title || children}
      style={{
        height: 36, // ⬅ slim height
        padding: "0 14px",
        borderRadius: 999,
        border: "none",
        cursor: "pointer",

        display: "flex",
        alignItems: "center",
        justifyContent: "center",

        minWidth: 80,
        maxWidth: 140, // ⬅ prevents over-wide pills
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",

        fontSize: 13,
        fontWeight: 700,
        letterSpacing: "0.2px",

        background: active ? "#0EA5A4" : "#F1F5F9",
        color: active ? "#ffffff" : "#0F172A",

        boxShadow: active
          ? "0 4px 10px rgba(14,165,164,0.35)"
          : "0 1px 4px rgba(0,0,0,0.12)",

        transition: "all 0.2s ease",
        flexShrink: 0, // 🔥 VERY IMPORTANT (no squeeze)
      }}
    >
      {children}
    </button>
  );
}

const categoryBar = {
  display: "flex",
  gap: 2,
  overflowX: "auto",
  paddingBottom: 8,
  scrollbarWidth: "none",
  msOverflowStyle: "none",
};
