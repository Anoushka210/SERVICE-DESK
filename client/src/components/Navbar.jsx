import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/authSlice';
import { useNavigate, Link } from 'react-router-dom';

export default function Navbar() {
  const { user } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  if (!user) return null;

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary px-4">
      <Link className="navbar-brand fw-semibold" to="/dashboard">
        ServiceDesk
      </Link>
      <div className="d-flex gap-3 ms-auto align-items-center">
        <Link className="nav-link text-white" to="/tickets">Tickets</Link>
        <Link className="nav-link text-white" to="/tickets/create">New Ticket</Link>
        {(user.role === 'admin' || user.role === 'agent') && (
          <Link className="nav-link text-white" to="/analytics">Analytics</Link>
        )}
        <span className="text-white-50 small text-capitalize">{user.name} · {user.role}</span>
        <button className="btn btn-outline-light btn-sm" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
}