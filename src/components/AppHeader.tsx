import { useState } from 'react';

import { useInterval } from '../hooks/useInterval';
import { formatDisplayDate, toISODate } from '../utils/date';

const WEEKDAYS = ['Chủ nhật', 'Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy'];

function AppHeader() {
  const [now, setNow] = useState(() => new Date());
  useInterval(() => setNow(new Date()), 1000);

  return (
    <header className="header">
      <div className="brand">
        <span className="brand__logo">SD</span>
        <div>
          <h1>Student Deadline Tracker</h1>
          <p>Theo dõi deadline bài tập của bạn</p>
        </div>
      </div>

      <div className="today">
        <span className="today__day">
          {WEEKDAYS[now.getDay()]}, {formatDisplayDate(toISODate(now))}
        </span>
        <span className="today__time">{now.toLocaleTimeString('vi-VN')}</span>
      </div>
    </header>
  );
}

export default AppHeader;
