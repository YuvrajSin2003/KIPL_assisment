import React, { useState, useEffect } from 'react';
import * as api from '../api';
import Navbar from '../components/Navbar';

const LEAVE_TYPES = ['sick', 'casual', 'annual', 'unpaid', 'other'];

const Leave = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ start_date: '', end_date: '', leave_type: '', reason: '' });
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  const fetchLeaves = async () => {
    setLoading(true);
    try {
      const res = await api.getMyLeaves({ limit: 50 });
      setLeaves(res.data.leaves);
    } catch {
      setError('Failed to load leave requests.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchLeaves(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    if (new Date(form.end_date) < new Date(form.start_date)) {
      setFormError('End date cannot be before start date.');
      return;
    }
    setSubmitting(true);
    try {
      await api.applyLeave(form);
      setForm({ start_date: '', end_date: '', leave_type: '', reason: '' });
      setShowForm(false);
      fetchLeaves();
    } catch (err) {
      setFormError(err.response?.data?.error || 'Failed to submit.');
    } finally {
      setSubmitting(false);
    }
  };

  const fmtDate = (str) => str ? new Date(str).toLocaleDateString() : '—';

  return (
    <div>
      <Navbar />
      <div className="container">
        <div className="page-top">
          <h2>Leave Requests</h2>
          <button onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Cancel' : '+ Apply Leave'}
          </button>
        </div>

        {showForm && (
          <div className="form-box">
            <h3>New Leave Request</h3>
            {formError && <div className="error-msg">{formError}</div>}
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>Start Date</label>
                  <input type="date" required value={form.start_date}
                    onChange={(e) => setForm({ ...form, start_date: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>End Date</label>
                  <input type="date" required value={form.end_date} min={form.start_date}
                    onChange={(e) => setForm({ ...form, end_date: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Leave Type</label>
                  <select required value={form.leave_type}
                    onChange={(e) => setForm({ ...form, leave_type: e.target.value })}>
                    <option value="">Select...</option>
                    {LEAVE_TYPES.map((t) => (
                      <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label>Reason</label>
                <textarea required rows={3} value={form.reason}
                  onChange={(e) => setForm({ ...form, reason: e.target.value })}
                  placeholder="Reason for leave..." />
              </div>
              <button type="submit" disabled={submitting}>
                {submitting ? 'Submitting...' : 'Submit Request'}
              </button>
            </form>
          </div>
        )}

        {error && <div className="error-msg">{error}</div>}
        {loading && <p>Loading...</p>}
        {!loading && leaves.length === 0 && <p>No leave requests yet.</p>}

        {!loading && leaves.length > 0 && (
          <table className="table">
            <thead>
              <tr>
                <th>Type</th>
                <th>From</th>
                <th>To</th>
                <th>Reason</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {leaves.map((l) => (
                <tr key={l.id}>
                  <td>{l.leave_type}</td>
                  <td>{fmtDate(l.start_date)}</td>
                  <td>{fmtDate(l.end_date)}</td>
                  <td>{l.reason.length > 40 ? l.reason.slice(0, 40) + '...' : l.reason}</td>
                  <td className={`status-${l.status}`}>{l.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Leave;
