export type AvailabilitySlotLike = {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
};

const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function availabilitySlotsOverlap(
  a: AvailabilitySlotLike,
  b: AvailabilitySlotLike,
): boolean {
  if (a.dayOfWeek !== b.dayOfWeek) return false;
  return a.startTime < b.endTime && b.startTime < a.endTime;
}

export function findAvailabilityOverlap(
  slots: AvailabilitySlotLike[],
): { indexA: number; indexB: number } | null {
  for (let i = 0; i < slots.length; i++) {
    for (let j = i + 1; j < slots.length; j++) {
      if (availabilitySlotsOverlap(slots[i], slots[j])) {
        return { indexA: i, indexB: j };
      }
    }
  }
  return null;
}

export function getAvailabilityOverlapMessage(
  slots: AvailabilitySlotLike[],
): string | null {
  for (const slot of slots) {
    if (slot.endTime <= slot.startTime) {
      const day = DAY_LABELS[slot.dayOfWeek] ?? `Day ${slot.dayOfWeek}`;
      return `${day}: end time must be after start time.`;
    }
  }

  const pair = findAvailabilityOverlap(slots);
  if (!pair) return null;

  const a = slots[pair.indexA];
  const b = slots[pair.indexB];
  const day = DAY_LABELS[a.dayOfWeek] ?? `Day ${a.dayOfWeek}`;
  const exact =
    a.startTime === b.startTime && a.endTime === b.endTime;

  if (exact) {
    return `You already added ${day} ${a.startTime}–${a.endTime}. Remove the duplicate window.`;
  }

  return `${day} ${a.startTime}–${a.endTime} overlaps with ${day} ${b.startTime}–${b.endTime}.`;
}
