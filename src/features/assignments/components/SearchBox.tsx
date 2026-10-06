import { useEffect, useState } from 'react';

import { useDebouncedValue } from '../../../hooks/useDebouncedValue';

interface Props {
  onSearch: (keyword: string) => void;
}

function SearchBox({ onSearch }: Props) {
  const [text, setText] = useState('');
  const debounced = useDebouncedValue(text, 300);

  useEffect(() => {
    onSearch(debounced);
  }, [debounced, onSearch]);

  return (
    <div className="search">
      <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
        <circle cx="11" cy="11" r="6.5" fill="none" stroke="currentColor" strokeWidth="1.8" />
        <path d="m16 16 4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
      <input
        type="search"
        value={text}
        placeholder="Tìm bài tập..."
        onChange={(event) => setText(event.target.value)}
        aria-label="Tìm bài tập"
      />
    </div>
  );
}

export default SearchBox;
