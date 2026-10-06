import { createAsyncThunk, createSelector, createSlice, nanoid } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

import { assignmentApi } from '../../api/assignmentApi';
import { getErrorMessage } from '../../api/client';
import type { RootState } from '../../store';
import { PRIORITY_META } from '../../types/assignment';
import type {
  Assignment,
  AssignmentPatch,
  FilterStatus,
  NewAssignmentInput,
  RequestStatus,
} from '../../types/assignment';
import { describeDeadline } from '../../utils/date';

interface AssignmentsState {
  items: Assignment[];
  status: RequestStatus;
  error: string | null;
  filter: FilterStatus;
  keyword: string;
}

const initialState: AssignmentsState = {
  items: [],
  status: 'idle',
  error: null,
  filter: 'all',
  keyword: '',
};

export const fetchAssignments = createAsyncThunk<
  Assignment[],
  void,
  { state: RootState; rejectValue: string }
>(
  'assignments/fetchAll',
  async (_arg, { rejectWithValue }) => {
    try {
      return await assignmentApi.getAll();
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, 'Không tải được danh sách bài tập'));
    }
  },
  // tránh gọi lại khi đang tải
  { condition: (_arg, { getState }) => getState().assignments.status !== 'loading' }
);

const assignmentsSlice = createSlice({
  name: 'assignments',
  initialState,
  reducers: {
    assignmentAdded: {
      reducer(state, action: PayloadAction<Assignment>) {
        state.items.unshift(action.payload);
      },
      prepare(input: NewAssignmentInput) {
        const assignment: Assignment = {
          ...input,
          id: nanoid(),
          completed: false,
          createdAt: new Date().toISOString(),
        };
        return { payload: assignment };
      },
    },

    completionToggled(state, action: PayloadAction<string>) {
      const found = state.items.find((item) => item.id === action.payload);
      if (found) found.completed = !found.completed;
    },

    assignmentRemoved(state, action: PayloadAction<string>) {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },

    assignmentUpdated(state, action: PayloadAction<{ id: string; patch: AssignmentPatch }>) {
      const found = state.items.find((item) => item.id === action.payload.id);
      if (found) Object.assign(found, action.payload.patch);
    },

    filterChanged(state, action: PayloadAction<FilterStatus>) {
      state.filter = action.payload;
    },

    keywordChanged(state, action: PayloadAction<string>) {
      state.keyword = action.payload;
    },
  },

  extraReducers(builder) {
    builder
      .addCase(fetchAssignments.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchAssignments.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchAssignments.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload ?? 'Lỗi không xác định';
      });
  },
});

export const {
  assignmentAdded,
  assignmentRemoved,
  assignmentUpdated,
  completionToggled,
  filterChanged,
  keywordChanged,
} = assignmentsSlice.actions;

export default assignmentsSlice.reducer;

/* ----- selectors ----- */

export const selectAllAssignments = (state: RootState) => state.assignments.items;
export const selectFilter = (state: RootState) => state.assignments.filter;
export const selectKeyword = (state: RootState) => state.assignments.keyword;
export const selectStatus = (state: RootState) => state.assignments.status;
export const selectError = (state: RootState) => state.assignments.error;

function assertNever(value: never): never {
  throw new Error(`Filter không hợp lệ: ${String(value)}`);
}

export function matchesFilter(assignment: Assignment, filter: FilterStatus): boolean {
  const { isOverdue } = describeDeadline(assignment.dueDate, { completed: assignment.completed });

  switch (filter) {
    case 'all':
      return true;
    case 'pending':
      return !assignment.completed;
    case 'overdue':
      return isOverdue;
    case 'done':
      return assignment.completed;
    default:
      return assertNever(filter);
  }
}

// chưa xong trước, hạn gần trước, ưu tiên cao trước
function compareAssignments(a: Assignment, b: Assignment): number {
  if (a.completed !== b.completed) return a.completed ? 1 : -1;
  if (a.dueDate !== b.dueDate) return a.dueDate < b.dueDate ? -1 : 1;
  return PRIORITY_META[b.priority].weight - PRIORITY_META[a.priority].weight;
}

export const selectVisibleAssignments = createSelector(
  [selectAllAssignments, selectFilter, selectKeyword],
  (items, filter, keyword) => {
    const needle = keyword.trim().toLowerCase();
    return items
      .filter((item) => matchesFilter(item, filter))
      .filter(
        (item) => !needle || `${item.subject} ${item.title}`.toLowerCase().includes(needle)
      )
      .sort(compareAssignments);
  }
);

export interface AssignmentStats {
  total: number;
  pending: number;
  overdue: number;
  done: number;
}

export const selectStats = createSelector([selectAllAssignments], (items): AssignmentStats => ({
  total: items.length,
  pending: items.filter((item) => matchesFilter(item, 'pending')).length,
  overdue: items.filter((item) => matchesFilter(item, 'overdue')).length,
  done: items.filter((item) => matchesFilter(item, 'done')).length,
}));

export const selectCountByFilter = createSelector(
  [selectStats],
  (stats): Record<FilterStatus, number> => ({
    all: stats.total,
    pending: stats.pending,
    overdue: stats.overdue,
    done: stats.done,
  })
);
