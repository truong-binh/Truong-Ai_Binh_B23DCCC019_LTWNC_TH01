export type DeadlineState = 'overdue' | 'today' | 'soon' | 'normal' | 'done';

export interface DeadlineInfo {
  diffDays: number; // âm = đã quá hạn
  label: string;
  state: DeadlineState;
  isOverdue: boolean;
}

const MS_PER_DAY = 86_400_000;

export function startOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function toISODate(date: Date): string {
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
}

export function addDays(days: number, from: Date = new Date()): string {
  const d = startOfDay(from);
  d.setDate(d.getDate() + days);
  return toISODate(d);
}

export function formatDisplayDate(iso: string): string {
  const [y, m, d] = iso.split('-');
  return y && m && d ? `${d}/${m}/${y}` : iso;
}

export function isValidISODate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00`);
  return !Number.isNaN(date.getTime()) && toISODate(date) === value;
}

export function diffInDays(dueDate: string, now: Date = new Date()): number {
  const due = startOfDay(new Date(`${dueDate}T00:00:00`));
  return Math.round((due.getTime() - startOfDay(now).getTime()) / MS_PER_DAY);
}

export function describeDeadline(
  dueDate: string,
  options: { completed?: boolean; now?: Date } = {}
): DeadlineInfo {
  const { completed = false, now = new Date() } = options;
  const diffDays = diffInDays(dueDate, now);

  if (completed) return { diffDays, label: 'Đã xong', state: 'done', isOverdue: false };

  if (diffDays < 0) {
    return {
      diffDays,
      label: `Quá hạn ${Math.abs(diffDays)} ngày`,
      state: 'overdue',
      isOverdue: true,
    };
  }
  if (diffDays === 0) return { diffDays, label: 'Hạn hôm nay', state: 'today', isOverdue: false };

  return {
    diffDays,
    label: `Còn ${diffDays} ngày`,
    state: diffDays <= 3 ? 'soon' : 'normal',
    isOverdue: false,
  };
}
