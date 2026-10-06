import { isAssignmentArray } from '../types/assignment';
import type { Assignment, NewAssignmentInput } from '../types/assignment';
import { addDays } from '../utils/date';
import { fakeRequest } from './client';

// hạn nộp tính lệch so với hôm nay để luôn có bài quá hạn / sắp tới hạn
function seed(): Assignment[] {
  const now = new Date().toISOString();
  return [
    {
      id: 'a1',
      subject: 'Lập trình Web',
      title: 'Bài tập lớn: Student Deadline Tracker',
      dueDate: addDays(2),
      priority: 'high',
      completed: false,
      createdAt: now,
    },
    {
      id: 'a2',
      subject: 'Cơ sở dữ liệu',
      title: 'Chuẩn hoá quan hệ về 3NF',
      dueDate: addDays(-3),
      priority: 'high',
      completed: false,
      createdAt: now,
    },
    {
      id: 'a3',
      subject: 'Toán rời rạc',
      title: 'Bài tập chương 4 - Đồ thị',
      dueDate: addDays(0),
      priority: 'medium',
      completed: false,
      createdAt: now,
    },
    {
      id: 'a4',
      subject: 'Tiếng Anh',
      title: 'Viết luận 500 từ về AI',
      dueDate: addDays(9),
      priority: 'low',
      completed: false,
      createdAt: now,
    },
    {
      id: 'a5',
      subject: 'Kiến trúc máy tính',
      title: 'Báo cáo thực hành buổi 3',
      dueDate: addDays(-1),
      priority: 'medium',
      completed: true,
      createdAt: now,
    },
  ];
}

export const assignmentApi = {
  async getAll(): Promise<Assignment[]> {
    const data = await fakeRequest<unknown>(seed, { delayMs: 900, failureRate: 0 });

    // dữ liệu từ API là unknown nên phải check trước khi dùng
    if (!isAssignmentArray(data)) {
      throw { message: 'Dữ liệu trả về không đúng định dạng', status: 500 };
    }
    return data;
  },

  async create(input: NewAssignmentInput): Promise<Assignment> {
    return fakeRequest<Assignment>(
      () => ({
        ...input,
        id: `srv-${Date.now()}`,
        completed: false,
        createdAt: new Date().toISOString(),
      }),
      { delayMs: 400 }
    );
  },
};
