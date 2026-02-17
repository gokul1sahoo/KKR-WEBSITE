import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AdminDashboard.css';

const API_URL = process.env.REACT_APP_API_URL || '';

function AdminDashboard() {
  const [adminInfo, setAdminInfo] = useState(null);
  const [stats, setStats] = useState({ players: 0, polls: 0, news: 0 });
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    const info = JSON.parse(localStorage.getItem('adminInfo') || '{}');

    if (!token) {
      navigate('/admin/login');
      return;
    }

    setAdminInfo(info);
    fetchStats(token);
  }, [navigate]);

  const fetchStats = async (token) => {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      
      const [playersRes, pollsRes, newsRes] = await Promise.all([
        axios.get(`${API_URL}/api/admin/players`, { headers }),
        axios.get(`${API_URL}/api/admin/polls`, { headers }),
        axios.get(`${API_URL}/api/admin/news`, { headers })
      ]);

      setStats({
        players: playersRes.data.length,
        polls: pollsRes.data.length,
        news: newsRes.data.length
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
      if (error.response?.status === 401) {
        handleLogout();
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminInfo');
    navigate('/admin/login');
  };

  if (!adminInfo) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="admin-dashboard">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-header">
          <h2>KKR Admin</h2>
          <p className="admin-role">{adminInfo.role}</p>
        </div>

        <nav className="admin-nav">
          <Link to="/admin/dashboard" className="admin-nav-link active">
            📊 Dashboard
          </Link>
          <Link to="/admin/players" className="admin-nav-link">
            👥 Players
          </Link>
          <Link to="/admin/matches" className="admin-nav-link">
            🏏 Matches
          </Link>
          <Link to="/admin/cricket-matches" className="admin-nav-link">
            🏟️ Cricket API
          </Link>
          <Link to="/admin/polls" className="admin-nav-link">
            📊 Polls
          </Link>
          <Link to="/admin/news" className="admin-nav-link">
            📰 News
          </Link>
          <Link to="/admin/history" className="admin-nav-link">
            📚 History
          </Link>
          {adminInfo?.role === 'super-admin' && (
            <Link to="/admin/management" className="admin-nav-link">
              🔐 Admin Management
            </Link>
          )}
          <Link to="/" className="admin-nav-link">
            🌐 View Website
          </Link>
        </nav>

        <Link to="/" className="view-website-btn">
          🌐 View Website
        </Link>

        <button onClick={handleLogout} className="logout-button">
          🚪 Logout
        </button>
      </aside>

      <main className="admin-content">
        <div className="admin-header">
          <h1>Dashboard</h1>
          <p>Welcome back, <strong>{adminInfo.username}</strong></p>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">👥</div>
            <div className="stat-content">
              <h3>{stats.players}</h3>
              <p>Total Players</p>
            </div>
            <Link to="/admin/players" className="stat-link">Manage →</Link>
          </div>

          <div className="stat-card">
            <div className="stat-icon">📊</div>
            <div className="stat-content">
              <h3>{stats.polls}</h3>
              <p>Active Polls</p>
            </div>
            <Link to="/admin/polls" className="stat-link">Manage →</Link>
          </div>

          <div className="stat-card">
            <div className="stat-icon">📰</div>
            <div className="stat-content">
              <h3>{stats.news}</h3>
              <p>News Articles</p>
            </div>
            <Link to="/admin/news" className="stat-link">Manage →</Link>
          </div>
        </div>

        <div className="quick-actions">
          <h2>Quick Actions</h2>
          <div className="action-buttons">
            <Link to="/admin/players?action=add" className="action-btn">
              ➕ Add Player
            </Link>
            <Link to="/admin/matches?action=add" className="action-btn">
              ➕ Add Match
            </Link>
            <Link to="/admin/polls?action=add" className="action-btn">
              ➕ Create Poll
            </Link>
            <Link to="/admin/news?action=add" className="action-btn">
              ➕ Post News
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

export default AdminDashboard;
