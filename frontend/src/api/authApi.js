import axiosClient from './axiosClient';

export const authApi = {
  register: (payload) => axiosClient.post('/auth/register', payload).then((res) => res.data),
  login: (payload) => axiosClient.post('/auth/login', payload).then((res) => res.data),
};
