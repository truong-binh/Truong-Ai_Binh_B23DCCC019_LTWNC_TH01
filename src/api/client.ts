export interface ApiError {
  message: string;
  status: number;
}

export function isApiError(error: unknown): error is ApiError {
  return (
    typeof error === 'object' &&
    error !== null &&
    typeof (error as ApiError).message === 'string' &&
    typeof (error as ApiError).status === 'number'
  );
}

export function getErrorMessage(error: unknown, fallback = 'Đã có lỗi xảy ra'): string {
  if (isApiError(error)) return error.message;
  if (error instanceof Error) return error.message;
  if (typeof error === 'string') return error;
  return fallback;
}

const delay = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

interface FakeRequestOptions {
  delayMs?: number;
  failureRate?: number; // 0..1, để thử nhánh lỗi
}

/** giả lập gọi API: chờ một chút rồi trả dữ liệu */
export async function fakeRequest<T>(
  resolver: () => T,
  { delayMs = 900, failureRate = 0 }: FakeRequestOptions = {}
): Promise<T> {
  await delay(delayMs);
  if (failureRate > 0 && Math.random() < failureRate) {
    const error: ApiError = { message: 'Không kết nối được tới server', status: 503 };
    throw error;
  }
  return resolver();
}
