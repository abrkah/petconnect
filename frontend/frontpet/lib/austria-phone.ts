export const AT_PHONE_PREFIX = "+43";

/** Strip +43 / leading 0 and non-digits for the editable local part. */
export function toAustriaLocalPart(phone?: string | null): string {
  if (!phone?.trim()) return "";
  let digits = phone.replace(/\D/g, "");
  if (digits.startsWith("43")) digits = digits.slice(2);
  if (digits.startsWith("0")) digits = digits.slice(1);
  return digits.slice(0, 12);
}

/** Build full Austrian E.164 value from local digits. Empty input → empty string. */
export function toAustriaFullPhone(local?: string | null): string {
  const digits = (local ?? "").replace(/\D/g, "");
  if (!digits) return "";
  return `${AT_PHONE_PREFIX}${digits}`;
}

export function isValidAustriaLocalPart(local?: string | null): boolean {
  const digits = (local ?? "").replace(/\D/g, "");
  return digits.length >= 4 && digits.length <= 12;
}

export function validateAustriaPhoneRule(
  _rule: unknown,
  value?: string,
): Promise<void> {
  if (!value?.trim()) return Promise.resolve();
  if (isValidAustriaLocalPart(toAustriaLocalPart(value))) {
    return Promise.resolve();
  }
  return Promise.reject(
    new Error("Enter a valid Austrian number after +43"),
  );
}

export function validateRequiredAustriaPhoneRule(
  _rule: unknown,
  value?: string,
): Promise<void> {
  if (!value?.trim() || !isValidAustriaLocalPart(toAustriaLocalPart(value))) {
    return Promise.reject(new Error("Enter a valid Austrian phone number"));
  }
  return Promise.resolve();
}
