import { useState, useMemo } from "react";

export default function UnitManager({
  units,
  setUnits,
  products = [],
}) {
  const [name, setName] = useState("");
  const [multiplier, setMultiplier] = useState("");
  const [search, setSearch] = useState("");

  /* ================= SAFETY ================= */

  function isUnitUsed(unitName) {
    return products.some((p) =>
      p.units?.some((u) => u.name === unitName)
    );
  }

  /* ================= ADD ================= */

  function addUnit() {
    if (!name.trim() || !multiplier) return;

    const exists = units.some(
      (u) =>
        u.name.toLowerCase() ===
        name.trim().toLowerCase()
    );

    if (exists) {
      alert("Unit already exists");
      return;
    }

    setUnits([
      ...units,
      {
        id: Date.now(),
        name: name.trim(),
        multiplier: Number(multiplier),
      },
    ]);

    setName("");
    setMultiplier("");
  }

  /* ================= DELETE ================= */

  function deleteUnit(unit) {
    if (isUnitUsed(unit.name)) {
      alert(
        `"${unit.name}" is used in products.\nRemove it from products first.`
      );
      return;
    }

    if (window.confirm(`Delete "${unit.name}"?`)) {
      setUnits(units.filter((u) => u.id !== unit.id));
    }
  }

  /* ================= FILTER ================= */

  const filteredUnits = useMemo(() => {
    return units
      .filter((u) =>
        u.name
          .toLowerCase()
          .includes(search.toLowerCase())
      )
      .sort((a, b) =>
        a.name.localeCompare(b.name)
      );
  }, [units, search]);

  /* ================= UI ================= */

  return (
    <div style={card}>
      <h3 style={{ marginBottom: 16 }}>Units</h3>

      {/* ADD */}
      <div style={row}>
        <input
          placeholder="Unit name (Piece, Kg)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={input}
        />

        <input
          type="number"
          min="1"
          placeholder="Multiplier"
          value={multiplier}
          onChange={(e) =>
            setMultiplier(e.target.value)
          }
          style={{ ...input, width: 120 }}
        />

        <button onClick={addUnit} style={addBtn}>
          Add
        </button>
      </div>

      {/* SEARCH */}
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search units..."
        style={searchInput}
      />

      {/* LIST */}
      {filteredUnits.length === 0 ? (
        <div style={empty}>No units found</div>
      ) : (
        filteredUnits.map((u) => {
          const used = isUnitUsed(u.name);

          return (
            <div key={u.id} style={listItem}>
              <div>
                <strong>{u.name}</strong>{" "}
                <span style={{ fontSize: 13 }}>
                  × {u.multiplier}
                </span>

                {used && (
                  <span style={usedBadge}>
                    Used
                  </span>
                )}
              </div>

              <button
                onClick={() => deleteUnit(u)}
                disabled={used}
                style={{
                  ...deleteBtn,
                  opacity: used ? 0.4 : 1,
                  cursor: used
                    ? "not-allowed"
                    : "pointer",
                }}
              >
                Delete
              </button>
            </div>
          );
        })
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
  flexWrap: "wrap",
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
  background: "#fee2e2",
  color: "#b91c1c",
  border: "none",
  padding: "6px 12px",
  borderRadius: 8,
  fontWeight: 600,
};

const usedBadge = {
  marginLeft: 8,
  fontSize: 11,
  padding: "2px 6px",
  borderRadius: 999,
  background: "#fee2e2",
  color: "#b91c1c",
};

const empty = {
  textAlign: "center",
  padding: 20,
  color: "#6b7280",
};