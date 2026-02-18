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
          .filter((p) => p.name.toLowerCase().includes(search.toLowerCase()))
          .slice(0, 6)
      : [];

  return (
    <div
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        background: "#ffffffee",
        backdropFilter: "blur(8px)",
        borderBottom: "1px solid #e5e7eb",
        padding: 12,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 10,
        }}
      >
        <div>
          <div style={{ fontSize: 18, fontWeight: 700, color: "#2563eb" }}>Mangalya Agencies</div>
          <div style={{ fontSize: 11, color: "#6b7280" }}>Sales Catalog</div>
        </div>

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button onClick={onOrdersClick} style={chipBtn}>Orders</button>
          <button onClick={onCartClick} style={primaryBtn}>
            🛒 {cartCount > 0 ? `(${cartCount})` : ""} ₹{cartTotal}
          </button>
          <button onClick={onAdminClick} style={chipBtn}>Admin</button>
        </div>
      </div>

      <input
        placeholder="🔍 Search products..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          width: "100%",
          padding: "10px 12px",
          marginTop: 10,
          borderRadius: 10,
          border: "1px solid #d1d5db",
          outline: "none",
        }}
      />

      {suggestions.length > 0 && (
        <div
          style={{
            marginTop: 6,
            border: "1px solid #e5e7eb",
            borderRadius: 10,
            overflow: "hidden",
            background: "#fff",
            boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
          }}
        >
          {suggestions.map((p) => (
            <div
              key={p.id}
              onClick={() => {
                setViewProduct(p);
                setSearch("");
              }}
              style={{
                padding: "10px 12px",
                cursor: "pointer",
                borderBottom: "1px solid #f3f4f6",
                fontSize: 14,
              }}
            >
              {p.name} – ₹{p.price}
            </div>
          ))}
        </div>
      )}

      <CustomerSelect
        customers={customers}
        setCustomers={setCustomers}
        customerName={customerName}
        setCustomerName={setCustomerName}
      />
    </div>
  );
}

const chipBtn = {
  border: "1px solid #d1d5db",
  background: "#fff",
  borderRadius: 8,
  padding: "8px 12px",
  fontWeight: 600,
};

const primaryBtn = {
  border: "none",
  background: "#111827",
  color: "#fff",
  borderRadius: 8,
  padding: "8px 12px",
  fontWeight: 700,
};
