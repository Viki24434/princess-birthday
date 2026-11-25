// Hanya mengganti placeholder yang dikenal; nilai JSON lain tetap utuh.
export function formatContent(value, variables) {
  if (typeof value === "string") {
    return value.replace(/\{([A-Za-z]+)\}/g, (placeholder, key) =>
      Object.hasOwn(variables, key) ? String(variables[key]) : placeholder);
  }
  if (Array.isArray(value)) return value.map(item => formatContent(item, variables));
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([key, item]) =>
      [key, formatContent(item, variables)]));
  }
  return value;
}

// Path public mengikuti subfolder deployment; URL internet tidak diberi awalan base.
export function resolveAssetUrl(value, base = import.meta.env?.BASE_URL || "./") {
  if (typeof value !== "string" || !value.trim()) return "";
  const path = value.trim();
  if (/^https?:\/\//i.test(path)) {
    try { return new URL(path).href; } catch { return ""; }
  }
  if (/^[a-z][a-z\d+.-]*:/i.test(path) || path.startsWith("//")) return "";
  return `${base.replace(/\/?$/, "/")}${path.replace(/^\/+/, "")}`;
}
