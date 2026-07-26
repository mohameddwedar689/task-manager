import { useState } from 'react';
import toast from 'react-hot-toast';
import FilterBar from '../components/FilterBar';
import TaskList from '../components/TaskList';
import Pagination from '../components/Pagination';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';
import EmptyState from '../components/EmptyState';
import ConfirmDialog from '../components/ConfirmDialog';
import TaskForm from '../components/TaskForm';
import Button from '../components/Button';
import { useTasks, useCreateTask, useUpdateTask, useDeleteTask } from '../hooks/useTasks';
import { getErrorMessage } from '../utils/getErrorMessage';

export default function DashboardPage() {
  const [filters, setFilters] = useState({ page: 1, limit: 9, search: '', status: '', priority: '' });
  const [modalTask, setModalTask] = useState(null); // null = closed, {} = create, {...} = edit
  const [taskToDelete, setTaskToDelete] = useState(null);

  const { data, isLoading, isError, refetch } = useTasks(filters);
  const createTask = useCreateTask();
  const updateTask = useUpdateTask();
  const deleteTask = useDeleteTask();

  const tasks = data?.data || [];
  const meta = data?.meta;

  const handleSubmit = async (values) => {
    const payload = { ...values, dueDate: values.dueDate || null };
    try {
      if (modalTask?._id) {
        await updateTask.mutateAsync({ id: modalTask._id, payload });
        toast.success('Task updated');
      } else {
        await createTask.mutateAsync(payload);
        toast.success('Task created');
      }
      setModalTask(null);
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const handleDelete = async () => {
    try {
      await deleteTask.mutateAsync(taskToDelete._id);
      toast.success('Task deleted');
      setTaskToDelete(null);
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">My Tasks</h1>
        <Button onClick={() => setModalTask({})}>+ New Task</Button>
      </div>

      <FilterBar filters={filters} onChange={setFilters} />

      {isLoading && <LoadingState label="Loading tasks…" />}

      {isError && <ErrorState message="Couldn't load your tasks." onRetry={refetch} />}

      {!isLoading && !isError && tasks.length === 0 && (
        <EmptyState
          title="No tasks found"
          description="Try adjusting your filters, or create your first task."
          action={<Button onClick={() => setModalTask({})}>+ New Task</Button>}
        />
      )}

      {!isLoading && !isError && tasks.length > 0 && (
        <>
          <TaskList tasks={tasks} onEdit={setModalTask} onDelete={setTaskToDelete} />
          <Pagination
            page={meta?.page || 1}
            totalPages={meta?.totalPages || 1}
            onPageChange={(page) => setFilters((f) => ({ ...f, page }))}
          />
        </>
      )}

      {/* Create / Edit modal */}
      {modalTask !== null && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <h3 className="mb-4 text-base font-semibold text-gray-900">
              {modalTask._id ? 'Edit Task' : 'New Task'}
            </h3>
            <TaskForm
              defaultValues={modalTask._id ? modalTask : undefined}
              onSubmit={handleSubmit}
              onCancel={() => setModalTask(null)}
              isSubmitting={createTask.isPending || updateTask.isPending}
              submitLabel={modalTask._id ? 'Save Changes' : 'Create Task'}
            />
          </div>
        </div>
      )}

      <ConfirmDialog
        open={!!taskToDelete}
        title="Delete this task?"
        description={taskToDelete ? `"${taskToDelete.title}" will be permanently deleted.` : ''}
        onConfirm={handleDelete}
        onCancel={() => setTaskToDelete(null)}
        isLoading={deleteTask.isPending}
      />
    </div>
  );
}
