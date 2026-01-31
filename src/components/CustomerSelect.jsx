import { useState, useEffect } from "react";

const API_BASE = "https://offline-catalog-backend-production.up.railway.app";

export default function CustomerSelect({
  customers = [],
  setCustomers,
  customerName,
  setCustomerName,
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [newName, setNewName] = useState("");
  const [newMobile, setNewMobile] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      setSearch("");
      setNewName("");
      setNewMobile("");
    }
  }, [open]);

  const filtered = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.mobile?.includes(search),
  );

  async function addCustomer() {
    if (!newName.trim()) return;

    try {
      setLoading(true);

      const res = await fetch(`${API_BASE}/api/customers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newName.trim(),
          mobile: newMobile.trim() || null,
        }),
      });

      if (!res.ok) {
        throw new Error("API failed");
      }

      const savedCustomer = await res.json();

      setCustomers([savedCustomer, ...customers]);
      setCustomerName(savedCustomer.name);
      setOpen(false);
    } catch (err) {
      alert("Failed to add customer");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button style={btn} onClick={() => setOpen(true)}>
        👤 {customerName || "Select Customer"}
      </button>

      {open && (
        <div style={overlay} onClick={() => setOpen(false)}>
          <div style={modal} onClick={(e) => e.stopPropagation()}>
            <h3>Select Customer</h3>

            <input
              placeholder="Search customer…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={input}
            />

            <div style={list}>
              {filtered.map((c) => (
                <div
                  key={c.id}
                  style={item}
                  onClick={() => {
                    setCustomerName(c.name);
                    setOpen(false);
                  }}
                >
                  <strong>{c.name}</strong>
                  {c.mobile && <div style={small}>{c.mobile}</div>}
                </div>
              ))}
              {filtered.length === 0 && <div style={empty}>No customers</div>}
            </div>

            <hr />

            <h4>Add New Customer</h4>

            <input
              placeholder="Customer name *"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              style={input}
            />

            <input
              placeholder="Mobile (optional)"
              value={newMobile}
              onChange={(e) => setNewMobile(e.target.value)}
              style={input}
            />

            <button style={addBtn} onClick={addCustomer} disabled={loading}>
              {loading ? "Saving..." : "➕ Add & Select"}
            </button>
          </div>
        </div>
      )}
    </>
  );
}

/* ================= STYLES ================= */

const btn = {
  width: "100%",
  padding: "10px 12px",
  borderRadius: 12,
  border: "1px solid #d1d5db",
  background: "#f9fafb",
  fontWeight: 700,
  cursor: "pointer",
};

const overlay = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.4)",
  zIndex: 100,
};

const modal = {
  position: "absolute",
  bottom: 0,
  left: 0,
  right: 0,
  background: "#fff",
  borderTopLeftRadius: 16,
  borderTopRightRadius: 16,
  padding: 16,
  maxHeight: "85vh",
  overflowY: "auto",
};

const input = {
  width: "100%",
  padding: "10px 12px",
  borderRadius: 10,
  border: "1px solid #d1d5db",
  marginBottom: 8,
};

const list = {
  maxHeight: 220,
  overflowY: "auto",
};

const item = {
  padding: "10px 8px",
  borderBottom: "1px solid #f3f4f6",
  cursor: "pointer",
};

const small = {
  fontSize: 12,
  color: "#6b7280",
};

const empty = {
  padding: 12,
  textAlign: "center",
  color: "#6b7280",
};

const addBtn = {
  marginTop: 10,
  width: "100%",
  padding: 12,
  borderRadius: 12,
  border: "none",
  background: "#2563eb",
  color: "#fff",
  fontWeight: 700,
};
