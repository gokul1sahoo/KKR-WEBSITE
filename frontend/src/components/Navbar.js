import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import '../styles/navbar.css';

const Navbar = () => {
  const [userToken, setUserToken] = useState(null);
  const [adminToken, setAdminToken] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const syncAuthState = () => {
      // Check for user token
      const token = localStorage.getItem('userToken');
      const user = localStorage.getItem('userInfo');
      setUserToken(token);
      if (user) {
        try {
          setUserInfo(JSON.parse(user));
        } catch {
          setUserInfo(null);
        }
      } else {
        setUserInfo(null);
      }

      // Check for admin token
      const adminTok = localStorage.getItem('adminToken');
      setAdminToken(adminTok);
    };

    syncAuthState();

    const handleStorage = () => syncAuthState();
    window.addEventListener('storage', handleStorage);
    window.addEventListener('authChanged', handleStorage);

    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('authChanged', handleStorage);
    };
  }, [location.pathname]);

  const handleUserLogout = () => {
    localStorage.removeItem('userToken');
    localStorage.removeItem('userInfo');
    setUserToken(null);
    setUserInfo(null);
    navigate('/');
  };

  const handleAdminLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminInfo');
    setAdminToken(null);
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <img src="/images/kkr-logo.jpg" alt="KKR Logo" className="logo-img" />
          Kolkata Knight Riders
        </Link>
        
        <div className="nav-menu">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/players" className="nav-link">Players</Link>
          <Link to="/matches" className="nav-link">Matches</Link>
          <Link to="/news" className="nav-link">News</Link>
          <Link to="/history" className="nav-link">History</Link>
          <Link to="/polls" className="nav-link">Polls</Link>
          <Link to="/about" className="nav-link">About</Link>
        </div>

        <div className="navbar-auth">
          {adminToken ? (
            <>
              <Link to="/admin/dashboard" className="auth-btn admin-btn">Admin Panel</Link>
              {location.pathname !== '/' && (
                <button className="logout-btn" onClick={handleAdminLogout}>Logout</button>
              )}
            </>
          ) : (
            <Link to="/admin/login" className="auth-btn admin-btn">Admin</Link>
          )}

          {userToken ? (
            <>
              <span className="auth-label">{userInfo?.username}</span>
              {location.pathname !== '/' && (
                <button className="logout-btn" onClick={handleUserLogout}>Logout</button>
              )}
            </>
          ) : null}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
