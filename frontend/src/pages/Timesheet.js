import React, { useState, useEffect } from 'react';
import * as api from '../api';
import Navbar from '../components/Navbar';

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

const Timesheet = () => {
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.getTimesheet({ month, year, limit: 31 });
      setRecords(res.data.records);
    } catch {
      setError('Failed to load timesheet.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [month, year]);

  const fmt = (str) => str ? new Date(str).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—';
  const fmtDate = (str) => str ? new Date(str).toLocaleDateString() : '—';

  const prevMonth = () => { if (month === 1) { setMonth(12); setYear(y => y - 1); } else setMonth(m => m - 1); };
  const nextMonth = () => { if (month === 12) { setMonth(1); setYear(y => y + 1); } else setMonth(m => m + 1); };

  return (
    <div>
      <Navbar />
      <div className="container">
        <h2>Timesheet</h2>

        <div className="month-nav">
          <button onClick={prevMonth}>←</button>
          <span>{MONTHS[month - 1]} {year}</span>
          <button onClick={nextMonth}>→</button>
        </div>

        {error && <div className="error-msg">{error}</div>}
        {loading && <p>Loading...</p>}

        {!loading && records.length === 0 && <p>No records for this month.</p>}

        {!loading && records.length > 0 && (
          <table className="table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Check-in</th>
                <th>Check-out</th>
                <th>Hours</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {records.map((r) => (
                <tr key={r.id}>
                  <td>{fmtDate(r.date)}</td>
                  <td>{fmt(r.check_in_time)}</td>
                  <td>{fmt(r.check_out_time)}</td>
                  <td>{r.total_hours ? `${parseFloat(r.total_hours).toFixed(2)} hrs` : '—'}</td>
                  <td>{r.status === 'checked_out' ? 'Complete' : 'Incomplete'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Timesheet;
