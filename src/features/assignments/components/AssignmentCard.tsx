import { createContext, useContext, useMemo } from 'react';
import type { ReactNode } from 'react';

import { PRIORITY_META } from '../../../types/assignment';
import type { Assignment } from '../../../types/assignment';
import { formatDisplayDate } from '../../../utils/date';
import type { DeadlineInfo } from '../../../utils/date';
import { useAssignmentActions } from '../hooks/useAssignments';
import { useDeadline } from '../hooks/useDeadline';

interface CardContext {
  assignment: Assignment;
  deadline: DeadlineInfo;
  toggle: () => void;
  remove: () => void;
}

const Context = createContext<CardContext | null>(null);

function useCard(child: string): CardContext {
  const context = useContext(Context);
  if (!context) throw new Error(`<AssignmentCard.${child}/> phải nằm trong <AssignmentCard>`);
  return context;
}

interface RootProps {
  assignment: Assignment;
  children: ReactNode;
}

function Root({ assignment, children }: RootProps) {
  const deadline = useDeadline(assignment.dueDate, assignment.completed);
  const actions = useAssignmentActions();

  const value = useMemo<CardContext>(
    () => ({
      assignment,
      deadline,
      toggle: () => actions.toggle(assignment.id),
      remove: () => actions.remove(assignment.id),
    }),
    [actions, assignment, deadline]
  );

  const state = assignment.completed ? 'done' : deadline.isOverdue ? 'overdue' : 'normal';

  return (
    <Context.Provider value={value}>
      <article className={`task task--${state}`}>{children}</article>
    </Context.Provider>
  );
}

function Content({ children }: { children: ReactNode }) {
  return <div className="task__content">{children}</div>;
}

function Row({ children }: { children: ReactNode }) {
  return <div className="task__row">{children}</div>;
}

function Check() {
  const { assignment, toggle } = useCard('Check');
  return (
    <label className="check" title={assignment.completed ? 'Bỏ đánh dấu' : 'Đánh dấu hoàn thành'}>
      <input type="checkbox" checked={assignment.completed} onChange={toggle} />
      <span className="check__box" />
    </label>
  );
}

function Subject() {
  const { assignment } = useCard('Subject');
  return <span className="chip">{assignment.subject}</span>;
}

function Priority() {
  const { assignment } = useCard('Priority');
  const meta = PRIORITY_META[assignment.priority];
  return (
    <span className="prio">
      <i className="prio__dot" style={{ background: meta.color }} />
      {meta.label}
    </span>
  );
}

function Title() {
  const { assignment } = useCard('Title');
  return <h3 className="task__title">{assignment.title}</h3>;
}

function DueDate() {
  const { assignment } = useCard('DueDate');
  return <span className="task__due">{formatDisplayDate(assignment.dueDate)}</span>;
}

function Countdown() {
  const { deadline } = useCard('Countdown');
  return <span className={`pill pill--${deadline.state}`}>{deadline.label}</span>;
}

function Delete() {
  const { assignment, remove } = useCard('Delete');
  return (
    <button
      type="button"
      className="icon-btn"
      onClick={remove}
      aria-label={`Xoá ${assignment.title}`}
    >
      <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
        <path
          d="M4 7h16M9 7V5h6v2m-8 0 1 13h8l1-13"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
    </button>
  );
}

export const AssignmentCard = Object.assign(Root, {
  Content,
  Row,
  Check,
  Subject,
  Priority,
  Title,
  DueDate,
  Countdown,
  Delete,
});
