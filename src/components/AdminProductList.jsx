import { useState } from "react";

export default function AdminProductList({
  products,
  categories,
  setProducts,
  onEdit,
}) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("az");

  function getCategoryName(id) {
    const cat = categories.find((c) => c.id === id);
    return cat ? cat.name : "Unknown";
  }

  const filteredProducts = products
    .filter((p) =>
      p.name.toLowerCase().includes(search.toLowerCase())
    )
    .filter((p) =>
      category ? p.categoryId === category : true
    )
    .sort((a, b) =>
      sort === "az"
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name)
    );

  return (
    <div>
      <h3>Product List</h3>

      {/* 🔍 CONTROLS */}
      <div
        style={{
          display: "flex",
          gap: 8,
          flexWrap: "wrap",
          marginBottom: 12,
        }}
      >
        <input
          placeholder="Search product..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
        >
          <option value="az">A – Z</option>
          <option value="za">Z – A</option>
        </select>
      </div>

      {filteredProducts.length === 0 && (
        <p style={{ color: "#6b7280" }}>
          No matching products
        </p>
      )}

      {filteredProducts.map((p) => (
        <div
          key={p.id}
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "8px 0",
            borderBottom: "1px solid #e5e7eb",
          }}
        >
          <div>
            <strong>{p.name}</strong>
            <div style={{ fontSize: 12, color: "#6b7280" }}>
              Category: {getCategoryName(p.categoryId)} | ₹{p.price}
            </div>
          </div>

          <div>
            <button onClick={() => onEdit(p)}>Edit</button>
            <button
              onClick={() => {
                if (window.confirm(`Delete "${p.name}"?`)) {
                  setProducts(
                    products.filter((x) => x.id !== p.id)
                  );
                }
              }}
              style={{ marginLeft: 6, color: "#ef4444" }}
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}