import api from './client';

export const login = (username, password) => api.post('/auth/login', { username, password });
export const logout = () => api.post('/auth/logout');
export const getMe = () => api.get('/auth/me');
export const getTodayStatus = () => api.get('/attendance/today');
export const checkIn = () => api.post('/attendance/check-in');
export const checkOut = () => api.post('/attendance/check-out');
export const getTimesheet = (params) => api.get('/attendance/timesheet', { params });
export const applyLeave = (data) => api.post('/leave', data);
export const getMyLeaves = (params) => api.get('/leave', { params });
