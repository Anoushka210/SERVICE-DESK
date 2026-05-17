import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/authSlice';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const { user } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4>Welcome, {user?.name}</h4>
          <span className="badge bg-secondary text-capitalize">{user?.role}</span>
        </div>
        <button className="btn btn-outline-danger" onClick={handleLogout}>Logout</button>
      </div>

      <div className="row g-3">
        <div className="col-md-4">
          <div className="card p-3 h-100">
            <h6>My Tickets</h6>
            <p className="text-muted small">View and track your service requests</p>
            <button className="btn btn-outline-primary mt-auto" onClick={() => navigate('/tickets')}>
              View Tickets
            </button>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card p-3 h-100">
            <h6>Raise a Request</h6>
            <p className="text-muted small">Submit a new IT, HR or Admin ticket</p>
            <button className="btn btn-primary mt-auto" onClick={() => navigate('/tickets/create')}>
              New Ticket
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}