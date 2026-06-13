/** Normalize Austrian phone numbers to +43XXXXXXXX format. */
export function normalizeAustriaPhone(raw?: string | null): string | null {
  const trimmed = raw?.trim();
  if (!trimmed) return null;

  let digits = trimmed.replace(/\D/g, '');
  if (!digits) return null;

  if (digits.startsWith('43')) digits = digits.slice(2);
  if (digits.startsWith('0')) digits = digits.slice(1);
  if (digits.length < 4) return null;

  return `+43${digits}`;
}
