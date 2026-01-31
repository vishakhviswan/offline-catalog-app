export default function CategorySelectModal({
  open,
  onClose,
  categories = [],
  selected,
  onSelect,
}) {
  if (!open) return null;

  return (
    <div style={overlay} onClick={onClose}>
      <div style={sheet} onClick={(e) => e.stopPropagation()}>
        {/* HEADER */}
        <div style={header}>
          <h3 style={{ margin: 0 }}>All Categories</h3>
          <button onClick={onClose} style={closeBtn}>
            ✕
          </button>
        </div>

        {/* LIST */}
        <div style={list}>
          <CategoryItem
            active={selected === "all"}
            onClick={() => onSelect("all")}
          >
            🌈 All
          </CategoryItem>

          {categories.map((c) => (
            <CategoryItem
              key={c.id}
              active={selected === c.id}
              onClick={() => onSelect(c.id)}
            >
              {c.name}
            </CategoryItem>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ================= ITEM ================= */

function CategoryItem({ active, children, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: "100%",
        padding: "14px 12px",
        textAlign: "left",
        border: "none",
        background: active ? "#eef2ff" : "#fff",
        fontWeight: active ? 700 : 500,
        fontSize: 15,
        borderBottom: "1px solid #e5e7eb",
        cursor: "pointer",
      }}
    >
      {children}
    </button>
  );
}

/* ================= STYLES ================= */

const overlay = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.4)",
  zIndex: 50,
};

const sheet = {
  position: "absolute",
  bottom: 0,
  left: 0,
  right: 0,
  background: "#fff",
  borderTopLeftRadius: 16,
  borderTopRightRadius: 16,
  maxHeight: "80vh",
  display: "flex",
  flexDirection: "column",
};

const header = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: 16,
  borderBottom: "1px solid #e5e7eb",
};

const list = {
  overflowY: "auto",
};

const closeBtn = {
  border: "none",
  background: "transparent",
  fontSize: 18,
  cursor: "pointer",
};
