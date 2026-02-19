import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AppRoutes from "./AppRoutes";

const API_BASE =
  "https://offline-catalog-backend-production.up.railway.app/api";

function App() {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [products, setProducts] = useState([]);

  const savedScrollYRef = useRef(0);
  const hasFetchedRef = useRef(false);

  const [cart, setCart] = useState([]);
  const [cartLoaded, setCartLoaded] = useState(false);

  const [customers, setCustomers] = useState([]);
  const [customerName, setCustomerName] = useState("");
  const [showCustomerHistory, setShowCustomerHistory] = useState(false);

  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [showCart, setShowCart] = useState(false);

  const [showOutOfStock, setShowOutOfStock] = useState(true);
  const [mostSellingOnly, setMostSellingOnly] = useState(false);

  const [orderMode, setOrderMode] = useState(true);
  const [filterOpen, setFilterOpen] = useState(false);

  const [imageFilter, setImageFilter] = useState("all");
  const [sortOption, setSortOption] = useState("default");
  const [layoutMode, setLayoutMode] = useState("grid-3");

  const navigate = useNavigate();
  const location = useLocation();

  const openProduct = useCallback(
    (product) => {
      savedScrollYRef.current = window.scrollY;
      navigate(`/product/${product.id}`);
    },
    [navigate],
  );

  const handleBackFromProduct = useCallback(() => {
    navigate("/");
    setTimeout(() => {
      window.scrollTo(0, savedScrollYRef.current);
    }, 0);
  }, [navigate]);

  const openOrders = useCallback(() => {
    if (location.pathname === "/orders") {
      navigate("/");
      return;
    }

    navigate("/orders");
  }, [location.pathname, navigate]);

  const handleCheckout = useCallback(async () => {
    if (cart.length === 0) return;

    try {
      const response = await fetch(`${API_BASE}/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customer_id: null,
          customer_name: customerName || "Walk-in",
          items: cart,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Order save failed");
      }

      let msg = `*MANGALYA AGENCIES*\n\n`;
      msg += `Customer: ${customerName || "Walk-in"}\n\n`;

      cart.forEach((c, i) => {
        const lineTotal =
          Number(c.qty) * Number(c.price) * Number(c.unitMultiplier || 1);

        msg += `${i + 1}) ${c.name}\n`;
        msg += `   ${c.qty} ${c.unitName} × ₹${c.price} = ₹${lineTotal}\n\n`;
      });

      const grandTotal = cart.reduce(
        (s, i) =>
          s + Number(i.qty) * Number(i.price) * Number(i.unitMultiplier || 1),
        0,
      );

      msg += `------------------\nTotal: ₹${grandTotal}`;

      const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(msg)}`;
      window.open(whatsappUrl, "_blank");

      setCart([]);
      setCustomerName("");
      localStorage.removeItem("cart");
      setShowCart(false);
    } catch (err) {
      console.error("Checkout error:", err);
      alert("Order save failed ❌");
    }
  }, [cart, customerName]);

  const handleDeleteOrder = useCallback(async (orderId) => {
    try {
      const res = await fetch(`${API_BASE}/orders/${orderId}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Delete failed");
      }

      setOrders((prev) => prev.filter((o) => o.id !== orderId));
    } catch (err) {
      console.error("Delete error:", err);
      alert("Delete failed ❌");
    }
  }, []);

  const addToCart = useCallback((product, unit) => {
    const safeUnit =
      unit ||
      (product.units?.length
        ? product.units[0]
        : { name: "pcs", multiplier: 1 });

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

  const updateCartItem = useCallback((productId, unitName, changes) => {
    setCart((prev) =>
      prev.map((c) =>
        c.productId === productId && c.unitName === unitName
          ? { ...c, ...changes }
          : c,
      ),
    );
  }, []);

  const cartTotal = useMemo(
    () => cart.reduce((s, i) => s + i.qty * i.price * i.unitMultiplier, 0),
    [cart],
  );

  const salesMap = useMemo(() => {
    const map = {};

    orders.forEach((order) => {
      order.order_items?.forEach((item) => {
        map[item.product_id] =
          (map[item.product_id] || 0) + Number(item.qty || 0);
      });
    });

    return map;
  }, [orders]);

  const customerHistoryProducts = useMemo(() => {
    if (!customerName) return [];

    const productIds = new Set();

    orders
      .filter((order) => order.customer_name === customerName)
      .forEach((order) => {
        order.order_items?.forEach((item) => {
          if (item.product_id != null) {
            productIds.add(item.product_id);
          }
        });
      });

    return products.filter((product) => productIds.has(product.id));
  }, [customerName, orders, products]);

  useEffect(() => {
    if (!customerName && showCustomerHistory) {
      setShowCustomerHistory(false);
    }
  }, [customerName, showCustomerHistory]);

  useEffect(() => {
    const saved = localStorage.getItem("cart");
    if (saved) {
      try {
        setCart(JSON.parse(saved));
      } catch {
        console.error("Invalid cart in storage");
      }
    }
    setCartLoaded(true);
  }, []);

  useEffect(() => {
    if (!cartLoaded) return;
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart, cartLoaded]);

  useEffect(() => {
    if (hasFetchedRef.current) return;
    hasFetchedRef.current = true;

    Promise.all([
      fetch(`${API_BASE}/categories`).then((r) => r.json()),
      fetch(`${API_BASE}/products`).then((r) => r.json()),
      fetch(`${API_BASE}/customers`).then((r) => r.json()),
      fetch(`${API_BASE}/orders`).then((r) => r.json()),
    ])
      .then(([categoriesData, productsData, customersData, ordersData]) => {
        setCategories(Array.isArray(categoriesData) ? categoriesData : []);
        setProducts(Array.isArray(productsData) ? productsData : []);
        setCustomers(Array.isArray(customersData) ? customersData : []);
        setOrders(Array.isArray(ordersData) ? ordersData : []);
      })
      .catch((error) => {
        console.error("Initial data load failed", error);
      });
  }, []);

  return (
    <AppRoutes
      search={search}
      setSearch={setSearch}
      cart={cart}
      cartTotal={cartTotal}
      customerName={customerName}
      setCustomerName={setCustomerName}
      showCustomerHistory={showCustomerHistory}
      setShowCustomerHistory={setShowCustomerHistory}
      customerHistoryProducts={customerHistoryProducts}
      customers={customers}
      setCustomers={setCustomers}
      products={products}
      openProduct={openProduct}
      setShowCart={setShowCart}
      setFilterOpen={setFilterOpen}
      categories={categories}
      selectedCategory={selectedCategory}
      setSelectedCategory={setSelectedCategory}
      addToCart={addToCart}
      increaseQty={increaseQty}
      decreaseQty={decreaseQty}
      orders={orders}
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
      showCart={showCart}
      removeFromCart={removeFromCart}
      updateCartItem={updateCartItem}
      handleCheckout={handleCheckout}
      filterOpen={filterOpen}
      setImageFilter={setImageFilter}
      setSortOption={setSortOption}
      setLayoutMode={setLayoutMode}
      handleBackFromProduct={handleBackFromProduct}
      handleDeleteOrder={handleDeleteOrder}
      openOrders={openOrders}
    />
  );
}

export default App;
