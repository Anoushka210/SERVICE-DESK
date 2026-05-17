import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTickets, deleteTicket, updateTicket } from '../redux/ticketsSlice';
import { useNavigate } from 'react-router-dom';

const statusColors = {
  'Open': 'danger',
  'In Progress': 'warning',
  'Resolved': 'success'
};

const priorityColors = {
  'Low': 'secondary',
  'Medium': 'primary',
  'High': 'danger'
};

export default function TicketList() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { tickets, loading, pages } = useSelector(state => state.tickets);
  const { user } = useSelector(state => state.auth);

  const [page, setPage] = useState(1);
  const [filterStatus, setFilterStatus] = useState('');
  const [filterCategory, setFilterCategory] = useState('');

  useEffect(() => {
    dispatch(fetchTickets({ page, status: filterStatus, category: filterCategory }));
  }, [page, filterStatus, filterCategory]);

  const handleDelete = (id) => {
    if (window.confirm('Delete this ticket?')) dispatch(deleteTicket(id));
  };

  const handleStatusChange = (id, status) => {
    dispatch(updateTicket({ id, data: { status } }));
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4>Service Tickets</h4>
        <button className="btn btn-primary" onClick={() => navigate('/tickets/create')}>
          + New Ticket
        </button>
      </div>

      {/* Filters */}
      <div className="row mb-3 g-2">
        <div className="col-md-3">
          <select className="form-select" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
            <option value="">All Statuses</option>
            <option>Open</option>
            <option>In Progress</option>
            <option>Resolved</option>
          </select>
        </div>
        <div className="col-md-3">
          <select className="form-select" value={filterCategory} onChange={e => setFilterCategory(e.target.value)}>
            <option value="">All Categories</option>
            <option>IT</option>
            <option>HR</option>
            <option>Admin</option>
          </select>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="text-center mt-5">
          <div className="spinner-border text-primary" />
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Created By</th>
                <th>Assigned To</th>
                {(user.role === 'agent' || user.role === 'admin') && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {tickets.length === 0 ? (
                <tr><td colSpan="7" className="text-center text-muted">No tickets found</td></tr>
              ) : (
                tickets.map(ticket => (
                  <tr key={ticket._id}>
                    <td>
                     <span
                       style={{ cursor: 'pointer', color: '#0d6efd' }}
                       onClick={() => navigate(`/tickets/${ticket._id}`)}
                     >
                       {ticket.title}
                     </span>
                    </td>

                    <td>{ticket.category}</td>
                    <td>
                      <span className={`badge bg-${priorityColors[ticket.priority]}`}>
                        {ticket.priority}
                      </span>
                    </td>
                    <td>
                      <span className={`badge bg-${statusColors[ticket.status]}`}>
                        {ticket.status}
                      </span>
                    </td>
                    <td>{ticket.createdBy?.name || '—'}</td>
                    <td>{ticket.assignedTo?.name || 'Unassigned'}</td>
                    {(user.role === 'agent' || user.role === 'admin') && (
                      <td>
                        <select
                          className="form-select form-select-sm d-inline-block w-auto me-2"
                          value={ticket.status}
                          onChange={e => handleStatusChange(ticket._id, e.target.value)}
                        >
                          <option>Open</option>
                          <option>In Progress</option>
                          <option>Resolved</option>
                        </select>
                        {user.role === 'admin' && (
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleDelete(ticket._id)}
                          >
                            Delete
                          </button>
                        )}
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {pages > 1 && (
        <div className="d-flex gap-2 mt-3">
          {[...Array(pages)].map((_, i) => (
            <button
              key={i}
              className={`btn btn-sm ${page === i + 1 ? 'btn-primary' : 'btn-outline-primary'}`}
              onClick={() => setPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}