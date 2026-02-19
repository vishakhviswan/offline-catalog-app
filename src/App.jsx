import { useState, useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AppRoutes from "./AppRoutes";

function App() {
  /* ================= CORE STATE ================= */

  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [products, setProducts] = useState([]);

  const [savedScrollY, setSavedScrollY] = useState(0);

  const [cart, setCart] = useState([]);
  const [cartLoaded, setCartLoaded] = useState(false);

  const [customers, setCustomers] = useState([]);
  const [customerName, setCustomerName] = useState("");

  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [showCart, setShowCart] = useState(false);

  const [showOutOfStock, setShowOutOfStock] = useState(true);
  const [mostSellingOnly, setMostSellingOnly] = useState(false);

  /* ================= NEW STATES ================= */

  const [orderMode, setOrderMode] = useState(true);
  const [filterOpen, setFilterOpen] = useState(false);

  const [imageFilter, setImageFilter] = useState("all");
  const [sortOption, setSortOption] = useState("default");
  const [layoutMode, setLayoutMode] = useState("grid-3");

  const navigate = useNavigate();
  const location = useLocation();

  /* ================= SCROLL RESTORE ================= */

  const openProduct = (product) => {
    setSavedScrollY(window.scrollY);
    navigate(`/product/${product.id}`);
  };

  const handleBackFromProduct = () => {
    navigate("/");
    setTimeout(() => {
      window.scrollTo(0, savedScrollY);
    }, 0);
  };

  const openOrders = () => {
    if (location.pathname === "/orders") {
      navigate("/");
      return;
    }

    navigate("/orders");
  };



  async function handleCheckout() {
    if (cart.length === 0) return;

    try {
      /* ================= SAVE TO DB ================= */
      const response = await fetch(
        "https://offline-catalog-backend-production.up.railway.app/api/orders",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            customer_id: null,
            customer_name: customerName || "Walk-in",
            items: cart,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Order save failed");
      }

      /* ================= WHATSAPP MESSAGE ================= */

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

      /* ================= OPEN WHATSAPP ================= */

      const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(msg)}`;
      window.open(whatsappUrl, "_blank");

      /* ================= CLEAR CART ================= */

      setCart([]);
      setCustomerName("");
      localStorage.removeItem("cart");
      setShowCart(false);
    } catch (err) {
      console.error("Checkout error:", err);
      alert("Order save failed ❌");
    }
  }

async function handleDeleteOrder(orderId) {
  try {
    const res = await fetch(
      `https://offline-catalog-backend-production.up.railway.app/api/orders/${orderId}`,
      {
        method: "DELETE",
      },
    );

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "Delete failed");
    }

    // 🔥 remove instantly from UI
    setOrders((prev) => prev.filter((o) => o.id !== orderId));
  } catch (err) {
    console.error("Delete error:", err);
    alert("Delete failed ❌");
  }
}

  /* ================= CART HELPERS ================= */

  function addToCart(product, unit) {
    const safeUnit =
      unit ||
      (product.units?.length
        ? product.units[0]
        : { name: "pcs", multiplier: 1 });

    const existing = cart.find(
      (c) => c.productId === product.id && c.unitName === safeUnit.name,
    );

    if (existing) {
      setCart(
        cart.map((c) =>
          c.productId === product.id && c.unitName === safeUnit.name
            ? { ...c, qty: c.qty + 1 }
            : c,
        ),
      );
    } else {
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
  }

  function increaseQty(productId, unitName) {
    setCart((prev) =>
      prev.map((c) =>
        c.productId === productId && c.unitName === unitName
          ? { ...c, qty: c.qty + 1 }
          : c,
      ),
    );
  }

  function decreaseQty(productId, unitName) {
    setCart((prev) =>
      prev
        .map((c) =>
          c.productId === productId && c.unitName === unitName
            ? { ...c, qty: c.qty - 1 }
            : c,
        )
        .filter((c) => c.qty > 0),
    );
  }

  function removeFromCart(productId, unitName) {
    setCart((prev) =>
      prev.filter(
        (c) => !(c.productId === productId && c.unitName === unitName),
      ),
    );
  }

  function updateCartItem(productId, unitName, changes) {
    setCart((prev) =>
      prev.map((c) =>
        c.productId === productId && c.unitName === unitName
          ? { ...c, ...changes }
          : c,
      ),
    );
  }

  const cartTotal = cart.reduce(
    (s, i) => s + i.qty * i.price * i.unitMultiplier,
    0,
  );

  /* ================= DATA LOADERS ================= */
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

  useEffect(() => {
    fetch(
      "https://offline-catalog-backend-production.up.railway.app/api/categories",
    )
      .then((r) => r.json())
      .then((d) => setCategories(Array.isArray(d) ? d : []));
  }, []);

  useEffect(() => {
    fetch(
      "https://offline-catalog-backend-production.up.railway.app/api/products",
    )
      .then((r) => r.json())
      .then((d) => setProducts(Array.isArray(d) ? d : []));
  }, []);

  useEffect(() => {
    fetch(
      "https://offline-catalog-backend-production.up.railway.app/api/customers",
    )
      .then((r) => r.json())
      .then((d) => setCustomers(Array.isArray(d) ? d : []));
  }, []);

  useEffect(() => {
    fetch(
      "https://offline-catalog-backend-production.up.railway.app/api/orders",
    )
      .then((r) => r.json())
      .then((data) => setOrders(data || []));
  }, []);

  // useEffect(() => {
  //   if (categories.length > 0 && !selectedCategory) {
  //     setSelectedCategory(categories[0].id);
  //   }
  // }, [categories, selectedCategory]);
  return (
    <AppRoutes
      search={search}
      setSearch={setSearch}
      cart={cart}
      cartTotal={cartTotal}
      customerName={customerName}
      setCustomerName={setCustomerName}
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
