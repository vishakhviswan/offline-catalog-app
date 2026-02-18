export default function Orders({ orders, onBack }) {
  return (
    <div className="page-wrap orders-wrap">
      <div className="orders-head">
        <button onClick={onBack} className="btn-soft">⬅ Back</button>
        <h2 style={{ margin: 0 }}>Orders History</h2>
      </div>

      {orders.length === 0 && <p style={{ color: "#6b7280" }}>No orders yet</p>}

      {orders
        .slice()
        .reverse()
        .map((o, index) => (
          <div key={o.id} className="order-card">
            <div className="order-top">
              <strong>#{orders.length - index} - {o.customer}</strong>
              <span style={{ fontSize: 12, color: "#6b7280" }}>
                {new Date(o.date).toLocaleString()}
              </span>
            </div>

            <ul style={{ paddingLeft: 16, marginBottom: 8 }}>
              {o.items.map((it, i) => (
                <li key={i} style={{ fontSize: 14 }}>
                  {it.name} – {it.qty} × ₹{it.price}
                </li>
              ))}
            </ul>

            <div className="order-bottom">
              <strong>Total: ₹{o.total}</strong>

              <button
                onClick={() => {
                  let msg = `*MANGALYA AGENCIES*\nOrder Summary\n\n`;
                  msg += `Customer: ${o.customer}\n\n`;

                  o.items.forEach((it, i) => {
                    msg += `${i + 1}) ${it.name}\n`;
                    msg += `   ${it.qty} ${it.unitName} × ₹${it.price} = ₹${it.total}\n\n`;
                  });

                  msg += `------------------\nTotal Amount: ₹${o.total}`;

                  window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, "_blank");
                }}
                className="btn-wa"
              >
                WhatsApp
              </button>
            </div>
          </div>
        ))}
    </div>
  );
}
