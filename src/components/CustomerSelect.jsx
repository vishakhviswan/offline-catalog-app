export default function CustomerSelect({
  customers = [], // ✅ DEFAULT EMPTY ARRAY
  customerName,
  setCustomerName,
}) {
  return (
    <div style={{ marginBottom: 10 }}>
      <input
        type="text"
        placeholder="Customer name"
        value={customerName}
        onChange={(e) => setCustomerName(e.target.value)}
        style={{
          width: "100%",
          padding: 10,
          borderRadius: 8,
          border: "1px solid #d1d5db",
        }}
      />

      {customers.length > 0 && (
        <div style={{ marginTop: 6 }}>
          {customers.map((c, i) => (
            <div
              key={i}
              style={{ padding: 6, cursor: "pointer" }}
              onClick={() => setCustomerName(c.name || c)}
            >
              {c.name || c}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
