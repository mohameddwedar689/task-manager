// Mirrors backend/src/constants/task.constants.js - kept in sync manually
// since frontend and backend are separate deployable units.
export const TASK_STATUS = ['To Do', 'In Progress', 'Done'];
export const TASK_PRIORITY = ['Low', 'Medium', 'High'];

export const STATUS_COLORS = {
  'To Do': 'bg-gray-100 text-gray-700',
  'In Progress': 'bg-blue-100 text-blue-700',
  Done: 'bg-green-100 text-green-700',
};

export const PRIORITY_COLORS = {
  Low: 'bg-slate-100 text-slate-600',
  Medium: 'bg-amber-100 text-amber-700',
  High: 'bg-red-100 text-red-700',
};
