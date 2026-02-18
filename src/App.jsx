import { useState, useEffect } from "react";
import Catalog from "./pages/Catalog";
import ProductView from "./pages/ProductView";
import NavBar from "./components/NavBar";
import CartSheet from "./components/CartSheet";
import Orders from "./pages/Orders";
import Admin from "./pages/Admin";


import {
  saveCategories,
  loadCategories,
  saveProducts,
  loadProducts,
  saveOrders,
  loadOrders,
  saveCustomers,
  loadCustomers,
  saveUnits,
  loadUnits,
} from "./db";

const ADMIN_PIN = "1234";

function App() {
  
  const [mode, setMode] = useState("catalog");
  const [pin, setPin] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [newCategory, setNewCategory] = useState("");

  const [products, setProducts] = useState([]);

  //const [productName, setProductName] = useState("");
 // const [price, setPrice] = useState("");
 // const [productCategory, setProductCategory] = useState("");
//  const [units, setUnits] = useState([{ name: "Piece", multiplier: 1 }]);
  const [productsLoaded, setProductsLoaded] = useState(false);
//  const [productImage, setProductImage] = useState(null);
 const [viewProduct, setViewProduct] = useState(null);
 const [cart, setCart] = useState([]);
// const [selectedUnit, setSelectedUnit] = useState(null);
//const [qty, setQty] = useState(1);
const [cartLoaded, setCartLoaded] = useState(false);
const [customerName, setCustomerName] = useState("");
const [orders, setOrders] = useState([]);
const [ordersLoaded, setOrdersLoaded] = useState(false);
const [search, setSearch] = useState("");
const [showCart, setShowCart] = useState(false);
const [showOrders, setShowOrders] = useState(false);
const [customers, setCustomers] = useState([]);
const [customersLoaded, setCustomersLoaded] = useState(false);

const [masterUnits, setMasterUnits] = useState([]);
const [masterUnitsLoaded, setMasterUnitsLoaded] = useState(false);



function updateCartUnit(productId, unit) {
  setCart(
    cart.map((c) =>
      c.productId === productId
        ? {
            ...c,
            unitName: unit.name,
            unitMultiplier: unit.multiplier,
            total:
              c.qty *
              c.price *
              unit.multiplier,
          }
        : c
    )
  );
}


function handleCheckout() {
  if (cart.length === 0) return;

  let msg = `*MANGALYA AGENCIES*\n\n`;
  msg += `Customer: ${customerName || "N/A"}\n\n`;

  cart.forEach((c, i) => {
    msg += `${i + 1}) ${c.name}\n`;
    msg += `   ${c.qty} ${c.unitName} × ₹${c.price} = ₹${c.total}\n\n`;
  });

  const total = cart.reduce((s, i) => s + i.total, 0);
  msg += `------------------\nTotal: ₹${total}`;

  // 🔥 MOBILE SAFE
  window.location.href =
    `https://wa.me/?text=${encodeURIComponent(msg)}`;

  // Save order
  const newOrder = {
    id: Date.now(),
    customer: customerName || "Unknown",
    date: new Date().toISOString(),
    items: cart,
    total,
  };

  saveOrders(newOrder).catch((err) => {
    console.error("Failed to save order to API", err);
  });

  setOrders(prev => [...prev, newOrder]);

  // Clear cart
  setCart([]);
  setCustomerName("");
  localStorage.removeItem("cart");
  setShowCart(false);
}

//addToCart helpers
function addToCart(product, unit = product.units[0]) {
  const unitPrice = product.price * unit.multiplier;

  setCart([
    ...cart,
    {
      productId: product.id,
      name: product.name,
      price: product.price,          // base price
      unitName: unit.name,
      unitMultiplier: unit.multiplier,
      qty: 1,
      total: unitPrice,              // 🔥 calculated
    },
  ]);
}

function increaseQty(productId) {
  setCart(
    cart.map((c) =>
      c.productId === productId
        ? {
            ...c,
            qty: c.qty + 1,
            total:
              (c.qty + 1) *
              c.price *
              c.unitMultiplier,
          }
        : c
    )
  );
}

function decreaseQty(productId) {
  setCart(
    cart
      .map((c) =>
        c.productId === productId
          ? {
              ...c,
              qty: c.qty - 1,
              total:
                (c.qty - 1) *
                c.price *
                c.unitMultiplier,
            }
          : c
      )
      .filter((c) => c.qty > 0)
  );
}

function removeFromCart(id) {
  setCart(cart.filter((c) => c.productId !== id));
}


const cartTotal = cart.reduce((sum, item) => sum + item.total, 0);



function getCustomerOrders(name) {
  if (!name) return [];

  const key = name.trim().toLowerCase();

  return orders.filter(o =>
    o.customer &&
    o.customer.toLowerCase().includes(key)
  );
}


// generateWhatsAppMessage
 function generateWhatsAppMessage() {
  let msg = `*MANGALYA AGENCIES*\n`;
  msg += `Order Summary\n\n`;
  msg += `Customer: ${customerName || "N/A"}\n\n`;

  cart.forEach((c, i) => {
    msg += `${i + 1}) ${c.name}\n`;
    msg += `   ${c.qty} × ₹${c.price} = ₹${c.total}\n\n`;
  });

  const grandTotal = cart.reduce((s, i) => s + i.total, 0);

  msg += `------------------\n`;
  msg += `Total Amount: ₹${grandTotal}`;

  return msg;
}
 
 //handleImageUpload 
  function handleImageUpload(e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    setProductImage(reader.result); // Base64
  };
  reader.readAsDataURL(file);
}


useEffect(() => {
  loadUnits().then((data) => {
    setMasterUnits(data || []);
    setMasterUnitsLoaded(true);
  });
}, []);

useEffect(() => {
  if (!masterUnitsLoaded) return;
  saveUnits(masterUnits);
}, [masterUnits, masterUnitsLoaded]);

useEffect(() => {
  loadCustomers().then((data) => {
    setCustomers(data || []);
    setCustomersLoaded(true);
  });
}, []);


useEffect(() => {
  if (!customersLoaded) return;
  saveCustomers(customers);
}, [customers, customersLoaded]);



//orders
useEffect(() => {
  loadOrders().then(data => {
    setOrders(data || []);
    setOrdersLoaded(true); // 🔑 VERY IMPORTANT
  });
}, []);

//cart
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
  if (!cartLoaded) return;   // 🔒 BLOCK early save
  localStorage.setItem("cart", JSON.stringify(cart));
}, [cart, cartLoaded]);


  // Load categories
  useEffect(() => {
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
  }, []);
  // selectedCategory
  useEffect(() => {
  if (categories.length > 0 && !selectedCategory) {
    setSelectedCategory(categories[0].id);
  }
}, [categories, selectedCategory]);

  // Save categories
  useEffect(() => {
    if (categories.length) saveCategories(categories);
  }, [categories]);

  // Load products

useEffect(() => {
  loadProducts().then((data) => {
    setProducts(data || []);
    setProductsLoaded(true);
  });
}, []);
  // Save products
useEffect(() => {
  if (productsLoaded) {
    saveProducts(products);
  }
}, [products, productsLoaded]);

if (mode === "adminLogin") {
  return (
    <div
      style={{
        padding: 20,
        maxWidth: 400,
        margin: "60px auto",
        background: "#fff",
        borderRadius: 12,
        boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
      }}
    >
      <h2 style={{ marginBottom: 16 }}>Admin Login</h2>

      <input
        type="password"
        placeholder="Enter Admin PIN"
        value={pin}
        onChange={(e) => setPin(e.target.value)}
        style={{
          width: "100%",
          padding: 12,
          borderRadius: 8,
          border: "1px solid #d1d5db",
          marginBottom: 12,
        }}
      />

      <button
        style={{
          width: "100%",
          padding: 12,
          background: "#2563eb",
          color: "#fff",
          border: "none",
          borderRadius: 8,
          fontWeight: 600,
        }}
        onClick={() => {
          if (pin === ADMIN_PIN) {
            setIsAdmin(true);
            setMode("admin");
            setPin("");
          } else {
            alert("Wrong PIN");
          }
        }}
      >
        Login
      </button>

      <button
        onClick={() => setMode("catalog")}
        style={{
          marginTop: 10,
          width: "100%",
          padding: 10,
          background: "#e5e7eb",
          border: "none",
          borderRadius: 8,
        }}
      >
        Back to Catalog
      </button>
    </div>
  );
}

  // 🔐 Admin Login
  if (mode === "admin" && isAdmin) {
  return (
    <Admin
  categories={categories}
  setCategories={setCategories}
  products={products}
  setProducts={setProducts}
  orders={orders}
  customers={customers}
  setCustomers={setCustomers}
  units={masterUnits}
  setUnits={setMasterUnits}
  onLogout={() => {
    setIsAdmin(false);
    setMode("catalog");
  }}
/>
  );
}

// 👀 Product View (NEW ARCHITECTURE)
if (viewProduct) {
  return (
<ProductView
updateCartUnit={updateCartUnit}
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
  return (
    <Orders
      orders={orders}
      onBack={() => setShowOrders(false)}
    />
  );
}

//
if (mode === "catalog") {
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
  onAdminClick={() => setMode("adminLogin")}
  customers={customers}         
  setCustomers={setCustomers}
  products={products}           
  setViewProduct={setViewProduct}
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
// ✅ SAFETY FALLBACK (VERY IMPORTANT)
return (
  <div style={{ padding: 20 }}>
    <h2>Loading app...</h2>
  </div>
);
}

export default App;
