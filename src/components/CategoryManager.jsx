import { useState } from "react";

export default function CategoryManager({
  categories,
  setCategories,
}) {
  /* ================= STATE ================= */

  const [newName, setNewName] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");

  /* ================= ADD CATEGORY ================= */

  function addCategory() {
    if (!newName.trim()) return;

    const exists = categories.some(
      (c) =>
        c.name.toLowerCase() === newName.toLowerCase()
    );

    if (exists) {
      alert("Category already exists");
      return;
    }

    const category = {
      id: Date.now().toString(),
      name: newName.trim(),
    };

    setCategories([...categories, category]);
    setNewName("");
  }

  /* ================= EDIT CATEGORY ================= */

  function startEdit(category) {
    setEditingId(category.id);
    setEditName(category.name);
  }

  function saveEdit(category) {
    if (!editName.trim()) return;

    const exists = categories.some(
      (c) =>
        c.name.toLowerCase() === editName.toLowerCase() &&
        c.id !== category.id
    );

    if (exists) {
      alert("Category name already exists");
      return;
    }

    setCategories(
      categories.map((c) =>
        c.id === category.id
          ? { ...c, name: editName.trim() }
          : c
      )
    );

    setEditingId(null);
    setEditName("");
  }

  function cancelEdit() {
    setEditingId(null);
    setEditName("");
  }

  /* ================= DELETE CATEGORY ================= */

  function removeCategory(category) {
    if (
      !window.confirm(
        `Delete category "${category.name}"?`
      )
    )
      return;

    setCategories(
      categories.filter((c) => c.id !== category.id)
    );
  }

  /* ================= UI ================= */

  return (
    <div style={card}>
      <h3 style={{ marginBottom: 16 }}>Categories</h3>

      {/* ADD NEW */}
      <div style={row}>
        <input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="New category name"
          style={input}
        />
        <button onClick={addCategory} style={addBtn}>
          Add
        </button>
      </div>

      {/* LIST */}
      {categories.length === 0 ? (
        <p style={{ marginTop: 20 }}>No categories added</p>
      ) : (
        categories.map((c) => (
          <div key={c.id} style={listItem}>
            {editingId === c.id ? (
              <div style={{ flex: 1 }}>
                <input
                  value={editName}
                  onChange={(e) =>
                    setEditName(e.target.value)
                  }
                  style={input}
                />
                <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                  <button
                    onClick={() => saveEdit(c)}
                    style={addBtn}
                  >
                    Save
                  </button>
                  <button
                    onClick={cancelEdit}
                    style={cancelBtn}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <strong>{c.name}</strong>
                <div style={{ display: "flex", gap: 8 }}>
                  <button
                    onClick={() => startEdit(c)}
                    style={editBtn}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => removeCategory(c)}
                    style={deleteBtn}
                  >
                    Delete
                  </button>
                </div>
              </>
            )}
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
  marginBottom: 20,
};

const listItem = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "10px 0",
  borderBottom: "1px solid #e5e7eb",
};

const input = {
  flex: 1,
  padding: 12,
  borderRadius: 10,
  border: "1px solid #d1d5db",
};

const addBtn = {
  padding: "12px 16px",
  borderRadius: 10,
  border: "none",
  background: "#2563eb",
  color: "#fff",
  fontWeight: 600,
};

const editBtn = {
  padding: "6px 12px",
  borderRadius: 8,
  border: "none",
  background: "#e0f2fe",
  color: "#0369a1",
  fontWeight: 600,
};

const cancelBtn = {
  padding: "6px 12px",
  borderRadius: 8,
  border: "none",
  background: "#e5e7eb",
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