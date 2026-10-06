# Student Deadline Tracker

Quản lý deadline bài tập cá nhân. React + TypeScript + Redux Toolkit (Vite).

```bash
npm install
npm run dev     # http://localhost:5173
```

`npm run build` để build, `npm run typecheck` để kiểm tra kiểu.

## Cấu trúc

```
src/
├─ api/          # API giả lập (fakeRequest<T>, danh sách mẫu)
├─ components/   # header
├─ features/assignments/
│  ├─ assignmentsSlice.ts   # slice + async thunk + selectors
│  ├─ AssignmentsPage.tsx
│  ├─ components/           # Card, List, Form, FilterTabs, SearchBox, StatsBar
│  └─ hooks/                # useAssignments, useDeadline
├─ hoc/          # withAsyncState (loading / lỗi / rỗng)
├─ hooks/        # useForm, useInterval, useNow, useDebouncedValue
├─ store/        # configureStore + typed hooks
├─ types/        # type, utility type, type guard
└─ utils/date.ts # tính "Còn X ngày" / "Quá hạn Y ngày"
```

## Chức năng

- Danh sách bài tập: môn học, tên bài, hạn nộp, độ ưu tiên, trạng thái
- Thêm bài tập mới qua form (có validate)
- Đánh dấu hoàn thành / bỏ đánh dấu, xoá bài tập
- Lọc: Tất cả / Chưa xong / Quá hạn / Đã xong
- Mỗi bài hiện "Còn X ngày" hoặc "Quá hạn Y ngày"
- Mở app là tự lấy danh sách mẫu từ API giả lập
- Thêm: thống kê, tìm kiếm (debounce), tự sắp xếp theo hạn, skeleton khi tải

## Phần kiến thức đã dùng

**TypeScript:** generic (`AsyncState<T>`, `fakeRequest<T>`, `useForm<T>`), utility types
(`Omit`, `Pick`, `Partial`, `Record`), mapped type (`FormErrors<T>`), union từ `as const`,
type guard (`isAssignment` kiểm tra dữ liệu API, `isPriority` khi submit form).

**Design pattern:** custom hook (`useForm`, `useInterval`, `useNow`, `useDebouncedValue`,
`useAssignments`, `useDeadline`), HOC `withAsyncState`, compound component `<AssignmentCard>`.

**Redux Toolkit:** feature-based, typed hooks `useAppSelector`/`useAppDispatch`,
`createAsyncThunk` (có `rejectWithValue`, `condition`), `createSlice` với `prepare`,
`createSelector` để memo hoá danh sách và thống kê.
