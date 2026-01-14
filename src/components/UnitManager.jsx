import { useState } from "react";

export default function UnitManager({
  units,
  setUnits,
  products = [], // 🔥 REQUIRED for safety check
}) {
  const [name, setName] = useState("");
  const [multiplier, setMultiplier] = useState("");

  // 🔒 check if unit is used in any product
  function isUnitUsed(unitName) {
    return products.some((p) =>
      p.units?.some((u) => u.name === unitName)
    );
  }

  function addUnit() {
    if (!name.trim() || !multiplier) return;

    const exists = units.some(
      (u) => u.name.toLowerCase() === name.trim().toLowerCase()
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

  function deleteUnit(unit) {
    if (isUnitUsed(unit.name)) {
      alert(
        `"${unit.name}" is used in products.\nRemove it from products first.`
      );
      return;
    }

    if (window.confirm(`Delete unit "${unit.name}"?`)) {
      setUnits(units.filter((u) => u.id !== unit.id));
    }
  }

  return (
    <div>
      <h3>Units</h3>

      {/* ADD UNIT */}
      <div
        style={{
          display: "flex",
          gap: 8,
          marginBottom: 14,
          flexWrap: "wrap",
        }}
      >
        <input
          placeholder="Unit name (Piece, Kg, Dozen)"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="number"
          min="1"
          placeholder="Multiplier"
          value={multiplier}
          onChange={(e) => setMultiplier(e.target.value)}
          style={{ width: 110 }}
        />

        <button onClick={addUnit}>Add</button>
      </div>

      {/* LIST */}
      {units.length === 0 && (
        <p style={{ color: "#6b7280" }}>No units created</p>
      )}

      {units.map((u) => {
        const used = isUnitUsed(u.name);

        return (
          <div key={u.id} style={row}>
            <span>
              {u.name} × {u.multiplier}
              {used && (
                <span
                  style={{
                    marginLeft: 6,
                    fontSize: 11,
                    color: "#dc2626",
                  }}
                >
                  (used)
                </span>
              )}
            </span>

            <button
              onClick={() => deleteUnit(u)}
              disabled={used}
              style={{
                color: used ? "#9ca3af" : "#ef4444",
                cursor: used ? "not-allowed" : "pointer",
                background: "none",
                border: "none",
              }}
            >
              Delete
            </button>
          </div>
        );
      })}
    </div>
  );
}

const row = {
  display: "flex",
  justifyContent: "space-between",
  padding: "8px 0",
  borderBottom: "1px solid #e5e7eb",
};