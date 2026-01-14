import { useState } from "react";
import AdminDashboard from "../components/AdminDashboard";
import AdminProductForm from "../components/AdminProductForm";
import AdminProductList from "../components/AdminProductList";
import CustomerManager from "../components/CustomerManager";
import UnitManager from "../components/UnitManager";
import AdminBottomBar from "../components/AdminBottomBar";

export default function Admin({
  categories,
  setCategories,
  products,
  setProducts,
  orders = [],
  customers = [],
  setCustomers,
  units = [],
  setUnits,
  onLogout,
}) {
  const [adminTab, setAdminTab] = useState("dashboard");
  const [editingProduct, setEditingProduct] = useState(null);

  return (
    <div
      style={{
        paddingBottom: 70,
        maxWidth: 900,
        margin: "0 auto",
        background: "#f9fafb",
        minHeight: "100vh",
      }}
    >
      <h2 style={{ padding: 16 }}>Admin Panel</h2>

      {/* DASHBOARD */}
      {adminTab === "dashboard" && (
        <div style={{ padding: 16 }}>
          <AdminDashboard orders={orders} />
        </div>
      )}

{/* PRODUCTS */}
{adminTab === "products" && (
  <div style={{ padding: 16 }}>
    <AdminProductForm
      categories={categories}
      setCategories={setCategories}
      products={products}
      setProducts={setProducts}
      editingProduct={editingProduct}
      setEditingProduct={setEditingProduct}
      units={units}
      setUnits={setUnits}
    />

    <hr />

    <AdminProductList
      products={products}
      categories={categories}
      setProducts={setProducts}
      onEdit={setEditingProduct}
    />
  </div>
)}

      {/* CUSTOMERS */}
      {adminTab === "customers" && (
        <div style={{ padding: 16 }}>
          <CustomerManager
            customers={customers}
            setCustomers={setCustomers}
          />
        </div>
      )}

      {/* UNITS */}
      {adminTab === "units" && (
        <div style={{ padding: 16 }}>
          <UnitManager
            units={units}
            setUnits={setUnits}
          />
        </div>
      )}
      {/* CATEGORIES */}
{adminTab === "categories" && (
  <div style={{ padding: 16 }}>
    <h3>Categories</h3>
    <p>Category manager coming soon</p>
  </div>
)}

      {/* ORDERS */}
      {adminTab === "orders" && (
        <div style={{ padding: 16 }}>
          <h3>Orders</h3>
          <p>Total Orders: {orders.length}</p>
        </div>
      )}

      <AdminBottomBar
        adminTab={adminTab}
        setAdminTab={setAdminTab}
        onLogout={onLogout}
      />
    </div>
  );
}