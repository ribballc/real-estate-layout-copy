/** Clean domain base: lowercase, letters/numbers only, short (clean, memorable, typically available). */
const DOMAIN_BASE_MAX = 20;
function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "")
    .slice(0, DOMAIN_BASE_MAX);
}

/** Default 3 options when no business name or as fallback. */
const DEFAULT_SUGGESTIONS: [string, string, string] = ["mybusiness.com", "getmybusiness.com", "bookmybusiness.com"];

/**
 * Top 3 clean domain suggestions. Uses business name when available; otherwise returns default three.
 */
export function getDomainSuggestions(businessName: string): string[] {
  const name = typeof businessName === "string" ? businessName.trim() : "";
  if (!name) return [...DEFAULT_SUGGESTIONS];
  const base = slugify(name);
  if (!base) return [...DEFAULT_SUGGESTIONS];
  const a = `${base}.com`;
  const b = `get${base}.com`;
  const c = `book${base}.com`;
  const out = [a];
  if (b !== a) out.push(b);
  if (c !== a && c !== b) out.push(c);
  while (out.length < 3) {
    out.push(DEFAULT_SUGGESTIONS[out.length]);
  }
  return out.slice(0, 3);
}
