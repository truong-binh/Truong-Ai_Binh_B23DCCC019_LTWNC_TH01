import { useCallback, useEffect, useMemo } from 'react';

import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import type {
  Assignment,
  FilterStatus,
  NewAssignmentInput,
  RequestStatus,
} from '../../../types/assignment';
import {
  assignmentAdded,
  assignmentRemoved,
  completionToggled,
  fetchAssignments,
  filterChanged,
  keywordChanged,
  selectCountByFilter,
  selectError,
  selectFilter,
  selectStats,
  selectStatus,
  selectVisibleAssignments,
} from '../assignmentsSlice';
import type { AssignmentStats } from '../assignmentsSlice';

export interface UseAssignmentsResult {
  items: Assignment[];
  stats: AssignmentStats;
  countByFilter: Record<FilterStatus, number>;
  filter: FilterStatus;
  status: RequestStatus;
  error: string | null;
  isEmpty: boolean;
  addAssignment: (input: NewAssignmentInput) => void;
  changeFilter: (filter: FilterStatus) => void;
  search: (keyword: string) => void;
  reload: () => void;
}

/** gom dữ liệu + hành động của feature, component chỉ việc gọi hook này */
export function useAssignments(): UseAssignmentsResult {
  const dispatch = useAppDispatch();

  const items = useAppSelector(selectVisibleAssignments);
  const stats = useAppSelector(selectStats);
  const countByFilter = useAppSelector(selectCountByFilter);
  const filter = useAppSelector(selectFilter);
  const status = useAppSelector(selectStatus);
  const error = useAppSelector(selectError);

  // lấy danh sách mẫu khi mở app
  useEffect(() => {
    if (status === 'idle') void dispatch(fetchAssignments());
  }, [dispatch, status]);

  const addAssignment = useCallback(
    (input: NewAssignmentInput) => dispatch(assignmentAdded(input)),
    [dispatch]
  );
  const changeFilter = useCallback(
    (next: FilterStatus) => dispatch(filterChanged(next)),
    [dispatch]
  );
  const search = useCallback((next: string) => dispatch(keywordChanged(next)), [dispatch]);
  const reload = useCallback(() => void dispatch(fetchAssignments()), [dispatch]);

  return useMemo(
    () => ({
      items,
      stats,
      countByFilter,
      filter,
      status,
      error,
      isEmpty: items.length === 0,
      addAssignment,
      changeFilter,
      search,
      reload,
    }),
    [
      items,
      stats,
      countByFilter,
      filter,
      status,
      error,
      addAssignment,
      changeFilter,
      search,
      reload,
    ]
  );
}

/** thẻ bài tập chỉ cần 2 hành động này nên tách riêng cho nhẹ */
export function useAssignmentActions() {
  const dispatch = useAppDispatch();

  return useMemo(
    () => ({
      toggle: (id: string) => dispatch(completionToggled(id)),
      remove: (id: string) => dispatch(assignmentRemoved(id)),
    }),
    [dispatch]
  );
}
