import { Navigate, Route, Routes, useNavigate, useParams } from "react-router-dom";
import Catalog from "./pages/Catalog";
import Orders from "./pages/Orders";
import ProductView from "./pages/ProductView";

function ProductRoute({
  products,
  cart,
  addToCart,
  increaseQty,
  decreaseQty,
  onOpenProduct,
  onBackFromProduct,
}) {
  const { id } = useParams();

  const product = products.find((p) => String(p.id) === String(id));

  if (!product) {
    return <Navigate to="/" replace />;
  }

  return (
    <ProductView
      product={product}
      products={products}
      cart={cart}
      addToCart={addToCart}
      increaseQty={increaseQty}
      decreaseQty={decreaseQty}
      onBack={onBackFromProduct}
      onChangeProduct={onOpenProduct}
    />
  );
}

export default function AppRoutes({
  products,
  orders,
  cart,
  addToCart,
  increaseQty,
  decreaseQty,
  onOpenProduct,
  onBackFromProduct,
  onDeleteOrder,
  catalog,
}) {
  const navigate = useNavigate();

  return (
    <Routes>
      <Route path="/" element={<Catalog {...catalog} />} />

      <Route
        path="/orders"
        element={
          <Orders
            orders={orders}
            onDeleteOrder={onDeleteOrder}
            onBack={() => navigate("/")}
          />
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
            onOpenProduct={onOpenProduct}
            onBackFromProduct={onBackFromProduct}
          />
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
