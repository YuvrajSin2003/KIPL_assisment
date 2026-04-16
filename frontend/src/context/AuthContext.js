import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import * as api from '../api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [employee, setEmployee] = useState(() => {
    try { return JSON.parse(localStorage.getItem('employee')); } catch { return null; }
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const doLogout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('employee');
    setEmployee(null);
    navigate('/login');
  }, [navigate]);

  useEffect(() => {
    window.addEventListener('session-expired', doLogout);
    return () => window.removeEventListener('session-expired', doLogout);
  }, [doLogout]);

  useEffect(() => {
    if (!localStorage.getItem('token')) { setLoading(false); return; }
    api.getMe()
      .then((res) => { setEmployee(res.data.employee); })
      .catch(doLogout)
      .finally(() => setLoading(false));
  }, [doLogout]);

  const login = async (username, password) => {
    const res = await api.login(username, password);
    localStorage.setItem('token', res.data.token);
    localStorage.setItem('employee', JSON.stringify(res.data.employee));
    setEmployee(res.data.employee);
  };

  const logout = async () => {
    try { await api.logout(); } catch {}
    doLogout();
  };

  return (
    <AuthContext.Provider value={{ employee, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
