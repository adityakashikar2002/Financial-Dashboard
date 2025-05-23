import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { logout } from '../../services/auth';
import './Sidebar.css';
import Logo from '../../assets/icons/logo.png'; // Adjust the path to your logo

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        {/* Replace h1 with an img tag */}
        <img src={Logo} alt="Money Matters Logo" className="sidebar-logo" />
      </div>
      <nav className="sidebar-nav">
        <ul>
          <li className={location.pathname === '/' ? 'active' : ''}>
            <Link to="/">
              <i className="icon dashboard-icon"></i>
              Dashboard
            </Link>
          </li>
          <li className={location.pathname === '/transactions' ? 'active' : ''}>
            <Link to="/transactions">
              <i className="icon transactions-icon"></i>
              Transactions
            </Link>
          </li>
          <li className={location.pathname === '/profile' ? 'active' : ''}>
            <Link to="/profile">
              <i className="icon profile-icon"></i>
              Profile
            </Link>
          </li>
        </ul>
      </nav>
      <div className="sidebar-footer">
        <button onClick={handleLogout} className="logout-button">
          <i className="icon logout-icon"></i>
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;