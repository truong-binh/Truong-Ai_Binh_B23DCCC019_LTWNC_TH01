export const PRIORITIES = ['low', 'medium', 'high'] as const;
export type Priority = (typeof PRIORITIES)[number];

export const FILTERS = ['all', 'pending', 'overdue', 'done'] as const;
export type FilterStatus = (typeof FILTERS)[number];

export interface Assignment {
  id: string;
  subject: string;
  title: string;
  dueDate: string; // YYYY-MM-DD
  priority: Priority;
  completed: boolean;
  createdAt: string;
}

export type RequestStatus = 'idle' | 'loading' | 'succeeded' | 'failed';

export interface AsyncState<T> {
  data: T;
  status: RequestStatus;
  error: string | null;
}

export type NewAssignmentInput = Omit<Assignment, 'id' | 'completed' | 'createdAt'>;
export type AssignmentPatch = Partial<Omit<Assignment, 'id' | 'createdAt'>>;
export type AssignmentPreview = Pick<Assignment, 'id' | 'title' | 'dueDate'>;

/** state của form: input luôn trả về string */
export type AssignmentFormValues = Record<keyof NewAssignmentInput, string>;
export type FormErrors<T> = { [K in keyof T]?: string };

export interface PriorityMeta {
  label: string;
  color: string;
  weight: number;
}

export const PRIORITY_META: Record<Priority, PriorityMeta> = {
  high: { label: 'Cao', color: '#e11d48', weight: 3 },
  medium: { label: 'Vừa', color: '#f59e0b', weight: 2 },
  low: { label: 'Thấp', color: '#10b981', weight: 1 },
};

export const FILTER_LABEL: Record<FilterStatus, string> = {
  all: 'Tất cả',
  pending: 'Chưa xong',
  overdue: 'Quá hạn',
  done: 'Đã xong',
};

/* ----- type guards ----- */

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

export const isPriority = (value: unknown): value is Priority =>
  typeof value === 'string' && (PRIORITIES as readonly string[]).includes(value);

export const isFilterStatus = (value: unknown): value is FilterStatus =>
  typeof value === 'string' && (FILTERS as readonly string[]).includes(value);

export function isAssignment(value: unknown): value is Assignment {
  if (!isRecord(value)) return false;
  return (
    typeof value.id === 'string' &&
    typeof value.subject === 'string' &&
    typeof value.title === 'string' &&
    typeof value.dueDate === 'string' &&
    typeof value.completed === 'boolean' &&
    typeof value.createdAt === 'string' &&
    isPriority(value.priority)
  );
}

export function isArrayOf<T>(value: unknown, guard: (item: unknown) => item is T): value is T[] {
  return Array.isArray(value) && value.every(guard);
}

export const isAssignmentArray = (value: unknown): value is Assignment[] =>
  isArrayOf(value, isAssignment);
