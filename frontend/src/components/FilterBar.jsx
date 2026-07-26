import { TASK_STATUS, TASK_PRIORITY } from '../utils/constants';

/**
 * Controlled filter bar - the dashboard page owns the filter state and
 * passes it down, so this component stays a pure "display + emit changes"
 * piece with no internal state of its own to keep in sync.
 */
export default function FilterBar({ filters, onChange }) {
  const handle = (field) => (e) => onChange({ ...filters, [field]: e.target.value, page: 1 });

  return (
    <div className="mb-6 flex flex-wrap gap-3">
      <input
        type="text"
        placeholder="Search by title…"
        value={filters.search || ''}
        onChange={handle('search')}
        className="min-w-[200px] flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
      />
      <select
        value={filters.status || ''}
        onChange={handle('status')}
        className="rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
      >
        <option value="">All statuses</option>
        {TASK_STATUS.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>
      <select
        value={filters.priority || ''}
        onChange={handle('priority')}
        className="rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
      >
        <option value="">All priorities</option>
        {TASK_PRIORITY.map((p) => (
          <option key={p} value={p}>
            {p}
          </option>
        ))}
      </select>
    </div>
  );
}
