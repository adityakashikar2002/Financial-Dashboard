// // src/App.jsx
// import React, { useEffect } from 'react';
// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import { AppProvider } from './context/AppContext';
// import { isAuthenticated } from './services/auth';
// import Sidebar from './components/Sidebar/Sidebar';
// import Dashboard from './pages/Dashboard/Dashboard';
// import Transactions from './pages/Transactions/Transactions';
// import ProfilePage from './pages/Profile/ProfilePage';
// import AddEditTransaction from './pages/AddEditTransaction/AddEditTransaction';
// import Login from './pages/Login/Login';
// import './App.css';

// const PrivateRoute = ({ children }) => {
//   return isAuthenticated() ? children : <Navigate to="/login" />;
// };

// const App = () => {
//   useEffect(() => {
//     // Clear any existing auth data if the user is not authenticated
//     if (!isAuthenticated()) {
//       localStorage.removeItem('userId');
//       localStorage.removeItem('userEmail');
//     }
//   }, []);

//   return (
//     <Router>
//       <AppProvider>
//         <div className="app">
//           {isAuthenticated() && <Sidebar />}
//           <main className={`main-content ${!isAuthenticated() ? 'full-width' : ''}`}>
//             <Routes>
//               <Route path="/login" element={<Login />} />
//               <Route 
//                 path="/" 
//                 element={
//                   <PrivateRoute>
//                     <Dashboard />
//                   </PrivateRoute>
//                 } 
//               />
//               <Route 
//                 path="/transactions" 
//                 element={
//                   <PrivateRoute>
//                     <Transactions />
//                   </PrivateRoute>
//                 } 
//               />
//               <Route 
//                 path="/profile" 
//                 element={
//                   <PrivateRoute>
//                     <ProfilePage />
//                   </PrivateRoute>
//                 } 
//               />
//               <Route 
//                 path="/add-transaction" 
//                 element={
//                   <PrivateRoute>
//                     <AddEditTransaction />
//                   </PrivateRoute>
//                 } 
//               />
//               <Route 
//                 path="/edit-transaction/:id" 
//                 element={
//                   <PrivateRoute>
//                     <AddEditTransaction />
//                   </PrivateRoute>
//                 } 
//               />
//             </Routes>
//           </main>
//         </div>
//       </AppProvider>
//     </Router>
//   );
// };

// export default App;

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { isAuthenticated } from './services/auth';
import Sidebar from './components/Sidebar/Sidebar';
import Dashboard from './pages/Dashboard/Dashboard';
import Transactions from './pages/Transactions/Transactions';
import ProfilePage from './pages/Profile/ProfilePage';
import AddEditTransaction from './pages/AddEditTransaction/AddEditTransaction';
import Login from './pages/Login/Login';
import './App.css';

const PrivateRoute = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/login" replace />;
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
            <PrivateRoute>
              <AddEditTransaction />
            </PrivateRoute>
          } />
          <Route path="/edit-transaction/:id" element={
            <PrivateRoute>
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