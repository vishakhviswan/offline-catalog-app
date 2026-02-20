const VALID_LAYOUTS = new Set(["grid", "compact"]);

export function parseBooleanParam(value, fallback = false) {
  if (value === null) return fallback;
  return value === "1" || value === "true";
}

export function parseLayoutMode(value) {
  if (!value) return "grid";
  return VALID_LAYOUTS.has(value) ? value : "grid";
}

export function updateFilterParams(prevParams, key, value, defaultValue = "") {
  const next = new URLSearchParams(prevParams);
  const normalized =
    typeof value === "boolean" ? String(value) : String(value ?? "").trim();
  const normalizedDefault =
    typeof defaultValue === "boolean"
      ? String(defaultValue)
      : String(defaultValue ?? "").trim();

  if (!normalized || normalized === normalizedDefault) {
    next.delete(key);
  } else {
    next.set(key, normalized);
  }

  return next;
}
