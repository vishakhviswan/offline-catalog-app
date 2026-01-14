import CustomerSelect from "./CustomerSelect";

export default function NavBar({
  search,
  setSearch,
  cartCount,
  cartTotal,
  customerName,
  setCustomerName,
  customers,
  setCustomers,
  onCartClick,
  onOrdersClick,
  onAdminClick,
  products,
  setViewProduct,
}) {
  const suggestions =
    search.length > 0
      ? products
          .filter((p) =>
            p.name.toLowerCase().includes(search.toLowerCase())
          )
          .slice(0, 6)
      : [];

  return (
    <div style={{ position: "sticky", top: 0, zIndex: 50, background: "#fff", borderBottom: "1px solid #e5e7eb", padding: 12 }}>
      {/* TOP BAR */}
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div>
          <div style={{ fontSize: 18, fontWeight: 700, color: "#2563eb" }}>
            Mangalya Agencies
          </div>
          <div style={{ fontSize: 11, color: "#6b7280" }}>
            Sales Catalog
          </div>
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={onOrdersClick}>Orders</button>

          <button onClick={onCartClick}>
            🛒 {cartCount > 0 && `(${cartCount})`} ₹{cartTotal}
          </button>

          <button onClick={onAdminClick}>Admin</button>
        </div>
      </div>

      {/* SEARCH */}
      <input
        placeholder="🔍 Search products..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ width: "100%", padding: 10, marginTop: 8 }}
      />

      {suggestions.map((p) => (
        <div
          key={p.id}
          onClick={() => {
            setViewProduct(p);
            setSearch("");
          }}
          style={{ padding: 8, cursor: "pointer" }}
        >
          {p.name} – ₹{p.price}
        </div>
      ))}

      {/* CUSTOMER */}
      <CustomerSelect
        customers={customers}
        setCustomers={setCustomers}
        customerName={customerName}
        setCustomerName={setCustomerName}
      />
    </div>
  );
}

/* ===== styles ===== */

const topRow = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const brand = { fontSize: 18, fontWeight: 700, color: "#2563eb" };
const subtitle = { fontSize: 11, color: "#6b7280" };

const input = {
  width: "100%",
  padding: "10px 12px",
  borderRadius: 10,
  border: "1px solid #d1d5db",
  marginTop: 8,
};

const linkBtn = {
  background: "none",
  border: "none",
  color: "#2563eb",
  fontWeight: 600,
};

const cartBtn = {
  position: "relative",
  background: "none",
  border: "none",
  fontSize: 18,
};

const cartBadge = {
  position: "absolute",
  top: -6,
  right: -8,
  background: "#ef4444",
  color: "#fff",
  borderRadius: "50%",
  fontSize: 11,
  padding: "2px 6px",
};

const cartTotalTxt = { fontSize: 13, fontWeight: 600 };

const adminBtn = {
  background: "#111827",
  color: "#fff",
  border: "none",
  padding: "6px 10px",
  borderRadius: 8,
};

const suggestBox = {
  background: "#fff",
  border: "1px solid #e5e7eb",
  borderRadius: 10,
  marginTop: 4,
  boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
};

const suggestItem = {
  padding: "10px 12px",
  cursor: "pointer",
  borderBottom: "1px solid #f3f4f6",
};