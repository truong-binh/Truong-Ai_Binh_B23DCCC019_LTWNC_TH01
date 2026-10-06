import { withAsyncState } from '../../../hoc/withAsyncState';
import type { Assignment } from '../../../types/assignment';
import { AssignmentCard } from './AssignmentCard';

interface Props {
  items: Assignment[];
}

function AssignmentList({ items }: Props) {
  return (
    <ul className="list">
      {items.map((item, index) => (
        <li key={item.id} className="list__item" style={{ animationDelay: `${index * 45}ms` }}>
          <AssignmentCard assignment={item}>
            <AssignmentCard.Check />
            <AssignmentCard.Content>
              <AssignmentCard.Row>
                <AssignmentCard.Subject />
                <AssignmentCard.Priority />
              </AssignmentCard.Row>
              <AssignmentCard.Title />
              <AssignmentCard.Row>
                <AssignmentCard.DueDate />
                <AssignmentCard.Countdown />
              </AssignmentCard.Row>
            </AssignmentCard.Content>
            <AssignmentCard.Delete />
          </AssignmentCard>
        </li>
      ))}
    </ul>
  );
}

export const AssignmentListWithState = withAsyncState(AssignmentList, {
  loadingText: 'Đang tải danh sách bài tập',
  emptyText: 'Không có bài tập nào',
  skeletonCount: 4,
});

export default AssignmentList;
