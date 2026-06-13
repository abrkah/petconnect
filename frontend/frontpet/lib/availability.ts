export const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;

export type AvailabilitySlot = {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
};

/** 30-minute slots from 06:00 through 22:00. */
export const AVAILABILITY_TIME_OPTIONS = (() => {
  const options: { value: string; label: string }[] = [];
  for (let hour = 6; hour <= 22; hour++) {
    for (const minute of [0, 30]) {
      if (hour === 22 && minute > 0) break;
      const value = `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
      options.push({ value, label: value });
    }
  }
  return options;
})();

export function formatAvailabilitySummary(
  slots: AvailabilitySlot[] | undefined | null,
  emptyLabel = "No availability set",
): string {
  if (!slots?.length) return emptyLabel;

  const sorted = [...slots].sort(
    (a, b) =>
      a.dayOfWeek - b.dayOfWeek || a.startTime.localeCompare(b.startTime),
  );

  return sorted
    .map((s) => {
      const day = DAY_LABELS[s.dayOfWeek] ?? `Day ${s.dayOfWeek}`;
      return `${day} ${s.startTime}–${s.endTime}`;
    })
    .join(" · ");
}

export function validateAvailabilitySlot(
  _rule: unknown,
  value: { startTime?: string; endTime?: string },
): Promise<void> {
  const start = value?.startTime;
  const end = value?.endTime;
  if (!start || !end) return Promise.resolve();
  if (end <= start) {
    return Promise.reject(new Error("End time must be after start time"));
  }
  return Promise.resolve();
}
