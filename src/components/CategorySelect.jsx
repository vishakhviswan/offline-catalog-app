import { useState } from "react";

export default function CategorySelect({
  categories,
  categoryId,
  setCategoryId,
  setCategories,
}) {
  const [newCategory, setNewCategory] = useState("");
  const [showInput, setShowInput] = useState(false);

  function addCategory() {
    if (!newCategory.trim()) return;

    const exists = categories.some(
      (c) =>
        c.name.toLowerCase() === newCategory.toLowerCase()
    );
    if (exists) {
      alert("Category already exists");
      return;
    }

    const category = {
      id: Date.now().toString(),
      name: newCategory.trim(),
    };

    setCategories([...categories, category]);
    setCategoryId(category.id);
    setNewCategory("");
    setShowInput(false);
  }

  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ fontSize: 13, marginBottom: 4 }}>
        Category
      </div>

      <select
        value={categoryId}
        onChange={(e) => setCategoryId(e.target.value)}
        style={{
          width: "100%",
          padding: 12,
          borderRadius: 10,
          border: "1px solid #d1d5db",
        }}
      >
        <option value="">Select category</option>
        {categories.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>

      {!showInput ? (
        <button
          type="button"
          onClick={() => setShowInput(true)}
          style={linkBtn}
        >
          + Add new category
        </button>
      ) : (
        <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
          <input
            placeholder="Category name"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            style={input}
          />
          <button onClick={addCategory} style={smallBtn}>
            Add
          </button>
        </div>
      )}
    </div>
  );
}

const input = {
  flex: 1,
  padding: 10,
  borderRadius: 8,
  border: "1px solid #d1d5db",
};

const smallBtn = {
  padding: "10px 14px",
  borderRadius: 8,
  border: "none",
  background: "#2563eb",
  color: "#fff",
  fontWeight: 600,
};

const linkBtn = {
  background: "none",
  border: "none",
  color: "#2563eb",
  fontSize: 13,
  marginTop: 6,
  padding: 0,
};