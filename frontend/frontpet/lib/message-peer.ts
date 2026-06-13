/** Resolve a chat peer label from profile name or a short fallback. */
export function peerDisplayName(
  userId: string,
  displayName?: string | null,
): string {
  const name = displayName?.trim();
  if (name) return name;
  return `User ${userId.slice(0, 8)}`;
}

export function peerInitial(
  displayName?: string | null,
  userId?: string,
): string {
  const name = displayName?.trim();
  if (name) return name.charAt(0).toUpperCase();
  if (!userId) return "U";
  const hex = userId.replace(/-/g, "");
  const n = parseInt(hex.slice(0, 8), 16);
  if (Number.isNaN(n)) return "U";
  return String.fromCharCode(65 + (n % 26));
}

export function peerHue(userId: string) {
  let h = 0;
  for (let i = 0; i < userId.length; i++) {
    h = (h + userId.charCodeAt(i) * (i + 1)) % 360;
  }
  return h;
}

export function mergePeerNames(
  prev: Record<string, string>,
  entries: { userId: string; displayName?: string | null }[],
): Record<string, string> {
  const next = { ...prev };
  for (const entry of entries) {
    const name = entry.displayName?.trim();
    if (name) next[entry.userId] = name;
  }
  return next;
}
