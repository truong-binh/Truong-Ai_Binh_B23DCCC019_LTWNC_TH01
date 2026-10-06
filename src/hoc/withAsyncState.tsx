import type { ComponentType } from 'react';

import type { RequestStatus } from '../types/assignment';

export interface AsyncStateProps {
  status: RequestStatus;
  error: string | null;
  isEmpty?: boolean;
  onRetry?: () => void;
}

interface Options {
  loadingText?: string;
  emptyText?: string;
  skeletonCount?: number;
}

/** HOC: bọc component danh sách, tự lo lúc đang tải / lỗi / rỗng */
export function withAsyncState<P extends object>(
  Wrapped: ComponentType<P>,
  { loadingText = 'Đang tải...', emptyText = 'Chưa có dữ liệu', skeletonCount = 3 }: Options = {}
): ComponentType<P & AsyncStateProps> {
  function WithAsyncState(props: P & AsyncStateProps) {
    const { status, error, isEmpty = false, onRetry, ...rest } = props;

    if (status === 'loading') {
      return (
        <div className="skeletons" role="status" aria-label={loadingText}>
          {Array.from({ length: skeletonCount }, (_, index) => (
            <div className="skeleton" key={index} />
          ))}
        </div>
      );
    }

    if (status === 'failed') {
      return (
        <div className="notice notice--error" role="alert">
          <span className="notice__icon">!</span>
          <div>
            <p className="notice__title">Tải dữ liệu thất bại</p>
            <p className="notice__text">{error ?? 'Lỗi không xác định'}</p>
          </div>
          {onRetry && (
            <button type="button" className="btn btn--sm" onClick={onRetry}>
              Thử lại
            </button>
          )}
        </div>
      );
    }

    if (isEmpty) {
      return (
        <div className="notice">
          <span className="notice__icon notice__icon--muted">◦</span>
          <div>
            <p className="notice__title">{emptyText}</p>
            <p className="notice__text">Thêm bài tập mới ở form bên cạnh.</p>
          </div>
        </div>
      );
    }

    return <Wrapped {...(rest as unknown as P)} />;
  }

  WithAsyncState.displayName = `withAsyncState(${Wrapped.displayName ?? Wrapped.name})`;
  return WithAsyncState;
}
