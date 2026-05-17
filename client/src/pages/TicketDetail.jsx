import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import api from '../services/api';
import Chat from '../components/Chat';

const statusColors = {
  'Open': 'danger',
  'In Progress': 'warning',
  'Resolved': 'success'
};

export default function TicketDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector(state => state.auth);
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/tickets/${id}`)
      .then(res => { setTicket(res.data); setLoading(false); })
      .catch(() => navigate('/tickets'));
  }, [id]);

  if (loading) return (
    <div className="text-center mt-5">
      <div className="spinner-border text-primary" />
    </div>
  );

  return (
    <div className="container mt-4" style={{ maxWidth: 700 }}>
      <button className="btn btn-outline-secondary btn-sm mb-3" onClick={() => navigate('/tickets')}>
        ← Back to Tickets
      </button>

      <div className="card p-4 mb-2">
        <div className="d-flex justify-content-between align-items-start">
          <h5 className="mb-1">{ticket.title}</h5>
          <span className={`badge bg-${statusColors[ticket.status]}`}>{ticket.status}</span>
        </div>
        <p className="text-muted small mb-3">
          {ticket.category} · {ticket.priority} priority
        </p>
        <p>{ticket.description}</p>
        <hr />
        <div className="row text-muted small">
          <div className="col">
            <strong>Raised by:</strong> {ticket.createdBy?.name}
          </div>
          <div className="col">
            <strong>Assigned to:</strong> {ticket.assignedTo?.name || 'Unassigned'}
          </div>
          <div className="col">
            <strong>Created:</strong> {new Date(ticket.createdAt).toLocaleDateString()}
          </div>
        </div>
      </div>

      {/* Chat — only show if ticket is not resolved */}
      {ticket.status !== 'Resolved' && <Chat ticketId={id} />}

      {ticket.status === 'Resolved' && (
        <div className="alert alert-success mt-3">
          This ticket has been resolved. Chat is closed.
        </div>
      )}
    </div>
  );
}