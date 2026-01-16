
import { useState, useMemo } from "react";

export default function CustomerManager({
  customers,
  setCustomers,
}) {
  const [name, setName] = useState("");
  const [search, setSearch] = useState("");

  /* ================= ADD ================= */

  function addCustomer() {
    if (!name.trim()) return;

    const exists = customers.some(
      (c) =>
        c.name.toLowerCase() === name.toLowerCase()
    );

    if (exists) {
      alert("Customer already exists");
      return;
    }

    setCustomers([
      ...customers,
      {
        id: Date.now(),
        name: name.trim(),
      },
    ]);

    setName("");
  }

  /* ================= DELETE ================= */

  function removeCustomer(customer) {
    if (
      !window.confirm(
        `Delete customer "${customer.name}"?`
      )
    )
      return;

    setCustomers(
      customers.filter((c) => c.id !== customer.id)
    );
  }

  /* ================= FILTER ================= */

  const filteredCustomers = useMemo(() => {
    return customers
      .filter((c) =>
        c.name
          .toLowerCase()
          .includes(search.toLowerCase())
      )
      .sort((a, b) =>
        a.name.localeCompare(b.name)
      );
  }, [customers, search]);

  /* ================= UI ================= */

  return (
    <div style={card}>
      <h3 style={{ marginBottom: 16 }}>
        Customers
      </h3>

      {/* ADD */}
      <div style={row}>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Customer name"
          style={input}
        />
        <button onClick={addCustomer} style={addBtn}>
          Add
        </button>
      </div>

      {/* SEARCH */}
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search customers..."
        style={searchInput}
      />

      {/* LIST */}
      {filteredCustomers.length === 0 ? (
        <div style={empty}>
          No customers found
        </div>
      ) : (
        filteredCustomers.map((c) => (
          <div key={c.id} style={listItem}>
            <span style={{ fontWeight: 600 }}>
              {c.name}
            </span>
            <button
              onClick={() => removeCustomer(c)}
              style={deleteBtn}
            >
              Delete
            </button>
          </div>
        ))
      )}
    </div>
  );
}

/* ================= STYLES ================= */

const card = {
  background: "#fff",
  padding: 16,
  borderRadius: 14,
  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
};

const row = {
  display: "flex",
  gap: 8,
  marginBottom: 12,
};

const input = {
  flex: 1,
  padding: 12,
  borderRadius: 10,
  border: "1px solid #d1d5db",
};

const searchInput = {
  width: "100%",
  padding: 10,
  borderRadius: 10,
  border: "1px solid #d1d5db",
  marginBottom: 12,
};

const listItem = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "10px 0",
  borderBottom: "1px solid #e5e7eb",
};

const addBtn = {
  padding: "12px 16px",
  borderRadius: 10,
  border: "none",
  background: "#2563eb",
  color: "#fff",
  fontWeight: 600,
};

const deleteBtn = {
  padding: "6px 12px",
  borderRadius: 8,
  border: "none",
  background: "#fee2e2",
  color: "#b91c1c",
  fontWeight: 600,
};

const empty = {
  textAlign: "center",
  padding: 20,
  color: "#6b7280",
};