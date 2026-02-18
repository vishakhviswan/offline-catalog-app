import { Navigate, Route, Routes, useSearchParams } from "react-router-dom";
import Catalog from "../pages/Catalog";
import Orders from "../pages/Orders";
import ProductView from "../pages/ProductView";
import {
  parseBooleanParam,
  parseLayoutMode,
  updateFilterParams,
} from "../utils/catalogFilters";

export default function AppRoutes({
  categories,
  products,
  orders,
  cart,
  addToCart,
  increaseQty,
  decreaseQty,
}) {
  const [searchParams, setSearchParams] = useSearchParams();

  const selectedCategory = searchParams.get("category") || categories[0]?.id || "";
  const search = searchParams.get("search") || "";
  const layoutMode = parseLayoutMode(searchParams.get("layout"));
  const showOutOfStock = parseBooleanParam(searchParams.get("showOutOfStock"), true);
  const mostSellingOnly = parseBooleanParam(searchParams.get("mostSellingOnly"), false);

  const setFilter = (key, value, defaultValue = "") => {
    setSearchParams((prev) =>
      updateFilterParams(prev, key, value, defaultValue)
    );
  };

  return (
    <Routes>
      <Route
        path="/"
        element={
          <Catalog
            categories={categories}
            products={products}
            cart={cart}
            addToCart={addToCart}
            increaseQty={increaseQty}
            decreaseQty={decreaseQty}
            selectedCategory={selectedCategory}
            setSelectedCategory={(value) => setFilter("category", value)}
            search={search}
            setSearch={(value) => setFilter("search", value)}
            layoutMode={layoutMode}
            setLayoutMode={(value) => setFilter("layout", value, "grid")}
            showOutOfStock={showOutOfStock}
            setShowOutOfStock={(value) => setFilter("showOutOfStock", value, true)}
            mostSellingOnly={mostSellingOnly}
            setMostSellingOnly={(value) => setFilter("mostSellingOnly", value, false)}
          />
        }
      />
      <Route
        path="/product/:id"
        element={
          <ProductView
            products={products}
            cart={cart}
            addToCart={addToCart}
            increaseQty={increaseQty}
            decreaseQty={decreaseQty}
          />
        }
      />
      <Route path="/orders" element={<Orders orders={orders} />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
