import { useState } from "react";

export default function UnitSelector({
  units,
  selectedUnits,
  setSelectedUnits,
}) {
  const [selectedName, setSelectedName] = useState("");

  function addUnit() {
    if (!selectedName) return;

    const unit = units.find((u) => u.name === selectedName);
    if (!unit) return;

    if (selectedUnits.some((u) => u.name === unit.name)) return;

    setSelectedUnits([...selectedUnits, unit]);
    setSelectedName("");
  }

  function removeUnit(name) {
    setSelectedUnits(
      selectedUnits.filter((u) => u.name !== name)
    );
  }

  return (
    <div>
      <div style={{ fontSize: 13, marginBottom: 6 }}>
        Units
      </div>

      <div style={{ display: "flex", gap: 8 }}>
        <select
          value={selectedName}
          onChange={(e) => setSelectedName(e.target.value)}
          style={select}
        >
          <option value="">Select unit</option>
          {units.map((u) => (
            <option key={u.name} value={u.name}>
              {u.name} × {u.multiplier}
            </option>
          ))}
        </select>

        <button onClick={addUnit} style={addBtn}>
          Add
        </button>
      </div>

      {/* SELECTED UNITS */}
      <div style={{ marginTop: 8 }}>
        {selectedUnits.map((u) => (
          <span key={u.name} style={chip}>
            {u.name} × {u.multiplier}
            {selectedUnits.length > 1 && (
              <button
                onClick={() => removeUnit(u.name)}
                style={removeBtn}
              >
                ×
              </button>
            )}
          </span>
        ))}
      </div>
    </div>
  );
}

const select = {
  flex: 1,
  padding: 10,
  borderRadius: 8,
  border: "1px solid #d1d5db",
};

const addBtn = {
  padding: "10px 14px",
  borderRadius: 8,
  border: "none",
  background: "#2563eb",
  color: "#fff",
  fontWeight: 600,
};

const chip = {
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
  padding: "6px 10px",
  background: "#e5e7eb",
  borderRadius: 999,
  fontSize: 12,
  marginRight: 6,
  marginBottom: 6,
};

const removeBtn = {
  border: "none",
  background: "transparent",
  fontWeight: 700,
  cursor: "pointer",
};