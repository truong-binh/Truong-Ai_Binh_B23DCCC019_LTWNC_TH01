import { useMemo } from 'react';

import { useNow } from '../../../hooks/useNow';
import { describeDeadline } from '../../../utils/date';
import type { DeadlineInfo } from '../../../utils/date';

/** trả về nhãn "Còn X ngày" / "Quá hạn Y ngày", tự cập nhật khi sang ngày mới */
export function useDeadline(dueDate: string, completed: boolean): DeadlineInfo {
  const now = useNow();

  return useMemo(
    () => describeDeadline(dueDate, { completed, now: new Date(now) }),
    [dueDate, completed, now]
  );
}
