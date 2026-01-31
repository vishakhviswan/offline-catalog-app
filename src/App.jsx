import { useState, useEffect } from "react";
import Catalog from "./pages/Catalog";
import ProductView from "./pages/ProductView";
import NavBar from "./components/NavBar";
import CartSheet from "./components/CartSheet";
import Orders from "./pages/Orders";

function App() {
  /* ================= CORE STATE ================= */

  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [products, setProducts] = useState([]);

  const [viewProduct, setViewProduct] = useState(null);

  const [cart, setCart] = useState([]);
  const [cartLoaded, setCartLoaded] = useState(false);

  const [customers, setCustomers] = useState([]);
  const [customerName, setCustomerName] = useState("");

  const [orders, setOrders] = useState([]);
  const [showOrders, setShowOrders] = useState(false);

  const [search, setSearch] = useState("");
  const [showCart, setShowCart] = useState(false);

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

  function updateCartItem(productId, changes) {
    setCart((prev) =>
      prev.map((c) => (c.productId === productId ? { ...c, ...changes } : c)),
    );
  }
  /* ================= CHECKOUT ================= */
  async function handleCheckout() {
    if (!cart.length) return;

    const payload = {
      customer_name: customerName || "Walk-in",
      items: cart.map((c) => ({
        productId: c.productId,
        name: c.name,
        qty: Number(c.qty),
        price: Number(c.price),
        unitName: c.unitName,
        unitMultiplier: Number(c.unitMultiplier || 1),
      })),
    };

    try {
      const res = await fetch(
        "https://offline-catalog-backend-production.up.railway.app/api/orders",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        },
      );

      const text = await res.text(); // 🔥 IMPORTANT
      if (!res.ok) throw new Error(text);

      console.log("Order saved:", text);

      // 🔄 refresh orders list from backend
      const freshOrders = await fetch(
        "https://offline-catalog-backend-production.up.railway.app/api/orders",
      ).then((r) => r.json());

      setOrders(freshOrders || []);

      // WhatsApp message
      let msg = `*MANGALYA AGENCIES*\n\nCustomer: ${customerName || "Walk-in"}\n\n`;
      cart.forEach((c, i) => {
        msg += `${i + 1}) ${c.name}\n`;
        msg += `   ${c.qty} ${c.unitName} × ₹${c.price}\n\n`;
      });

      window.open("https://wa.me/?text=" + encodeURIComponent(msg), "_blank");

      // reset
      setCart([]);
      setCustomerName("");
      localStorage.removeItem("cart");
      setShowCart(false);
    } catch (err) {
      console.error("Order save failed:", err);
      alert("Order save failed");
    }
  }

  /* ================= LOADERS ================= */

  // Cart
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

  // Categories
  useEffect(() => {
    fetch(
      "https://offline-catalog-backend-production.up.railway.app/api/categories",
    )
      .then((r) => r.json())
      .then((d) => setCategories(Array.isArray(d) ? d : []))
      .catch(() => setCategories([]));
  }, []);

  // Products
  useEffect(() => {
    fetch(
      "https://offline-catalog-backend-production.up.railway.app/api/products",
    )
      .then((r) => r.json())
      .then((d) => setProducts(Array.isArray(d) ? d : []))
      .catch(() => setProducts([]));
  }, []);

  // Customers
  useEffect(() => {
    fetch(
      "https://offline-catalog-backend-production.up.railway.app/api/customers",
    )
      .then((r) => r.json())
      .then((d) => setCustomers(Array.isArray(d) ? d : []))
      .catch(() => setCustomers([]));
  }, []);

  // Orders (FROM BACKEND)
  useEffect(() => {
    fetch(
      "https://offline-catalog-backend-production.up.railway.app/api/orders",
    )
      .then((r) => r.json())
      .then((data) => {
        setOrders(data || []);
      })
      .catch((e) => {
        console.error("Orders fetch failed", e);
        setOrders([]);
      });
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

  /* ================= UI ================= */

  return (
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
        setViewProduct={setViewProduct}
        onCartClick={() => setShowCart(true)}
        onOrdersClick={() => setShowOrders(true)}
        onAdminClick={() => {
          if (window.confirm("Open Admin Panel?")) {
            window.open("https://offline-catalog-admin.vercel.app", "_blank");
          }
        }}
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
        orders={orders}
        customerName={customerName}
      />

      {showCart && (
        <CartSheet
          cart={cart}
          increaseQty={increaseQty}
          decreaseQty={decreaseQty}
          removeFromCart={removeFromCart}
          updateCartItem={updateCartItem}
          customerName={customerName}
          onClose={() => setShowCart(false)}
          onCheckout={handleCheckout}
        />
      )}
    </>
  );
}

export default App;
