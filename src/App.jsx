import { useEffect, useMemo, useState } from "react";
import { HashRouter } from "react-router-dom";
import CartSheet from "./components/CartSheet";
import NavBar from "./components/NavBar";
import AppRoutes from "./routes/AppRoutes";
import {
  loadCategories,
  loadCustomers,
  loadOrders,
  loadProducts,
  loadUnits,
  saveCategories,
  saveCustomers,
  saveOrders,
  saveProducts,
  saveUnits,
} from "./db";

function App() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [masterUnits, setMasterUnits] = useState([]);

  const [productsLoaded, setProductsLoaded] = useState(false);
  const [ordersLoaded, setOrdersLoaded] = useState(false);
  const [customersLoaded, setCustomersLoaded] = useState(false);
  const [masterUnitsLoaded, setMasterUnitsLoaded] = useState(false);

  const [cart, setCart] = useState([]);
  const [cartLoaded, setCartLoaded] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [showCart, setShowCart] = useState(false);

  useEffect(() => {
    loadUnits().then((data) => {
      setMasterUnits(data || []);
      setMasterUnitsLoaded(true);
    });

    loadCustomers().then((data) => {
      setCustomers(data || []);
      setCustomersLoaded(true);
    });

    loadOrders().then((data) => {
      setOrders(data || []);
      setOrdersLoaded(true);
    });

    loadCategories().then((data) => {
      if (data.length === 0) {
        const defaults = [
          { id: "c1", name: "Brooms" },
          { id: "c2", name: "Mops" },
          { id: "c3", name: "Buckets" },
          { id: "c4", name: "Containers" },
        ];
        setCategories(defaults);
        saveCategories(defaults);
      } else {
        setCategories(data);
      }
    });

    loadProducts().then((data) => {
      setProducts(data || []);
      setProductsLoaded(true);
    });
  }, []);

  useEffect(() => {
    if (masterUnitsLoaded) saveUnits(masterUnits);
  }, [masterUnits, masterUnitsLoaded]);

  useEffect(() => {
    if (customersLoaded) saveCustomers(customers);
  }, [customers, customersLoaded]);

  useEffect(() => {
    if (ordersLoaded) saveOrders(orders);
  }, [orders, ordersLoaded]);

  useEffect(() => {
    if (categories.length) saveCategories(categories);
  }, [categories]);

  useEffect(() => {
    if (productsLoaded) saveProducts(products);
  }, [products, productsLoaded]);

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

  function addToCart(product, unit = product.units?.[0] || { name: "Piece", multiplier: 1 }) {
    const unitPrice = product.price * unit.multiplier;
    setCart((prev) => [
      ...prev,
      {
        productId: product.id,
        name: product.name,
        price: product.price,
        unitName: unit.name,
        unitMultiplier: unit.multiplier,
        qty: 1,
        total: unitPrice,
      },
    ]);
  }

  function increaseQty(productId) {
    setCart((prev) =>
      prev.map((c) =>
        c.productId === productId
          ? {
              ...c,
              qty: c.qty + 1,
              total: (c.qty + 1) * c.price * c.unitMultiplier,
            }
          : c
      )
    );
  }

  function decreaseQty(productId) {
    setCart((prev) =>
      prev
        .map((c) =>
          c.productId === productId
            ? {
                ...c,
                qty: c.qty - 1,
                total: (c.qty - 1) * c.price * c.unitMultiplier,
              }
            : c
        )
        .filter((c) => c.qty > 0)
    );
  }

  function removeFromCart(productId) {
    setCart((prev) => prev.filter((c) => c.productId !== productId));
  }

  function handleCheckout() {
    if (cart.length === 0) return;

    let msg = "*MANGALYA AGENCIES*\n\n";
    msg += `Customer: ${customerName || "N/A"}\n\n`;

    cart.forEach((c, i) => {
      msg += `${i + 1}) ${c.name}\n`;
      msg += `   ${c.qty} ${c.unitName} × ₹${c.price} = ₹${c.total}\n\n`;
    });

    const total = cart.reduce((sum, item) => sum + item.total, 0);
    msg += `------------------\nTotal: ₹${total}`;

    window.location.href = `https://wa.me/?text=${encodeURIComponent(msg)}`;

    const newOrder = {
      id: Date.now(),
      customer: customerName || "Unknown",
      date: new Date().toISOString(),
      order_items: cart,
      total,
    };

    setOrders((prev) => [...prev, newOrder]);
    setCart([]);
    setCustomerName("");
    localStorage.removeItem("cart");
    setShowCart(false);
  }

  const cartTotal = useMemo(
    () => cart.reduce((sum, item) => sum + item.total, 0),
    [cart]
  );

  return (
    <HashRouter>
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

      <button
        onClick={() => setShowCart(true)}
        style={{
          position: "fixed",
          right: 16,
          bottom: 16,
          zIndex: 1200,
          border: "none",
          borderRadius: 999,
          padding: "12px 16px",
          background: "#2563eb",
          color: "#fff",
          fontWeight: 700,
          boxShadow: "0 8px 20px rgba(0,0,0,0.18)",
        }}
      >
        🛒 {cart.length} | ₹{cartTotal}
      </button>
    </HashRouter>
  );
}

export default App;
