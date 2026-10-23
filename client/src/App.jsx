import { BrowserRouter, Navigate, Routes, Route, useParams } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import CreateTicket from './pages/CreateTicket';
import SupportHome from './pages/SupportHome';
import VerifyEmail from './pages/VerifyEmail';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import { getStoredUser } from './api';

function ProtectedRoute({ children }) {
  return getStoredUser() ? children : <Navigate to='/login' replace />;
}

function DashboardRoute({ page = 'dashboard' }) {
  const { id } = useParams();

  return (
    <ProtectedRoute>
      <Dashboard initialPage={page} initialTicketId={id} />
    </ProtectedRoute>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<SupportHome />} />
        <Route path='/dashboard' element={<DashboardRoute />} />
        <Route path='/incidents' element={<DashboardRoute page='incidents' />} />
        <Route path='/incidents/:id' element={<DashboardRoute page='ticketDetail' />} />
        <Route path='/requests' element={<DashboardRoute page='requests' />} />
        <Route path='/problems' element={<DashboardRoute page='problems' />} />
        <Route path='/changes' element={<DashboardRoute page='changes' />} />
        <Route path='/catalog' element={<DashboardRoute page='catalog' />} />
        <Route path='/assets' element={<DashboardRoute page='assets' />} />
        <Route path='/kb' element={<DashboardRoute page='kb' />} />
        <Route path='/reports' element={<DashboardRoute page='reports' />} />
        <Route path='/users' element={<DashboardRoute page='users' />} />
        <Route path='/automation' element={<DashboardRoute page='automation' />} />
        <Route path='/portal' element={<DashboardRoute page='portal' />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/verify-email' element={<VerifyEmail />} />
        <Route path='/forgot-password' element={<ForgotPassword />} />
        <Route path='/reset-password' element={<ResetPassword />} />
        <Route path='/create-ticket' element={<ProtectedRoute><CreateTicket /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
