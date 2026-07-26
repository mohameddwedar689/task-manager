import axiosClient from './axiosClient';

export const taskApi = {
  getAll: (params) => axiosClient.get('/tasks', { params }).then((res) => res.data),
  getById: (id) => axiosClient.get(`/tasks/${id}`).then((res) => res.data),
  create: (payload) => axiosClient.post('/tasks', payload).then((res) => res.data),
  update: (id, payload) => axiosClient.put(`/tasks/${id}`, payload).then((res) => res.data),
  remove: (id) => axiosClient.delete(`/tasks/${id}`).then((res) => res.data),
};
