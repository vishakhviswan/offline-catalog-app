import { useState } from "react";

export default function AdminProductList({
  products,
  categories,
  setProducts,
  onEdit,
}) {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  function getCategoryName(id) {
    return categories.find((c) => c.id === id)?.name || "—";
  }

  function deleteProduct(id) {
    if (!window.confirm("Delete this product?")) return;
    setProducts(products.filter((p) => p.id !== id));
  }

  const filtered = products.filter((p) => {
    const matchName = p.name
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchCategory = categoryFilter
      ? p.categoryId === categoryFilter
      : true;

    return matchName && matchCategory;
  });

  return (
    <div>
      <h3 style={{ marginBottom: 12 }}>Product List</h3>

      {/* FILTERS */}
      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        <input
          placeholder="Search product..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={input}
        />

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          style={select}
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* LIST */}
      {filtered.length === 0 ? (
        <p>No products found</p>
      ) : (
        filtered.map((p) => (
          <div key={p.id} style={row}>
            {/* IMAGE */}
            <div style={imageBox}>
              {p.image ? (
                <img
                  src={p.image}
                  alt={p.name}
                  style={img}
                />
              ) : (
                <span style={{ fontSize: 22 }}>📦</span>
              )}
            </div>

            {/* INFO */}
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600 }}>
                {p.name}
              </div>
              <div style={sub}>
                {getCategoryName(p.categoryId)} · ₹{p.price}
              </div>
            </div>

            {/* ACTIONS */}
            <div style={{ display: "flex", gap: 6 }}>
              <button
                onClick={() => onEdit(p)}
                style={editBtn}
              >
                Edit
              </button>
              <button
                onClick={() => deleteProduct(p.id)}
                style={deleteBtn}
              >
                Delete
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

/* ================= STYLES ================= */

const input = {
  flex: 1,
  padding: 10,
  borderRadius: 10,
  border: "1px solid #d1d5db",
};

const select = {
  padding: 10,
  borderRadius: 10,
  border: "1px solid #d1d5db",
};

const row = {
  display: "flex",
  alignItems: "center",
  gap: 12,
  padding: "10px 0",
  borderBottom: "1px solid #e5e7eb",
};

const imageBox = {
  width: 48,
  height: 48,
  borderRadius: 8,
  background: "#f3f4f6",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  overflow: "hidden",
};

const img = {
  width: "100%",
  height: "100%",
  objectFit: "cover",
};

const sub = {
  fontSize: 12,
  color: "#6b7280",
};

const editBtn = {
  padding: "6px 10px",
  borderRadius: 8,
  border: "none",
  background: "#e5e7eb",
  fontWeight: 600,
};

const deleteBtn = {
  padding: "6px 10px",
  borderRadius: 8,
  border: "none",
  background: "#fee2e2",
  color: "#b91c1c",
  fontWeight: 600,
};