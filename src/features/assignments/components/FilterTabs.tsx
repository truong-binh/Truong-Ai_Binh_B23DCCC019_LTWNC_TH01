import { FILTERS, FILTER_LABEL } from '../../../types/assignment';
import type { FilterStatus } from '../../../types/assignment';

interface Props {
  value: FilterStatus;
  counts: Record<FilterStatus, number>;
  onChange: (filter: FilterStatus) => void;
}

function FilterTabs({ value, counts, onChange }: Props) {
  return (
    <div className="tabs" role="tablist">
      {FILTERS.map((filter) => (
        <button
          key={filter}
          type="button"
          role="tab"
          aria-selected={value === filter}
          className={value === filter ? 'tab is-on' : 'tab'}
          onClick={() => onChange(filter)}
        >
          {FILTER_LABEL[filter]}
          <span className="tab__count">{counts[filter]}</span>
        </button>
      ))}
    </div>
  );
}

export default FilterTabs;
