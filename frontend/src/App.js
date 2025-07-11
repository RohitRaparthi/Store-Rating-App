import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';

import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/AdminDashboard';
import UserDashboard from './pages/UserDashboard';
import StoreOwnerDashboard from './pages/StoreOwnerDashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        
        <Route path="/admin" element={
          <PrivateRoute allowedRoles={['admin']}>
            <AdminDashboard />
          </PrivateRoute>
        } />

        <Route path="/user" element={
          <PrivateRoute allowedRoles={['user']}>
            <UserDashboard />
          </PrivateRoute>
        } />

        <Route path="/store-owner" element={
          <PrivateRoute allowedRoles={['store_owner']}>
            <StoreOwnerDashboard />
          </PrivateRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;
