export function timeRemaining(ts: number | null): {
  label: string;
  urgent: boolean;
  overdue: boolean;
} | null {
  if (!ts) return null;
  const diff = ts - Date.now();
  const overdue = diff < 0;
  const abs = Math.abs(diff);
  const days = Math.floor(abs / 86_400_000);
  const hours = Math.floor((abs % 86_400_000) / 3_600_000);

  let label: string;
  if (overdue) {
    label = days >= 1 ? `${days}d overdue` : `${hours}h overdue`;
  } else if (days >= 1) {
    label = `${days}d left`;
  } else {
    label = `${hours}h left`;
  }
  return { label, urgent: !overdue && days <= 2, overdue };
}
