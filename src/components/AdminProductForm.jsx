import { useEffect, useState } from "react";
import CategorySelect from "./CategorySelect";
import UnitSelector from "./UnitSelector";

/* ================= MAIN COMPONENT ================= */

export default function AdminProductForm({
  categories,
  setCategories,
  products,
  setProducts,
  editingProduct,
  setEditingProduct,
  units,
}) {
  /* ===== STATE ===== */

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [image, setImage] = useState(null);

  const [productUnits, setProductUnits] = useState([
    { name: "Piece", multiplier: 1 },
  ]);

  /* ===== LOAD EDITING PRODUCT ===== */

  useEffect(() => {
    if (!editingProduct) return;

    setName(editingProduct.name || "");
    setPrice(editingProduct.price || "");
    setCategoryId(editingProduct.categoryId || "");
    setImage(editingProduct.image || null);
    setProductUnits(
      editingProduct.units?.length
        ? editingProduct.units
        : [{ name: "Piece", multiplier: 1 }]
    );
  }, [editingProduct]);

  /* ===== HELPERS ===== */

  function resetForm() {
    setName("");
    setPrice("");
    setCategoryId("");
    setImage(null);
    setProductUnits([{ name: "Piece", multiplier: 1 }]);
    setEditingProduct(null);
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

  /* ===== UI ===== */

  return (
    <div style={card}>
      <h3>{editingProduct ? "Edit Product" : "Add New Product"}</h3>

      {/* BASIC INFO */}
      <Section title="Basic Information">
        <Input
          label="Product Name"
          value={name}
          onChange={setName}
          placeholder="Eg: Assam Grass Broom"
        />

        <CategorySelect
          categories={categories}
          categoryId={categoryId}
          setCategoryId={setCategoryId}
          setCategories={setCategories}
        />
      </Section>

      {/* PRICE & UNITS */}
      <Section title="Price & Units">
        <Input
          label="Base Price (₹)"
          type="number"
          value={price}
          onChange={setPrice}
          placeholder="Eg: 85"
        />

        <UnitSelector
          units={units}
          selectedUnits={productUnits}
          setSelectedUnits={setProductUnits}
        />
      </Section>

      {/* IMAGE */}
      <Section title="Product Image">
        <ImagePicker image={image} setImage={setImage} />
      </Section>

      {/* ACTIONS */}
      <button onClick={saveProduct} style={primaryBtn}>
        {editingProduct ? "Update Product" : "Save Product"}
      </button>

      {editingProduct && (
        <button onClick={resetForm} style={secondaryBtn}>
          Cancel Edit
        </button>
      )}
    </div>
  );
}

/* ================= SUB COMPONENTS ================= */

function Section({ title, children }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <div style={sectionTitle}>{title}</div>
      {children}
    </div>
  );
}

function Input({ label, value, onChange, ...props }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={labelStyle}>{label}</div>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        {...props}
        style={input}
      />
    </div>
  );
}

function ImagePicker({ image, setImage }) {
  const [fileName, setFileName] = useState("");

  function onPick(e) {
    const file = e.target.files[0];
    if (!file) return;

    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = () => setImage(reader.result);
    reader.readAsDataURL(file);
  }

  return (
    <div>
      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <div style={imageBox}>
          {image ? (
            <img src={image} style={imagePreview} />
          ) : (
            "📦"
          )}
        </div>

        <input type="file" accept="image/*" onChange={onPick} />
      </div>

      {fileName && (
        <div style={{ fontSize: 12, marginTop: 6, color: "#374151" }}>
          Selected: {fileName}
        </div>
      )}
    </div>
  );
}

/* ================= STYLES ================= */

const card = {
  background: "#fff",
  borderRadius: 16,
  padding: 16,
  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
  marginBottom: 20,
};

const sectionTitle = {
  fontSize: 14,
  fontWeight: 600,
  marginBottom: 8,
  color: "#374151",
};

const labelStyle = {
  fontSize: 13,
  marginBottom: 4,
};

const input = {
  width: "100%",
  padding: 12,
  fontSize: 16,
  borderRadius: 10,
  border: "1px solid #d1d5db",
};

const imageBox = {
  width: 80,
  height: 80,
  borderRadius: 12,
  background: "#f3f4f6",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  overflow: "hidden",
};

const imagePreview = {
  width: "100%",
  height: "100%",
  objectFit: "cover",
};

const primaryBtn = {
  width: "100%",
  padding: 14,
  background: "#2563eb",
  color: "#fff",
  border: "none",
  borderRadius: 12,
  fontSize: 16,
  fontWeight: 600,
};

const secondaryBtn = {
  width: "100%",
  padding: 12,
  marginTop: 8,
  background: "#e5e7eb",
  border: "none",
  borderRadius: 12,
};