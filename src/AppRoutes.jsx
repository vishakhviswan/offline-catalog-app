import { lazy, Suspense, useEffect } from "react";
import { Routes, Route, useNavigate, useParams } from "react-router-dom";
import NavBar from "./components/NavBar";
import CartSheet from "./components/CartSheet";
import FilterDrawer from "./components/FilterDrawer";

const Catalog = lazy(() => import("./pages/Catalog"));
const ProductView = lazy(() => import("./pages/ProductView"));
const Orders = lazy(() => import("./pages/Orders"));

function ProductRoute({
  products,
  cart,
  addToCart,
  increaseQty,
  decreaseQty,
  onBack,
  onChangeProduct,
}) {
  const { id } = useParams();
  const navigate = useNavigate();
  const product = products.find((p) => String(p.id) === id);

  useEffect(() => {
    if (products.length > 0 && !product) {
      navigate("/", { replace: true });
    }
  }, [navigate, product, products.length]);

  if (!product) return null;

  return (
    <ProductView
      product={product}
      products={products}
      cart={cart}
      addToCart={addToCart}
      increaseQty={increaseQty}
      decreaseQty={decreaseQty}
      onBack={onBack}
      onChangeProduct={onChangeProduct}
    />
  );
}

function AppRoutes(props) {
  const {
    search,
    setSearch,
    cart,
    cartTotal,
    customerName,
    setCustomerName,
    showCustomerHistory,
    setShowCustomerHistory,
    customerHistoryProducts,
    customers,
    setCustomers,
    products,
    openProduct,
    setShowCart,
    setFilterOpen,
    categories,
    selectedCategory,
    setSelectedCategory,
    addToCart,
    increaseQty,
    decreaseQty,
    orders,
    orderMode,
    setOrderMode,
    imageFilter,
    sortOption,
    layoutMode,
    showOutOfStock,
    setShowOutOfStock,
    mostSellingOnly,
    setMostSellingOnly,
    salesMap,
    showCart,
    removeFromCart,
    updateCartItem,
    handleCheckout,
    filterOpen,
    setImageFilter,
    setSortOption,
    setLayoutMode,
    handleBackFromProduct,
    handleDeleteOrder,
    openOrders,
  } = props;

  return (
    <Suspense fallback={null}>
      <Routes>
        <Route
          path="/"
          element={
            <>
              <NavBar
                search={search}
                setSearch={setSearch}
                cartCount={cart.length}
                cartTotal={cartTotal}
                customerName={customerName}
                setCustomerName={setCustomerName}
                customers={customers}
                setCustomers={setCustomers}
                products={products}
                setViewProduct={openProduct}
                onCartClick={() => setShowCart(true)}
                onOrdersClick={openOrders}
                onFilterClick={() => setFilterOpen(true)}
              />

              <Catalog
                categories={categories}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                products={products}
                setViewProduct={openProduct}
                cart={cart}
                addToCart={addToCart}
                increaseQty={increaseQty}
                decreaseQty={decreaseQty}
                search={search}
                orderMode={orderMode}
                setOrderMode={setOrderMode}
                imageFilter={imageFilter}
                sortOption={sortOption}
                layoutMode={layoutMode}
                showOutOfStock={showOutOfStock}
                setShowOutOfStock={setShowOutOfStock}
                mostSellingOnly={mostSellingOnly}
                setMostSellingOnly={setMostSellingOnly}
                salesMap={salesMap}
                customerName={customerName}
                showCustomerHistory={showCustomerHistory}
                setShowCustomerHistory={setShowCustomerHistory}
                customerHistoryProducts={customerHistoryProducts}
              />

              {showCart && (
                <CartSheet
                  cart={cart}
                  removeFromCart={removeFromCart}
                  updateCartItem={updateCartItem}
                  customerName={customerName}
                  onClose={() => setShowCart(false)}
                  onCheckout={handleCheckout}
                />
              )}

              <FilterDrawer
                open={filterOpen}
                onClose={() => setFilterOpen(false)}
                imageFilter={imageFilter}
                setImageFilter={setImageFilter}
                sortOption={sortOption}
                setSortOption={setSortOption}
                layoutMode={layoutMode}
                setLayoutMode={setLayoutMode}
              />
            </>
          }
        />
        <Route
          path="/product/:id"
          element={
            <ProductRoute
              products={products}
              cart={cart}
              addToCart={addToCart}
              increaseQty={increaseQty}
              decreaseQty={decreaseQty}
              onBack={handleBackFromProduct}
              onChangeProduct={openProduct}
            />
          }
        />
        <Route
          path="/orders"
          element={
            <Orders
              orders={orders}
              onBack={openOrders}
              onDeleteOrder={handleDeleteOrder}
            />
          }
        />
      </Routes>
    </Suspense>
  );
}

export default AppRoutes;
