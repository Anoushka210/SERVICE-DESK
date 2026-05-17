import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CreateTicket from './pages/CreateTicket';
import TicketList from './pages/TicketList';
import PrivateRoute from './components/PrivateRoute';
import TicketDetail from './pages/TicketDetail';
import Analytics from './pages/Analytics';
import Navbar from './components/Navbar';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={
          <PrivateRoute><Dashboard /></PrivateRoute>
        } />
        <Route path="/tickets" element={
          <PrivateRoute><TicketList /></PrivateRoute>
        } />
        <Route path="/tickets/create" element={
          <PrivateRoute><CreateTicket /></PrivateRoute>
        } />
        <Route path="/unauthorized" element={<h2 className="text-center mt-5">Access Denied</h2>} />
          <Route path="/tickets/:id" element={
            <PrivateRoute><TicketDetail /></PrivateRoute>
        } />
        <Route path="/analytics" element={
          <PrivateRoute roles={['admin', 'agent']}>
            <Analytics />
          </PrivateRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;