export function generateTimeSlots(
  startHour: number,
  endHour: number,
  stepMinutes: number,
): string[] {
  const slots: string[] = [];
  const startTotalMinutes = startHour * 60;
  const endTotalMinutes = endHour * 60;

  for (
    let minutes = startTotalMinutes;
    minutes <= endTotalMinutes;
    minutes += stepMinutes
  ) {
    const hour24 = Math.floor(minutes / 60);
    const minute = minutes % 60;
    const period = hour24 >= 12 ? "PM" : "AM";
    const hour12 = hour24 % 12 === 0 ? 12 : hour24 % 12;
    slots.push(`${hour12}:${minute.toString().padStart(2, "0")} ${period}`);
  }

  return slots;
}
