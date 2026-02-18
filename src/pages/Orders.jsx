import { useNavigate } from "react-router-dom";

export default function Orders({ orders }) {
  const navigate = useNavigate();

  return (
    <div style={{ padding: 16, maxWidth: 900, margin: "0 auto" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
        <button onClick={() => navigate(-1)}>⬅ Back</button>
        <h2 style={{ margin: 0 }}>Orders History</h2>
      </div>

      {orders.length === 0 && <p style={{ color: "#6b7280" }}>No orders yet</p>}

      {orders
        .slice()
        .reverse()
        .map((o, index) => {
          const orderItems = o.order_items || o.items || [];

          return (
            <div
              key={o.id}
              style={{
                background: o.total > 2000 ? "#ecfeff" : "#fff",
                borderRadius: 12,
                padding: 14,
                marginBottom: 12,
                boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 6,
                }}
              >
                <strong>#{orders.length - index} - {o.customer}</strong>
                <span style={{ fontSize: 12, color: "#6b7280" }}>
                  {new Date(o.date).toLocaleString()}
                </span>
              </div>

              <ul style={{ paddingLeft: 16, marginBottom: 8 }}>
                {orderItems.map((it, i) => (
                  <li key={i} style={{ fontSize: 14 }}>
                    {it.name} – {it.qty} × ₹{it.price}
                  </li>
                ))}
              </ul>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
                style={waBtn}
              >
                <strong>Total: ₹{o.total}</strong>

                <button
                  onClick={() => {
                    let msg = "*MANGALYA AGENCIES*\nOrder Summary\n\n";
                    msg += `Customer: ${o.customer}\n\n`;

                    orderItems.forEach((it, i) => {
                      msg += `${i + 1}) ${it.name}\n`;
                      msg += `   ${it.qty} ${it.unitName} × ₹${it.price} = ₹${it.total}\n\n`;
                    });

                    msg += `------------------\nTotal Amount: ₹${o.total}`;

                    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, "_blank");
                  }}
                  style={{
                    padding: "6px 10px",
                    borderRadius: 8,
                    border: "none",
                    background: "#25D366",
                    color: "#fff",
                    fontSize: 13,
                  }}
                >
                  WhatsApp
                </button>
              </div>
            </div>
          );
        })}
    </div>
  );
}

const backBtn = {
  border: "1px solid #d1d5db",
  background: "#fff",
  borderRadius: 8,
  padding: "8px 12px",
};

const waBtn = {
  padding: "8px 12px",
  borderRadius: 8,
  border: "none",
  background: "#25D366",
  color: "#fff",
  fontSize: 13,
  fontWeight: 700,
};
