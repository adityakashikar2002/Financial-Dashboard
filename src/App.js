// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { isAuthenticated, isAdmin } from './services/auth';
import Sidebar from './components/Sidebar/Sidebar';
import Dashboard from './pages/Dashboard/Dashboard';
import Transactions from './pages/Transactions/Transactions';
import ProfilePage from './pages/Profile/ProfilePage';
import AddEditTransaction from './pages/AddEditTransaction/AddEditTransaction';
import Login from './pages/Login/Login';
import './App.css';

const PrivateRoute = ({ children, adminOnly = false }) => {
  if (!isAuthenticated()) return <Navigate to="/login" replace />;
  if (adminOnly && !isAdmin()) return <Navigate to="/" replace />;
  return children;
};

const PublicRoute = ({ children }) => {
  return !isAuthenticated() ? children : <Navigate to="/" replace />;
};

const AppLayout = () => {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';

  return (
    <div className="app">
      {!isLoginPage && isAuthenticated() && <Sidebar />}
      <main className={`main-content ${isLoginPage ? 'full-width' : ''}`}>
        <Routes>
          <Route path="/login" element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          } />
          <Route path="/" element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          } />
          <Route path="/transactions" element={
            <PrivateRoute>
              <Transactions />
            </PrivateRoute>
          } />
          <Route path="/profile" element={
            <PrivateRoute>
              <ProfilePage />
            </PrivateRoute>
          } />
          <Route path="/add-transaction" element={
            <PrivateRoute adminOnly={false}>
              <AddEditTransaction />
            </PrivateRoute>
          } />
          <Route path="/edit-transaction/:id" element={
            <PrivateRoute adminOnly={false}>
              <AddEditTransaction />
            </PrivateRoute>
          } />
        </Routes>
      </main>
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <AppProvider>
        <AppLayout />
      </AppProvider>
    </Router>
  );
};

export default App;