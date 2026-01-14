export default function AdminBottomBar({
  adminTab,
  setAdminTab,
  onLogout,
}) {
  return (
    <div style={bar}>
      <Tab icon="📊" label="Dashboard" active={adminTab==="dashboard"} onClick={() => setAdminTab("dashboard")} />
      <Tab icon="📦" label="Products" active={adminTab==="products"} onClick={() => setAdminTab("products")} />
      <Tab icon="👥" label="Customers" active={adminTab==="customers"} onClick={() => setAdminTab("customers")} />
      <Tab icon="📏" label="Units" active={adminTab==="units"} onClick={() => setAdminTab("units")} />
      <Tab icon="🗂️" label="Categories" active={adminTab==="categories"} onClick={() => setAdminTab("categories")} />
      <Tab icon="🚪" label="Logout" danger onClick={onLogout} />
    </div>
  );
}

function Tab({ icon, label, onClick, active, danger }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: "none",
        border: "none",
        fontSize: 12,
        color: danger ? "#ef4444" : active ? "#2563eb" : "#374151",
        fontWeight: active ? 700 : 500,
      }}
    >
      <div style={{ fontSize: 18 }}>{icon}</div>
      {label}
    </button>
  );
}

const bar = {
  position: "fixed",
  bottom: 0,
  left: 0,
  right: 0,
  height: 64,
  display: "flex",
  justifyContent: "space-around",
  alignItems: "center",
  background: "#fff",
  borderTop: "1px solid #e5e7eb",
  zIndex: 1000,
};