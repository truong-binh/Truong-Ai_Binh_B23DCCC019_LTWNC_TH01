import AssignmentForm from './components/AssignmentForm';
import { AssignmentListWithState } from './components/AssignmentList';
import FilterTabs from './components/FilterTabs';
import SearchBox from './components/SearchBox';
import StatsBar from './components/StatsBar';
import { useAssignments } from './hooks/useAssignments';

function AssignmentsPage() {
  const {
    items,
    stats,
    countByFilter,
    filter,
    status,
    error,
    isEmpty,
    addAssignment,
    changeFilter,
    search,
    reload,
  } = useAssignments();

  return (
    <>
      <StatsBar stats={stats} />

      <div className="layout">
        <aside className="layout__side">
          <AssignmentForm onSubmit={addAssignment} />
        </aside>

        <section className="card">
          <div className="card__head">
            <h2 className="card__title">Bài tập của tôi</h2>
            <button
              type="button"
              className={status === 'loading' ? 'btn btn--sm is-loading' : 'btn btn--sm'}
              onClick={reload}
            >
              <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
                <path
                  d="M20 12a8 8 0 1 1-2.3-5.6M20 4v4h-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
              Tải lại
            </button>
          </div>

          <div className="toolbar">
            <FilterTabs value={filter} counts={countByFilter} onChange={changeFilter} />
            <SearchBox onSearch={search} />
          </div>

          <AssignmentListWithState
            items={items}
            status={status}
            error={error}
            isEmpty={isEmpty}
            onRetry={reload}
          />
        </section>
      </div>
    </>
  );
}

export default AssignmentsPage;
