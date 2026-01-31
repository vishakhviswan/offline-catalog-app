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
          .filter((p) => p && p.name)
          .filter((p) => p.name.toLowerCase().includes(search.toLowerCase()))
          .slice(0, 6)
      : [];

  return (
    <div style={wrapper}>
      {/* ================= TOP BAR ================= */}
      <div style={topRow}>
        {/* BRAND */}
        <div>
          <div style={brand}>🧹 Mangalya Agencies</div>
          <div style={subtitle}>Wholesale Sales Catalog</div>
        </div>

        {/* ACTIONS */}
        <div style={actions}>
          <button onClick={onOrdersClick} style={iconBtn}>
            📦 Orders
          </button>

          <button onClick={onCartClick} style={cartBtn}>
            🛒
            {cartCount > 0 && <span style={cartBadge}>{cartCount}</span>}
            <span style={cartTotalTxt}>₹{cartTotal}</span>
          </button>

          <button onClick={onAdminClick} style={adminBtn}>
            ⚙️ Admin
          </button>
        </div>
      </div>

      {/* ================= SEARCH + CUSTOMER ROW ================= */}
      <div style={searchRow}>
        <div style={searchCol}>
          <input
            placeholder="🔍 Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={searchInput}
          />

          {suggestions.length > 0 && (
            <div style={suggestBox}>
              {suggestions.map((p) => (
                <div
                  key={p.id}
                  onClick={() => {
                    setViewProduct(p);
                    setSearch("");
                  }}
                  style={suggestItem}
                >
                  <div style={{ fontWeight: 600 }}>{p.name}</div>
                  <div style={{ fontSize: 12, color: "#6b7280" }}>
                    ₹{p.price}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={customerCol}>
          <CustomerSelect
            customers={customers}
            setCustomers={setCustomers}
            customerName={customerName}
            setCustomerName={setCustomerName}
          />
        </div>
      </div>
    </div>
  );
}

/* ================= STYLES ================= */

const wrapper = {
  position: "sticky",
  top: 0,
  zIndex: 50,
  background: "#ffffff",
  borderBottom: "1px solid #e5e7eb",
  padding: 12,
};

const topRow = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: 8,
};

const brand = {
  fontSize: 18,
  fontWeight: 800,
  color: "#2563eb",
};

const subtitle = {
  fontSize: 11,
  color: "#6b7280",
};

const actions = {
  display: "flex",
  gap: 8,
  alignItems: "center",
};

const iconBtn = {
  background: "#f3f4f6",
  border: "none",
  padding: "6px 10px",
  borderRadius: 8,
  fontSize: 13,
  cursor: "pointer",
};

const cartBtn = {
  position: "relative",
  background: "#ecfeff",
  border: "none",
  padding: "6px 10px",
  borderRadius: 8,
  display: "flex",
  alignItems: "center",
  gap: 6,
  cursor: "pointer",
};

const cartBadge = {
  position: "absolute",
  top: -6,
  right: -6,
  background: "#ef4444",
  color: "#fff",
  borderRadius: "50%",
  fontSize: 11,
  padding: "2px 6px",
};

const cartTotalTxt = {
  fontSize: 13,
  fontWeight: 700,
  color: "#0f766e",
};

const adminBtn = {
  background: "#111827",
  color: "#fff",
  border: "none",
  padding: "6px 10px",
  borderRadius: 8,
  fontSize: 13,
  cursor: "pointer",
};

const searchInput = {
  width: "100%",
  padding: "10px 12px",
  borderRadius: 12,
  border: "1px solid #d1d5db",
  fontSize: 14,
};

const suggestBox = {
  position: "absolute",
  top: "100%",
  left: 0,
  right: 0,
  background: "#fff",
  border: "1px solid #e5e7eb",
  borderRadius: 12,
  marginTop: 6,
  boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
  overflow: "hidden",
  zIndex: 100,
};

const suggestItem = {
  padding: "10px 12px",
  cursor: "pointer",
  borderBottom: "1px solid #f3f4f6",
};
const searchRow = {
  display: "flex",
  gap: 8,
  marginTop: 12,
};

const searchCol = {
  flex: 3,
  position: "relative",
};

const customerCol = {
  flex: 1,
};