export default function AdminDashboard({ orders }) {
  const today = new Date();
  const todayStr = today.toDateString();

  const thisMonth = today.getMonth();
  const thisYear = today.getFullYear();

  let todayOrders = 0;
  let todaySales = 0;
  let monthOrders = 0;
  let monthSales = 0;

  orders.forEach((o) => {
    const d = new Date(o.date);

    // Today
    if (d.toDateString() === todayStr) {
      todayOrders += 1;
      todaySales += o.total;
    }

    // This month
    if (
      d.getMonth() === thisMonth &&
      d.getFullYear() === thisYear
    ) {
      monthOrders += 1;
      monthSales += o.total;
    }
  });

  return (
    <div style={{ marginBottom: 24 }}>
      <h3 style={{ marginBottom: 12 }}>Dashboard</h3>

      <div style={grid}>
        <StatCard
          title="Today's Orders"
          value={todayOrders}
        />
        <StatCard
          title="Today's Sales"
          value={`₹${todaySales}`}
        />
        <StatCard
          title="This Month Orders"
          value={monthOrders}
        />
        <StatCard
          title="This Month Sales"
          value={`₹${monthSales}`}
        />
      </div>
    </div>
  );
}

/* ===== Small Card ===== */

function StatCard({ title, value }) {
  return (
    <div style={card}>
      <div style={{ fontSize: 13, color: "#6b7280" }}>
        {title}
      </div>
      <div style={{ fontSize: 22, fontWeight: 700 }}>
        {value}
      </div>
    </div>
  );
}

/* ===== styles ===== */

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
  gap: 12,
};

const card = {
  background: "#ffffff",
  borderRadius: 14,
  padding: 16,
  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
};