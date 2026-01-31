export default function CartSheet({
  cart,
  removeFromCart,
  updateCartItem,
  onClose,
  onCheckout,
  customerName,
}) {
  const total = cart.reduce(
    (s, i) => s + i.qty * i.price * i.unitMultiplier,
    0,
  );

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.45)",
          zIndex: 40,
        }}
      />

      {/* Sheet */}
      <div
        style={{
          position: "fixed",
          left: 0,
          right: 0,
          bottom: 0,
          height: "85vh",
          background: "#f9fafb",
          borderTopLeftRadius: 18,
          borderTopRightRadius: 18,
          zIndex: 50,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Header */}
        <div style={header}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <h3 style={{ margin: 0 }}>🛒 Cart</h3>
            <button onClick={onClose}>✕</button>
          </div>
          <div style={customerTxt}>
            👤 {customerName || "No customer selected"}
          </div>
        </div>

        {/* Items */}
        <div style={{ flex: 1, overflowY: "auto", padding: 12 }}>
          {cart.length === 0 && (
            <p style={{ color: "#6b7280" }}>No items in cart</p>
          )}

          {cart.map((c) => (
            <div key={c.productId} style={card}>
              {/* Product name */}
              <div style={{ fontWeight: 600, marginBottom: 6 }}>{c.name}</div>

              {/* SINGLE ROW */}
              <div style={row}>
                {/* Rate */}
                <input
                  type="text"
                  inputMode="decimal"
                  value={c.price}
                  onChange={(e) =>
                    updateCartItem(c.productId, {
                      price: Number(e.target.value || 0),
                    })
                  }
                  placeholder="Rate"
                  style={smallInput}
                />
                ✕{/* Qty */}
                <input
                  type="text"
                  inputMode="numeric"
                  value={c.qty}
                  onChange={(e) =>
                    updateCartItem(c.productId, {
                      qty: Number(e.target.value || 1),
                    })
                  }
                  placeholder="Qty"
                  style={smallInput}
                />
                {/* Item total */}
                <div style={itemTotal}>
                  ₹{c.qty * c.price * c.unitMultiplier}
                </div>
                {/* Remove */}
                <button
                  onClick={() => removeFromCart(c.productId)}
                  style={removeBtn}
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div style={footer}>
            <strong>Total: ₹{total}</strong>

            <button onClick={onCheckout} style={checkoutBtn}>
              Checkout / WhatsApp
            </button>
          </div>
        )}
      </div>
    </>
  );
}

/* ================= STYLES ================= */

const header = {
  padding: "10px 14px",
  borderBottom: "1px solid #e5e7eb",
  background: "#fff",
};

const customerTxt = {
  fontSize: 13,
  color: "#2563eb",
  fontWeight: 600,
  marginTop: 4,
};

const card = {
  background: "#fff",
  borderRadius: 14,
  padding: 10,
  marginBottom: 10,
  boxShadow: "0 3px 10px rgba(0,0,0,0.06)",
};

const row = {
  display: "flex",
  alignItems: "center",
  gap: 8,
};

const smallInput = {
  width: 70,
  padding: "6px 8px",
  borderRadius: 8,
  border: "1px solid #d1d5db",
  fontSize: 14,
  textAlign: "center",

  /* 🔥 REMOVE ARROWS */
  appearance: "textfield",
};

const itemTotal = {
  marginLeft: "auto",
  fontWeight: 700,
  color: "#0f766e",
  fontSize: 14,
};

const removeBtn = {
  background: "#fee2e2",
  color: "#b91c1c",
  border: "none",
  borderRadius: 8,
  padding: "4px 8px",
  cursor: "pointer",
};

const footer = {
  padding: 14,
  borderTop: "1px solid #e5e7eb",
  background: "#fff",
};

const checkoutBtn = {
  width: "100%",
  marginTop: 10,
  padding: 14,
  background: "linear-gradient(90deg,#22c55e,#16a34a)",
  color: "#fff",
  border: "none",
  borderRadius: 14,
  fontSize: 16,
  fontWeight: 700,
};
