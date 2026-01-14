export default function CartSheet({
  cart,
  increaseQty,
  decreaseQty,
  removeFromCart,
  onClose,
  onCheckout,
}) {
  const total = cart.reduce((s, i) => s + i.total, 0);

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.4)",
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
    background: "#fff",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    boxShadow: "0 -4px 20px rgba(0,0,0,0.15)",
    zIndex: 9999,      // 🔥 VERY IMPORTANT
    display: "flex",
    flexDirection: "column",
        }}
      >
        {/* Handle */}
        <div
          style={{
            width: 40,
            height: 4,
            background: "#d1d5db",
            borderRadius: 999,
            margin: "0 auto 12px",
          }}
        />

        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 10,
          }}
        >
          <h3 style={{ margin: 0 }}>Cart</h3>
          <button onClick={onClose}>✕</button>
        </div>

        {/* Items */}
        <div style={{ flex: 1, overflowY: "auto" }}>
          {cart.length === 0 && (
            <p>No items in cart</p>
          )}

          {cart.map((c) => (
            <div
              key={c.productId}
              style={{
                borderBottom: "1px solid #e5e7eb",
                padding: "10px 0",
              }}
            >
              <strong>{c.name}</strong>

              <div style={{ fontSize: 14, margin: "6px 0" }}>
                ₹{c.price} × {c.qty}
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                <button
                  onClick={() => decreaseQty(c.productId)}
                >
                  −
                </button>

                <strong>{c.qty}</strong>

                <button
                  onClick={() => increaseQty(c.productId)}
                >
                  +
                </button>

                <button
                  onClick={() =>
                    removeFromCart(c.productId)
                  }
                  style={{
                    marginLeft: "auto",
                    color: "#ef4444",
                    background: "none",
                    border: "none",
                  }}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div style={{ marginTop: 12 }}>
            <h3>Total: ₹{total}</h3>

            <button
  style={{
    width: "100%",
    padding: 14,
    background: "#25D366",
    color: "#fff",
    border: "none",
    borderRadius: 12,
    fontSize: 16,
    fontWeight: 600,
    cursor: "pointer",
  }}
  onClick={onCheckout}
>
  Checkout / WhatsApp
</button>
          </div>
        )}
      </div>
    </>
  );
}