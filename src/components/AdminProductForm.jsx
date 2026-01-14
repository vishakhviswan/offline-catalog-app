import { useEffect, useState } from "react";

export default function AdminProductForm({
  categories,
  setCategories,
  products,
  setProducts,
  editingProduct,
  setEditingProduct,
  units,          // master units
  setUnits,       // 🔥 IMPORTANT
}) {
  /* ================= STATE ================= */

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [image, setImage] = useState(null);

  const [productUnits, setProductUnits] = useState([
    { name: "Piece", multiplier: 1 },
  ]);

  const [newCategory, setNewCategory] = useState("");
  const [showCategoryInput, setShowCategoryInput] = useState(false);

  const [newUnitName, setNewUnitName] = useState("");
  const [newUnitMultiplier, setNewUnitMultiplier] = useState("");
  const [showUnitInput, setShowUnitInput] = useState(false);

  const [imageKey, setImageKey] = useState(Date.now());

  /* ================= EDIT MODE ================= */

  useEffect(() => {
    if (editingProduct) {
      setName(editingProduct.name);
      setPrice(editingProduct.price);
      setCategoryId(editingProduct.categoryId);
      setImage(editingProduct.image || null);
      setProductUnits(editingProduct.units || []);
      setImageKey(Date.now());
    }
  }, [editingProduct]);

  /* ================= HELPERS ================= */

  function handleImage(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => setImage(reader.result);
    reader.readAsDataURL(file);
  }

  function addUnitToProduct(unit) {
    if (productUnits.find((u) => u.name === unit.name)) return;
    setProductUnits([...productUnits, unit]);
  }

  function resetForm() {
    setName("");
    setPrice("");
    setCategoryId("");
    setImage(null);
    setProductUnits([{ name: "Piece", multiplier: 1 }]);
    setEditingProduct(null);
    setImageKey(Date.now());
  }

  function saveProduct() {
    if (!name.trim() || !price || !categoryId) {
      alert("Fill all required fields");
      return;
    }

    const duplicate = products.find(
      (p) =>
        p.name.toLowerCase() === name.toLowerCase() &&
        p.id !== editingProduct?.id
    );
    if (duplicate) {
      alert("Product name already exists");
      return;
    }

    const product = {
      id: editingProduct?.id || Date.now(),
      name: name.trim(),
      price: Number(price),
      categoryId,
      image,
      units: productUnits,
    };

    if (editingProduct) {
      setProducts(products.map((p) => (p.id === product.id ? product : p)));
    } else {
      setProducts([...products, product]);
    }

    resetForm();
  }

  /* ================= UI ================= */

  return (
    <div style={card}>
      <h3>{editingProduct ? "Edit Product" : "Add New Product"}</h3>

      {/* NAME */}
      <label>Name *</label>
      <input value={name} onChange={(e) => setName(e.target.value)} />

      {/* PRICE */}
      <label>Base Price *</label>
      <input
        type="number"
        min="0"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />

      {/* CATEGORY */}
      <label>Category *</label>
      <select
        value={categoryId}
        onChange={(e) => setCategoryId(e.target.value)}
      >
        <option value="">Select category</option>
        {categories.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>

      {!showCategoryInput ? (
        <button style={linkBtn} onClick={() => setShowCategoryInput(true)}>
          + Add new category
        </button>
      ) : (
        <div style={row}>
          <input
            placeholder="New category name"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
          />
          <button
            onClick={() => {
              if (!newCategory.trim()) return;
              const newCat = { id: Date.now().toString(), name: newCategory.trim() };
              setCategories([...categories, newCat]);
              setCategoryId(newCat.id);
              setNewCategory("");
              setShowCategoryInput(false);
            }}
          >
            Add
          </button>
        </div>
      )}

      {/* IMAGE */}
      <label>Product Image</label>
      <input
        key={imageKey}
        type="file"
        accept="image/*"
        onChange={handleImage}
      />

      {image && (
        <img src={image} alt="preview" style={{ width: 120, marginTop: 8 }} />
      )}

      {/* UNITS */}
      <label>Units</label>

      {productUnits.map((u, i) => (
        <div key={i} style={{ ...chip, display: "inline-flex", gap: 6 }}>
          <span>{u.name} × {u.multiplier}</span>
          {i !== 0 && (
            <button
              onClick={() =>
                setProductUnits(productUnits.filter((_, x) => x !== i))
              }
              style={removeBtn}
            >
              ×
            </button>
          )}
        </div>
      ))}

      <select
        onChange={(e) => {
          const u = units.find((x) => x.name === e.target.value);
          if (u) addUnitToProduct(u);
        }}
      >
        <option value="">Add existing unit</option>
        {units.map((u, i) => (
          <option key={i} value={u.name}>
            {u.name}
          </option>
        ))}
      </select>

      {!showUnitInput ? (
        <button style={linkBtn} onClick={() => setShowUnitInput(true)}>
          + Create new unit
        </button>
      ) : (
        <div style={row}>
          <input
            placeholder="Unit name"
            value={newUnitName}
            onChange={(e) => setNewUnitName(e.target.value)}
          />
          <input
            type="number"
            min="1"
            placeholder="Multiplier"
            value={newUnitMultiplier}
            onChange={(e) => setNewUnitMultiplier(e.target.value)}
          />
          <button
            onClick={() => {
              if (!newUnitName || !newUnitMultiplier) return;
              const u = {
                name: newUnitName.trim(),
                multiplier: Number(newUnitMultiplier),
              };
              setUnits([...units, u]);      // 🔥 SAFE
              addUnitToProduct(u);
              setNewUnitName("");
              setNewUnitMultiplier("");
              setShowUnitInput(false);
            }}
          >
            Add
          </button>
        </div>
      )}

      {/* SAVE */}
      <button style={saveBtn} onClick={saveProduct}>
        {editingProduct ? "Update Product" : "Save Product"}
      </button>
    </div>
  );
}

/* ================= STYLES ================= */

const card = {
  background: "#fff",
  padding: 16,
  borderRadius: 14,
  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
  marginBottom: 20,
  display: "flex",
  flexDirection: "column",
  gap: 8,
};

const row = { display: "flex", gap: 8 };

const chip = {
  padding: "4px 8px",
  background: "#e5e7eb",
  borderRadius: 999,
  fontSize: 12,
  marginRight: 6,
};

const removeBtn = {
  border: "none",
  background: "transparent",
  color: "#ef4444",
  fontWeight: 700,
  cursor: "pointer",
};

const linkBtn = {
  background: "none",
  border: "none",
  color: "#2563eb",
  fontSize: 13,
  padding: 0,
};

const saveBtn = {
  marginTop: 10,
  padding: 12,
  background: "#2563eb",
  color: "#fff",
  border: "none",
  borderRadius: 10,
  fontWeight: 600,
};