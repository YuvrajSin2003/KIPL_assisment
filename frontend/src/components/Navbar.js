import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { employee, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <span className="brand">AttendPortal</span>
      <div className="nav-links">
        <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'active' : ''}>Check-in</NavLink>
        <NavLink to="/timesheet" className={({ isActive }) => isActive ? 'active' : ''}>Timesheet</NavLink>
        <NavLink to="/leave" className={({ isActive }) => isActive ? 'active' : ''}>Leave</NavLink>
      </div>
      <div className="nav-user">
        <span>{employee?.full_name}</span>
        <button onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  );
};

export default Navbar;
