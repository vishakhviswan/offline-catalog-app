import { useState, useEffect } from "react";
import Catalog from "./pages/Catalog";
import ProductView from "./pages/ProductView";
import NavBar from "./components/NavBar";
import CartSheet from "./components/CartSheet";
import Orders from "./pages/Orders";

import { saveOrders, loadOrders } from "./db";

function App() {
  /* ================= CORE STATE ================= */
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [products, setProducts] = useState([]);

  const [viewProduct, setViewProduct] = useState(null);

  const [cart, setCart] = useState([]);
  const [cartLoaded, setCartLoaded] = useState(false);

  const [customerName, setCustomerName] = useState("");

  const [orders, setOrders] = useState([]);
  const [ordersLoaded, setOrdersLoaded] = useState(false);
  const [showOrders, setShowOrders] = useState(false);

  const [search, setSearch] = useState("");
  const [showCart, setShowCart] = useState(false);
  const [showOutOfStock, setShowOutOfStock] = useState(false);
  /* ================= CART HELPERS ================= */

  function addToCart(product, unit) {
    const safeUnit =
      unit ||
      (product.units?.length
        ? product.units[0]
        : { name: "pcs", multiplier: 1 });

    setCart([
      ...cart,
      {
        productId: product.id,
        name: product.name,
        price: product.price,
        unitName: safeUnit.name,
        unitMultiplier: safeUnit.multiplier,
        qty: 1,
      },
    ]);
  }

  function increaseQty(productId) {
    setCart(
      cart.map((c) =>
        c.productId === productId ? { ...c, qty: c.qty + 1 } : c,
      ),
    );
  }

  function decreaseQty(productId) {
    setCart(
      cart
        .map((c) => (c.productId === productId ? { ...c, qty: c.qty - 1 } : c))
        .filter((c) => c.qty > 0),
    );
  }

  function removeFromCart(productId) {
    setCart(cart.filter((c) => c.productId !== productId));
  }

  const cartTotal = cart.reduce(
    (s, i) => s + i.qty * i.price * i.unitMultiplier,
    0,
  );

  /* ================= CHECKOUT ================= */

  function handleCheckout() {
    if (!cart.length) return;

    let msg = `*MANGALYA AGENCIES*\n\n`;
    msg += `Customer: ${customerName || "N/A"}\n\n`;

    cart.forEach((c, i) => {
      msg += `${i + 1}) ${c.name}\n`;
      msg += `   ${c.qty} ${c.unitName} × ₹${c.price} = ₹${
        c.qty * c.price * c.unitMultiplier
      }\n\n`;
    });

    msg += `------------------\nTotal: ₹${cartTotal}`;

    window.location.href = `https://wa.me/?text=${encodeURIComponent(msg)}`;

    const newOrder = {
      id: Date.now(),
      customer: customerName || "Unknown",
      date: new Date().toISOString(),
      items: cart,
      total: cartTotal,
    };

    setOrders((prev) => [...prev, newOrder]);

    setCart([]);
    setCustomerName("");
    localStorage.removeItem("cart");
    setShowCart(false);
  }

  /* ================= LOADERS ================= */

  // Orders (IndexedDB – mistakes allowed)
  useEffect(() => {
    loadOrders().then((data) => {
      setOrders(data || []);
      setOrdersLoaded(true);
    });
  }, []);

  useEffect(() => {
    if (!ordersLoaded) return;
    saveOrders(orders);
  }, [orders, ordersLoaded]);

  // Cart (localStorage)
  useEffect(() => {
    const saved = localStorage.getItem("cart");
    if (saved) {
      try {
        setCart(JSON.parse(saved));
      } catch {}
    }
    setCartLoaded(true);
  }, []);

  useEffect(() => {
    if (!cartLoaded) return;
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart, cartLoaded]);

  // Categories (API)
  useEffect(() => {
    fetch(
      "https://offline-catalog-backend-production.up.railway.app/api/categories",
    )
      .then((r) => r.json())
      .then((data) => setCategories(data || []))
      .catch(() => setCategories([]));
  }, []);

  // Auto select first category
  useEffect(() => {
    if (categories.length && !selectedCategory) {
      setSelectedCategory(categories[0].id);
    }
  }, [categories, selectedCategory]);

  // Products (API)
  useEffect(() => {
    fetch(
      "https://offline-catalog-backend-production.up.railway.app/api/products",
    )
      .then((r) => r.json())
      .then((data) => setProducts(data || []))
      .catch(() => setProducts([]));
  }, []);

  /* ================= ROUTING ================= */

  if (viewProduct) {
    return (
      <ProductView
        product={viewProduct}
        products={products}
        cart={cart}
        addToCart={addToCart}
        increaseQty={increaseQty}
        decreaseQty={decreaseQty}
        onBack={() => setViewProduct(null)}
        onChangeProduct={(p) => setViewProduct(p)}
      />
    );
  }

  if (showOrders) {
    return <Orders orders={orders} onBack={() => setShowOrders(false)} />;
  }

  /* ================= CATALOG ================= */

  return (
    <>
      <NavBar
        search={search}
        setSearch={setSearch}
        cartCount={cart.length}
        cartTotal={cartTotal}
        customerName={customerName}
        setCustomerName={setCustomerName}
        onCartClick={() => setShowCart(true)}
        onOrdersClick={() => setShowOrders(true)}
      />

      <Catalog
        categories={categories}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        products={products}
        setViewProduct={setViewProduct}
        cart={cart}
        addToCart={addToCart}
        increaseQty={increaseQty}
        decreaseQty={decreaseQty}
        search={search}
        showOutOfStock={showOutOfStock}
      />

      {showCart && (
        <CartSheet
          cart={cart}
          increaseQty={increaseQty}
          decreaseQty={decreaseQty}
          removeFromCart={removeFromCart}
          onClose={() => setShowCart(false)}
          onCheckout={handleCheckout}
        />
      )}
    </>
  );
}

export default App;
