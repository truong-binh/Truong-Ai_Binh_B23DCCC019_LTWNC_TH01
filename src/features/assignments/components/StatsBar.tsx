import type { AssignmentStats } from '../assignmentsSlice';

interface Props {
  stats: AssignmentStats;
}

const TILES: Array<{ key: keyof AssignmentStats; label: string; tone: string }> = [
  { key: 'total', label: 'Tổng bài tập', tone: 'total' },
  { key: 'pending', label: 'Chưa xong', tone: 'pending' },
  { key: 'overdue', label: 'Quá hạn', tone: 'overdue' },
  { key: 'done', label: 'Đã xong', tone: 'done' },
];

function StatsBar({ stats }: Props) {
  return (
    <div className="stats">
      {TILES.map((tile, index) => (
        <div
          className={`stat stat--${tile.tone}`}
          key={tile.key}
          style={{ animationDelay: `${index * 60}ms` }}
        >
          <strong>{stats[tile.key]}</strong>
          <span>{tile.label}</span>
        </div>
      ))}
    </div>
  );
}

export default StatsBar;
