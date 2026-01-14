import { useState } from "react";

export default function CustomerManager({ customers, setCustomers }) {
  const [name, setName] = useState("");

  return (
    <div>
      <h3>Customers</h3>

      <div style={{ display: "flex", gap: 8 }}>
        <input
          placeholder="Customer name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button
          onClick={() => {
            if (!name.trim()) return;
            setCustomers([...customers, { id: Date.now(), name }]);
            setName("");
          }}
        >
          Add
        </button>
      </div>

      {customers.map((c) => (
        <div key={c.id} style={row}>
          <span>{c.name}</span>
          <button
            onClick={() =>
              setCustomers(customers.filter((x) => x.id !== c.id))
            }
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}

const row = {
  display: "flex",
  justifyContent: "space-between",
  padding: "8px 0",
  borderBottom: "1px solid #e5e7eb",
};