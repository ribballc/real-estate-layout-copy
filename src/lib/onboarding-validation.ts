// ── Title Case ──
export const toTitleCase = (v: string) =>
  v.replace(/\b\w/g, (c) => c.toUpperCase());

export const capitalizeFirst = (v: string) =>
  v.charAt(0).toUpperCase() + v.slice(1);

// ── Phone formatting ──
export const formatPhone = (value: string) => {
  const digits = value.replace(/\D/g, "").slice(0, 10);
  if (digits.length === 0) return "";
  if (digits.length <= 3) return `(${digits}`;
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
};

// ── Helpers ──
const isRepeating = (s: string) => /^(.)\1+$/.test(s);
const isRepeatingPattern = (s: string) => {
  const lower = s.toLowerCase().replace(/\s/g, "");
  if (lower.length < 3) return false;
  if (isRepeating(lower)) return true;
  // Check repeating 2-3 char patterns like "abcabc"
  for (let len = 1; len <= 3; len++) {
    const pat = lower.slice(0, len);
    if (pat.repeat(Math.ceil(lower.length / len)).slice(0, lower.length) === lower && lower.length > len)
      return true;
  }
  return false;
};

const hasLetter = (s: string) => /[a-zA-Z]/.test(s);
const onlySpecialOrSpaces = (s: string) => /^[\s\W]+$/.test(s);

// ── Step 1: Shop Name ──
export const validateShopName = (v: string): string | null => {
  const trimmed = v.trim();
  if (trimmed.length < 2) return "Shop name must be at least 2 characters";
  if (trimmed.length > 60) return "Shop name must be under 60 characters";
  if (!hasLetter(trimmed)) return "Please enter your real shop name";
  if (onlySpecialOrSpaces(trimmed)) return "Please enter your real shop name";
  if (isRepeatingPattern(trimmed.replace(/\s/g, ""))) return "Please enter your real shop name";
  return null;
};

// ── Step 2: First Name ──
export const validateFirstName = (v: string): string | null => {
  const trimmed = v.trim();
  if (trimmed.length < 2) return "Please enter your real first name";
  if (trimmed.length > 40) return "Name must be under 40 characters";
  if (!/^[a-zA-Z][a-zA-Z' -]*$/.test(trimmed)) return "Please enter your real first name";
  if (isRepeatingPattern(trimmed.replace(/[' -]/g, ""))) return "Please enter your real first name";
  return null;
};

// ── Step 3: Phone ──
const FAKE_PHONES = new Set([
  "5555555555", "0000000000", "1111111111", "2222222222",
  "3333333333", "4444444444", "6666666666", "7777777777",
  "8888888888", "9999999999", "1234567890", "9876543210",
  "0123456789",
]);

export const validatePhone = (v: string): string | null => {
  const digits = v.replace(/\D/g, "");
  if (digits.length !== 10) return "Please enter a valid 10-digit phone number";
  if (isRepeating(digits)) return "Please enter a valid 10-digit phone number";
  if (FAKE_PHONES.has(digits)) return "Please enter a valid 10-digit phone number";
  return null;
};

// ── Step 4: Location ──
export const validateLocation = (v: string): string | null => {
  const trimmed = v.trim();
  if (trimmed.length < 3) return "Please enter the city or area you serve";
  if (!hasLetter(trimmed)) return "Please enter the city or area you serve";
  if (/^[\d\s\W]+$/.test(trimmed)) return "Please enter the city or area you serve";
  return null;
};
