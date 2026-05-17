import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createTicket } from '../redux/ticketsSlice';
import { useNavigate } from 'react-router-dom';

export default function CreateTicket() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector(state => state.tickets);

  const [form, setForm] = useState({
    title: '',
    description: '',
    category: 'IT',
    priority: 'Low'
  });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = 'Title is required';
    if (!form.description.trim()) e.description = 'Description is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    // Capture location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const ticketData = {
            ...form,
            location: { lat: pos.coords.latitude, lng: pos.coords.longitude }
          };
          await dispatch(createTicket(ticketData));
          setSuccess(true);
          setTimeout(() => navigate('/tickets'), 1500);
        },
        async () => {
          // Location denied — submit without it
          await dispatch(createTicket(form));
          setSuccess(true);
          setTimeout(() => navigate('/tickets'), 1500);
        }
      );
    } else {
      await dispatch(createTicket(form));
      setSuccess(true);
      setTimeout(() => navigate('/tickets'), 1500);
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: 600 }}>
      <h4 className="mb-4">Raise a Service Request</h4>

      {success && <div className="alert alert-success">Ticket created! Redirecting...</div>}

      <form onSubmit={handleSubmit} noValidate>
        <div className="mb-3">
          <label className="form-label">Title</label>
          <input
            type="text"
            className={`form-control ${errors.title ? 'is-invalid' : ''}`}
            value={form.title}
            onChange={e => setForm({ ...form, title: e.target.value })}
          />
          <div className="invalid-feedback">{errors.title}</div>
        </div>

        <div className="mb-3">
          <label className="form-label">Description</label>
          <textarea
            className={`form-control ${errors.description ? 'is-invalid' : ''}`}
            rows={4}
            value={form.description}
            onChange={e => setForm({ ...form, description: e.target.value })}
          />
          <div className="invalid-feedback">{errors.description}</div>
        </div>

        <div className="mb-3">
          <label className="form-label">Category</label>
          <select
            className="form-select"
            value={form.category}
            onChange={e => setForm({ ...form, category: e.target.value })}
          >
            <option>IT</option>
            <option>HR</option>
            <option>Admin</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="form-label">Priority</label>
          <select
            className="form-select"
            value={form.priority}
            onChange={e => setForm({ ...form, priority: e.target.value })}
          >
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>
        </div>

        <button className="btn btn-primary w-100" disabled={loading}>
          {loading ? 'Submitting...' : 'Submit Ticket'}
        </button>
      </form>
    </div>
  );
}