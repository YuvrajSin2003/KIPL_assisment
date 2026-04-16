import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import * as api from '../api';
import Navbar from '../components/Navbar';

const Dashboard = () => {
  const { employee } = useAuth();
  const [status, setStatus] = useState('');
  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchStatus = async () => {
    try {
      const res = await api.getTodayStatus();
      setStatus(res.data.status);
      setRecord(res.data.record);
    } catch {
      setError('Failed to load status.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchStatus(); }, []);

  const handleCheckIn = async () => {
    setError('');
    try {
      await api.checkIn();
      fetchStatus();
    } catch (err) {
      setError(err.response?.data?.error || 'Check-in failed.');
    }
  };

  const handleCheckOut = async () => {
    setError('');
    try {
      await api.checkOut();
      fetchStatus();
    } catch (err) {
      setError(err.response?.data?.error || 'Check-out failed.');
    }
  };

  const fmt = (dateStr) => dateStr ? new Date(dateStr).toLocaleTimeString() : '—';

  return (
    <div>
      <Navbar />
      <div className="container">
        <h2>Welcome, {employee?.full_name}</h2>
        <p className="date">{new Date().toDateString()}</p>

        {loading && <p>Loading...</p>}
        {error && <div className="error-msg">{error}</div>}

        {!loading && (
          <div className="status-card">
            <div className="status-row">
              <div>
                <div className="label">Status</div>
                <div className="value">
                  {status === 'not_checked_in' && 'Not Checked In'}
                  {status === 'checked_in' && 'Checked In'}
                  {status === 'checked_out' && 'Checked Out'}
                </div>
              </div>
              <div>
                <div className="label">Check-in</div>
                <div className="value">{fmt(record?.check_in_time)}</div>
              </div>
              <div>
                <div className="label">Check-out</div>
                <div className="value">{fmt(record?.check_out_time)}</div>
              </div>
              <div>
                <div className="label">Hours</div>
                <div className="value">{record?.total_hours ? `${record.total_hours} hrs` : '—'}</div>
              </div>
            </div>

            <div className="actions">
              {status === 'not_checked_in' && (
                <button className="btn-green" onClick={handleCheckIn}>Check In</button>
              )}
              {status === 'checked_in' && (
                <button className="btn-red" onClick={handleCheckOut}>Check Out</button>
              )}
              {status === 'checked_out' && (
                <p>You're done for today!</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
