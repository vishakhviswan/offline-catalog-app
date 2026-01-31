export default function Orders({ orders = [], onBack }) {
  return (
    <div
      style={{
        padding: 16,
        maxWidth: 900,
        margin: "0 auto",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          marginBottom: 16,
        }}
      >
        <button onClick={onBack}>⬅ Back</button>
        <h2 style={{ margin: 0 }}>Orders History</h2>
      </div>

      {orders.length === 0 && <p style={{ color: "#6b7280" }}>No orders yet</p>}

      {orders.map((o, index) => (
        <div
          key={o.id}
          style={{
            background: o.total > 2000 ? "#ecfeff" : "#ffffff",
            borderRadius: 12,
            padding: 14,
            marginBottom: 12,
            boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
          }}
        >
          {/* Order Header */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 6,
            }}
          >
            <strong>
              #{orders.length - index} – {o.customer_name || "Walk-in"}
            </strong>

            <span style={{ fontSize: 12, color: "#6b7280" }}>
              {new Date(o.created_at).toLocaleString()}
            </span>
          </div>

          {/* Items */}
          <ul style={{ paddingLeft: 16, marginBottom: 8 }}>
            {(o.order_items || []).map((it, i) => (
              <li key={i} style={{ fontSize: 14 }}>
                {it.product_name} – {it.qty} {it.unit_name} × ₹{it.price}
              </li>
            ))}
          </ul>

          {/* Footer */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <strong>Total: ₹{o.total}</strong>

            <button
              onClick={() => {
                let msg = `*MANGALYA AGENCIES*\n\n`;
                msg += `Customer: ${o.customer_name || "Walk-in"}\n`;
                msg += `Date: ${new Date(o.created_at).toLocaleString()}\n\n`;

                (o.order_items || []).forEach((it, i) => {
                  msg += `${i + 1}) ${it.product_name}\n`;
                  msg += `   ${it.qty} ${it.unit_name} × ₹${it.price} = ₹${
                    it.qty * it.price * (it.unit_multiplier || 1)
                  }\n\n`;
                });

                msg += `------------------\nTotal: ₹${o.total}`;

                window.open(
                  "https://wa.me/?text=" + encodeURIComponent(msg),
                  "_blank",
                );
              }}
              style={{
                padding: "6px 12px",
                borderRadius: 8,
                border: "none",
                background: "#25D366",
                color: "#fff",
                fontSize: 13,
                cursor: "pointer",
              }}
            >
              WhatsApp
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
