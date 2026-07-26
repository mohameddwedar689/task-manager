/**
 * React Query hooks for tasks. Components call these, never taskApi
 * directly - this is what gives us shared caching (two components
 * requesting the same task list share one network call), automatic
 * loading/error state, and cache invalidation after mutations without
 * manual refetch plumbing.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { taskApi } from '../api/taskApi';

const TASKS_KEY = 'tasks';

export function useTasks(filters) {
  return useQuery({
    queryKey: [TASKS_KEY, filters],
    queryFn: () => taskApi.getAll(filters),
    keepPreviousData: true, // avoids a flash of empty state while a new page/filter loads
  });
}

export function useTask(id) {
  return useQuery({
    queryKey: [TASKS_KEY, id],
    queryFn: () => taskApi.getById(id),
    enabled: !!id,
  });
}

export function useCreateTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: taskApi.create,
    onSuccess: () => {
      // Invalidate the list so it refetches with the new task included -
      // simpler and less error-prone than manually splicing the cache.
      queryClient.invalidateQueries({ queryKey: [TASKS_KEY] });
    },
  });
}

export function useUpdateTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }) => taskApi.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TASKS_KEY] });
    },
  });
}

export function useDeleteTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: taskApi.remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TASKS_KEY] });
    },
  });
}
