import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Alert, Button } from "@mui/material";
import NavBar from "./components/NavBar";
import CartSheet from "./components/CartSheet";
import FilterDrawer from "./components/FilterDrawer";
import AppRoutes from "./AppRoutes";
import {
  loadCategoriesCache,
  loadCustomersCache,
  loadOrdersCache,
  loadProductsCache,
  saveCategoriesCache,
  saveCustomersCache,
  saveOrdersCache,
  saveProductsCache,
} from "./db";

const API_BASE = "https://offline-catalog-backend.onrender.com";

function App() {
  const navigate = useNavigate();
  const location = useLocation();

  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [products, setProducts] = useState([]);
  const [savedScrollY, setSavedScrollY] = useState(0);

  const [cart, setCart] = useState([]);
  const [cartLoaded, setCartLoaded] = useState(false);

  const [customers, setCustomers] = useState([]);
  const [customerName, setCustomerName] = useState("");

  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [showCart, setShowCart] = useState(false);

  const [showOutOfStock, setShowOutOfStock] = useState(true);
  const [mostSellingOnly, setMostSellingOnly] = useState(false);

  const [orderMode, setOrderMode] = useState(true);
  const [filterOpen, setFilterOpen] = useState(false);

  const [imageFilter, setImageFilter] = useState("all");
  const [sortOption, setSortOption] = useState("default");
  const [layoutMode, setLayoutMode] = useState("grid-3");
  const [showByCategory, setShowByCategory] = useState(false);
  const [fetchError, setFetchError] = useState("");

  const isCatalogRoute = location.pathname === "/";

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

  async function handleCheckout() {
    if (cart.length === 0) return;

    try {
      const response = await fetch(`${API_BASE}/api/orders`, {
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

      try {
        const ordersRes = await fetch(`${API_BASE}/api/orders`);
        if (ordersRes.ok) {
          const ordersData = await ordersRes.json();
          if (Array.isArray(ordersData)) {
            setOrders(ordersData);
            saveOrdersCache(ordersData).catch((error) => {
              console.error("Orders cache save failed:", error);
            });
          } else if (Array.isArray(ordersData?.orders)) {
            setOrders(ordersData.orders);
            saveOrdersCache(ordersData.orders).catch((error) => {
              console.error("Orders cache save failed:", error);
            });
          }
        }
      } catch (refreshErr) {
        console.error("Orders refresh after checkout failed:", refreshErr);
      }

      let msg = `*MANGALYA AGENCIES*\n\n`;
      msg += `Customer: ${customerName || "Walk-in"}\n\n`;

      cart.forEach((c, i) => {
        const lineTotal =
          Number(c.qty) * Number(c.price) * Number(c.unitMultiplier || 1);

        msg += `${i + 1}) ${c.name}\n`;
        msg += `   ${c.qty} ${c.unitName} x Rs ${c.price} = Rs ${lineTotal}\n\n`;
      });

      const grandTotal = cart.reduce(
        (s, i) =>
          s + Number(i.qty) * Number(i.price) * Number(i.unitMultiplier || 1),
        0,
      );

      msg += `------------------\nTotal: Rs ${grandTotal}`;
      const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(msg)}`;
      window.open(whatsappUrl, "_blank");

      setCart([]);
      setCustomerName("");
      localStorage.removeItem("cart");
      setShowCart(false);
    } catch (err) {
      console.error("Checkout error:", err);
      alert("Order save failed");
    }
  }

  async function handleDeleteOrder(orderId) {
    try {
      const res = await fetch(`${API_BASE}/api/orders/${orderId}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Delete failed");
      }

      setOrders((prev) => {
        const next = prev.filter((o) => o.id !== orderId);
        saveOrdersCache(next).catch((error) => {
          console.error("Orders cache save failed:", error);
        });
        return next;
      });
      return true;
    } catch (err) {
      console.error("Delete error:", err);
      alert("Delete failed");
      return false;
    }
  }

  async function fetchList(
    endpoint,
    setData,
    label,
    transform,
    { onSuccess, resetOnError = false } = {},
  ) {
    try {
      const response = await fetch(`${API_BASE}${endpoint}`);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const payload = await response.json();
      const next = transform ? transform(payload) : payload;
      const list = Array.isArray(next) ? next : [];
      setData(list);
      setFetchError("");

      if (onSuccess) {
        onSuccess(list);
      }

      return list;
    } catch (error) {
      console.error(`Failed to fetch ${label}:`, error);
      if (resetOnError) {
        setData([]);
      }
      setFetchError(`Could not load ${label}. Check connection and retry.`);
      return null;
    }
  }

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

  useEffect(() => {
    const saved = localStorage.getItem("cart");
    if (saved) {
      try {
        setCart(JSON.parse(saved));
      } catch {
        // no-op
      }
    }
    setCartLoaded(true);
  }, []);

  useEffect(() => {
    if (!cartLoaded) return;
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart, cartLoaded]);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const cachedCategories = await loadCategoriesCache();
        if (!cancelled && cachedCategories.length) {
          setCategories(cachedCategories);
        }
      } catch (error) {
        console.error("Categories cache read failed:", error);
      }

      await fetchList(
        "/api/categories",
        (next) => {
          if (!cancelled) {
            setCategories(next);
          }
        },
        "categories",
        undefined,
        {
          onSuccess: (next) => {
            saveCategoriesCache(next).catch((error) => {
              console.error("Categories cache save failed:", error);
            });
          },
        },
      );
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const cachedProducts = await loadProductsCache();
        if (!cancelled && cachedProducts.length) {
          setProducts(cachedProducts);
        }
      } catch (error) {
        console.error("Products cache read failed:", error);
      }

      await fetchList(
        "/api/products",
        (next) => {
          if (!cancelled) {
            setProducts(next);
          }
        },
        "products",
        undefined,
        {
          onSuccess: (nextProducts) => {
            saveProductsCache(nextProducts).catch((error) => {
              console.error("Products cache save failed:", error);
            });
          },
        },
      );
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const cachedCustomers = await loadCustomersCache();
        if (!cancelled && cachedCustomers.length) {
          setCustomers(cachedCustomers);
        }
      } catch (error) {
        console.error("Customers cache read failed:", error);
      }
    })();

    const run = () =>
      fetchList(
        "/api/customers",
        (next) => {
          if (!cancelled) {
            setCustomers(next);
          }
        },
        "customers",
        undefined,
        {
          onSuccess: (nextCustomers) => {
            saveCustomersCache(nextCustomers).catch((error) => {
              console.error("Customers cache save failed:", error);
            });
          },
        },
      );

    if ("requestIdleCallback" in window) {
      const id = window.requestIdleCallback(run);
      return () => {
        cancelled = true;
        window.cancelIdleCallback(id);
      };
    }

    const timeoutId = setTimeout(run, 250);
    return () => {
      cancelled = true;
      clearTimeout(timeoutId);
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    const ordersTransform = (data) => {
      if (Array.isArray(data)) return data;
      if (Array.isArray(data?.orders)) return data.orders;
      return [];
    };

    const runNetworkRefresh = async () => {
      await fetchList(
        "/api/orders",
        (next) => {
          if (!cancelled) {
            setOrders(next);
          }
        },
        "orders",
        ordersTransform,
        {
          onSuccess: (nextOrders) => {
            saveOrdersCache(nextOrders).catch((error) => {
              console.error("Orders cache save failed:", error);
            });
          },
        },
      );

      if (!cancelled) {
        setOrdersLoading(false);
      }
    };

    const run = async () => {
      setOrdersLoading(true);

      try {
        const cachedOrders = await loadOrdersCache();
        if (!cancelled && cachedOrders.length) {
          setOrders(cachedOrders);
          setOrdersLoading(false);
        }
      } catch (error) {
        console.error("Orders cache read failed:", error);
      }

      await runNetworkRefresh();
    };

    if ("requestIdleCallback" in window) {
      const id = window.requestIdleCallback(() => {
        run();
      });
      return () => {
        cancelled = true;
        window.cancelIdleCallback(id);
      };
    }

    const timeoutId = setTimeout(() => {
      run();
    }, 400);
    return () => {
      cancelled = true;
      clearTimeout(timeoutId);
    };
  }, []);

  const catalogProps = {
    categories,
    selectedCategory,
    setSelectedCategory,
    products,
    setViewProduct: openProduct,
    cart,
    addToCart,
    increaseQty,
    decreaseQty,
    search,
    setSearch,
    orders,
    customerName,
    orderMode,
    setOrderMode,
    imageFilter,
    sortOption,
    layoutMode,
    setLayoutMode,
    showByCategory,
    showOutOfStock,
    setShowOutOfStock,
    mostSellingOnly,
    setMostSellingOnly,
  };

  return (
    <>
      {isCatalogRoute && (
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
          onOrdersClick={() => navigate("/orders")}
          onFilterClick={() => setFilterOpen(true)}
        />
      )}

      {fetchError && (
        <Alert
          severity="warning"
          onClose={() => setFetchError("")}
          action={
            <Button
              color="inherit"
              size="small"
              onClick={() => window.location.reload()}
            >
              Retry
            </Button>
          }
          sx={{ mx: { xs: 1.5, sm: 2 }, my: 1 }}
        >
          {fetchError}
        </Alert>
      )}

      <AppRoutes
        products={products}
        orders={orders}
        ordersLoading={ordersLoading}
        cart={cart}
        addToCart={addToCart}
        increaseQty={increaseQty}
        decreaseQty={decreaseQty}
        onOpenProduct={openProduct}
        onBackFromProduct={handleBackFromProduct}
        onDeleteOrder={handleDeleteOrder}
        catalog={catalogProps}
      />

      {isCatalogRoute && showCart && (
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

      {isCatalogRoute && (
        <FilterDrawer
          open={filterOpen}
          onClose={() => setFilterOpen(false)}
          imageFilter={imageFilter}
          setImageFilter={setImageFilter}
          sortOption={sortOption}
          setSortOption={setSortOption}
          layoutMode={layoutMode}
          setLayoutMode={setLayoutMode}
          showByCategory={showByCategory}
          setShowByCategory={setShowByCategory}
        />
      )}
    </>
  );
}

export default App;
