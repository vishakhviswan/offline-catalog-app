import { useState } from "react";

export default function CustomerSelect({
  customers,
  setCustomers,
  customerName,
  setCustomerName,
}) {
  const [newCustomer, setNewCustomer] = useState("");

  function addCustomer() {
    if (!newCustomer.trim()) return;

    const exists = customers.some(
      (c) =>
        c.name.toLowerCase() === newCustomer.trim().toLowerCase()
    );

    if (exists) {
      alert("Customer already exists");
      return;
    }

    const customer = {
      id: Date.now(),
      name: newCustomer.trim(),
    };

    setCustomers([...customers, customer]);
    setCustomerName(customer.name);
    setNewCustomer("");
  }

  return (
    <div style={{ marginTop: 10 }}>
      <div style={{ fontSize: 12, fontWeight: 600 }}>Customer</div>

      <select
        value={customerName}
        onChange={(e) => setCustomerName(e.target.value)}
        style={{
          width: "100%",
          padding: 10,
          borderRadius: 8,
          border: "1px solid #d1d5db",
          marginTop: 6,
        }}
      >
        <option value="">Select customer</option>
        {customers.map((c) => (
          <option key={c.id} value={c.name}>
            {c.name}
          </option>
        ))}
      </select>

      <div style={{ display: "flex", gap: 6, marginTop: 6 }}>
        <input
          placeholder="New customer name"
          value={newCustomer}
          onChange={(e) => setNewCustomer(e.target.value)}
          style={{
            flex: 1,
            padding: 8,
            borderRadius: 8,
            border: "1px solid #d1d5db",
          }}
        />
        <button
          onClick={addCustomer}
          style={{
            padding: "8px 12px",
            background: "#2563eb",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            fontWeight: 600,
          }}
        >
          Add
        </button>
      </div>
    </div>
  );
}