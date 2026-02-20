import { useEffect, useMemo, useState, useCallback } from "react";
import CartSheet from "./components/CartSheet";
import NavBar from "./components/NavBar";
import AppRoutes from "./routes/AppRoutes";
import {
  loadCategories,
  loadCustomers,
  loadOrders,
  loadProducts,
  loadUnits,
} from "./db";

function App() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [masterUnits, setMasterUnits] = useState([]);

  const [cart, setCart] = useState([]);
  const [cartLoaded, setCartLoaded] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [showCart, setShowCart] = useState(false);

  // 🔥 REQUIRED UI STATES
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [layoutMode, setLayoutMode] = useState("grid");
  const [showOutOfStock, setShowOutOfStock] = useState(false);
  const [mostSellingOnly, setMostSellingOnly] = useState(false);

  /* ================= INITIAL LOAD ================= */

  useEffect(() => {
    loadProducts().then((data) => {
      console.log("PRODUCTS:", data[0]);
      setProducts(data || []);
    });

    loadCategories().then(setCategories);
    loadOrders().then(setOrders);
    loadCustomers().then(setCustomers);
    loadUnits().then(setMasterUnits);
  }, []);

  /* ================= CART STORAGE ================= */

  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error("Cart parse error", e);
      }
    }
    setCartLoaded(true);
  }, []);

  useEffect(() => {
    if (!cartLoaded) return;
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart, cartLoaded]);

  /* ================= CART LOGIC ================= */

  const addToCart = useCallback((product, unit) => {
    const safeUnit = unit ||
      product.units?.[0] || { name: "pcs", multiplier: 1 };

    setCart((prev) => {
      const existing = prev.find(
        (c) => c.productId === product.id && c.unitName === safeUnit.name,
      );

      if (existing) {
        return prev.map((c) =>
          c.productId === product.id && c.unitName === safeUnit.name
            ? { ...c, qty: c.qty + 1 }
            : c,
        );
      }

      return [
        ...prev,
        {
          productId: product.id,
          name: product.name,
          price: product.price,
          unitName: safeUnit.name,
          unitMultiplier: safeUnit.multiplier,
          qty: 1,
        },
      ];
    });
  }, []);

  const increaseQty = useCallback((productId, unitName) => {
    setCart((prev) =>
      prev.map((c) =>
        c.productId === productId && c.unitName === unitName
          ? { ...c, qty: c.qty + 1 }
          : c,
      ),
    );
  }, []);

  const decreaseQty = useCallback((productId, unitName) => {
    setCart((prev) =>
      prev
        .map((c) =>
          c.productId === productId && c.unitName === unitName
            ? { ...c, qty: c.qty - 1 }
            : c,
        )
        .filter((c) => c.qty > 0),
    );
  }, []);

  const removeFromCart = useCallback((productId, unitName) => {
    setCart((prev) =>
      prev.filter(
        (c) => !(c.productId === productId && c.unitName === unitName),
      ),
    );
  }, []);

  /* ================= TOTAL ================= */

  const cartTotal = useMemo(
    () =>
      cart.reduce(
        (sum, item) => sum + item.qty * item.price * item.unitMultiplier,
        0,
      ),
    [cart],
  );

  /* ================= RENDER ================= */

  return (
    <>
      <NavBar
        cartCount={cart.length}
        cartTotal={cartTotal}
        customerName={customerName}
        setCustomerName={setCustomerName}
        customers={customers}
        setCustomers={setCustomers}
      />

      <AppRoutes
        categories={categories}
        products={products}
        orders={orders}
        cart={cart}
        addToCart={addToCart}
        increaseQty={increaseQty}
        decreaseQty={decreaseQty}
        search={search}
        setSearch={setSearch}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        layoutMode={layoutMode}
        setLayoutMode={setLayoutMode}
        showOutOfStock={showOutOfStock}
        setShowOutOfStock={setShowOutOfStock}
        mostSellingOnly={mostSellingOnly}
        setMostSellingOnly={setMostSellingOnly}
      />

      {showCart && (
        <CartSheet
          cart={cart}
          increaseQty={increaseQty}
          decreaseQty={decreaseQty}
          removeFromCart={removeFromCart}
          onClose={() => setShowCart(false)}
        />
      )}

      <button
        onClick={() => setShowCart(true)}
        style={{
          position: "fixed",
          right: 16,
          bottom: 16,
          borderRadius: 999,
          padding: "12px 16px",
          background: "#2563eb",
          color: "#fff",
          fontWeight: 700,
        }}
      >
        🛒 {cart.length} | ₹{cartTotal}
      </button>
    </>
  );
}

export default App;
