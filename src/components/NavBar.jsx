import { Link } from "react-router-dom";
import CustomerSelect from "./CustomerSelect";

export default function NavBar({
  cartCount,
  cartTotal,
  customerName,
  setCustomerName,
  customers,
  setCustomers,
}) {
  return (
    <div
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        background: "#fff",
        borderBottom: "1px solid #e5e7eb",
        padding: 12,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
        <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
          <div style={{ fontSize: 18, fontWeight: 700, color: "#2563eb" }}>Mangalya Agencies</div>
          <div style={{ fontSize: 11, color: "#6b7280" }}>Sales Catalog</div>
        </Link>

        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <Link to="/orders">Orders</Link>
          <span style={{ fontWeight: 600 }}>🛒 {cartCount} | ₹{cartTotal}</span>
        </div>
      </div>

      <CustomerSelect
        customers={customers}
        setCustomers={setCustomers}
        customerName={customerName}
        setCustomerName={setCustomerName}
      />
    </div>
  );
}
