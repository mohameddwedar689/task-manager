import { STATUS_COLORS, PRIORITY_COLORS } from '../utils/constants';
import Button from './Button';

export default function TaskCard({ task, onEdit, onDelete }) {
  const dueDate = task.dueDate ? new Date(task.dueDate).toLocaleDateString() : null;

  return (
    <div className="flex flex-col justify-between rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
      <div>
        <div className="mb-2 flex items-start justify-between gap-2">
          <h3 className="font-semibold text-gray-900 break-words">{task.title}</h3>
        </div>
        {task.description && (
          <p className="mb-3 text-sm text-gray-500 line-clamp-3">{task.description}</p>
        )}
        <div className="mb-3 flex flex-wrap gap-2">
          <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_COLORS[task.status]}`}>
            {task.status}
          </span>
          <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${PRIORITY_COLORS[task.priority]}`}>
            {task.priority} priority
          </span>
        </div>
        {dueDate && <p className="mb-3 text-xs text-gray-400">Due {dueDate}</p>}
      </div>
      <div className="flex gap-2">
        <Button variant="secondary" className="flex-1" onClick={() => onEdit(task)}>
          Edit
        </Button>
        <Button variant="danger" className="flex-1" onClick={() => onDelete(task)}>
          Delete
        </Button>
      </div>
    </div>
  );
}
