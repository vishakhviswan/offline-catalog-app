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
    <div className="top-nav-shell">
      <div className="top-nav-row">
        <div>
          <div className="top-nav-brand">Mangalya Agencies</div>
          <div className="top-nav-sub">Sales Catalog</div>
        </div>

        <div className="top-nav-actions">
          <button onClick={onOrdersClick} className="btn-soft">Orders</button>
          <button onClick={onCartClick} className="btn-primary-dark">
            🛒 {cartCount > 0 ? `(${cartCount})` : ""} ₹{cartTotal}
          </button>
          <button onClick={onAdminClick} className="btn-soft">Admin</button>
        </div>
      </div>

      <input
        placeholder="🔍 Search products..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="search-input"
      />

      {suggestions.length > 0 && (
        <div className="suggestions-box">
          {suggestions.map((p) => (
            <div
              key={p.id}
              onClick={() => {
                setViewProduct(p);
                setSearch("");
              }}
              className="suggestion-item"
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
