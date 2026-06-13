import dayjs from "dayjs";

/** Date pill shown between message groups in chat. */
export function formatChatDateDivider(iso: string | Date): string {
  const d = dayjs(iso);
  if (!d.isValid()) return "";

  const today = dayjs().startOf("day");
  const msgDay = d.startOf("day");
  const dayDiff = msgDay.diff(today, "day");

  if (dayDiff === 0) return "Today";
  if (dayDiff === -1) return "Yesterday";
  if (dayDiff === 1) return "Tomorrow";
  if (d.year() === today.year()) return d.format("MMMM D");
  return d.format("MMMM D, YYYY");
}

/** Compact timestamp in the conversation list. */
export function formatChatListTime(iso: string | Date): string {
  const d = dayjs(iso);
  if (!d.isValid()) return "";

  const today = dayjs().startOf("day");
  const msgDay = d.startOf("day");
  const dayDiff = msgDay.diff(today, "day");

  if (dayDiff === 0) return d.format("h:mm A");
  if (dayDiff === -1) return "Yesterday";
  if (dayDiff > -7 && dayDiff < 0) return d.format("ddd");
  if (d.year() === today.year()) return d.format("D MMM");
  return d.format("D MMM YYYY");
}
