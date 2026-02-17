import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AdminManagement.css';

const API_URL = process.env.REACT_APP_API_URL || '';

function AdminManagement() {
  const [adminInfo, setAdminInfo] = useState(null);
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'admin'
  });
  const [message, setMessage] = useState({ type: '', text: '' });
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    const info = JSON.parse(localStorage.getItem('adminInfo') || '{}');

    if (!token) {
      navigate('/admin/login');
      return;
    }

    setAdminInfo(info);

    // Only super-admins can access this page
    if (info.role !== 'super-admin') {
      navigate('/admin/dashboard');
      return;
    }

    setLoading(false);
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate
    if (!formData.username || !formData.email || !formData.password) {
      setMessage({ type: 'error', text: 'All fields are required' });
      return;
    }

    if (formData.password.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters' });
      return;
    }

    try {
      const token = localStorage.getItem('adminToken');
      await axios.post(`${API_URL}/api/admin/register`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setMessage({ type: 'success', text: 'Admin created successfully!' });
      setFormData({ username: '', email: '', password: '', role: 'admin' });
      setShowForm(false);
      
      // Refresh admins list
      setTimeout(() => {
        setMessage({ type: '', text: '' });
      }, 3000);
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.error || 'Failed to create admin' });
    }
  };

  if (loading) {
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
          <Link to="/admin/dashboard" className="admin-nav-link">
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
          <Link to="/admin/management" className="admin-nav-link active">
            🔐 Admin Management
          </Link>
          <Link to="/" className="admin-nav-link">
            🌐 View Website
          </Link>
        </nav>
      </aside>

      <main className="admin-content">
        <div className="admin-header">
          <h1>Admin Management</h1>
          <button 
            className="btn-primary"
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? '❌ Cancel' : '➕ Create Admin'}
          </button>
        </div>

        {message.text && (
          <div className={`message ${message.type}`}>
            {message.text}
          </div>
        )}

        {showForm && (
          <div className="admin-form-container">
            <form onSubmit={handleSubmit} className="admin-form">
              <h2>Create New Admin</h2>

              <div className="form-group">
                <label>Username *</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  placeholder="Enter username"
                  required
                />
              </div>

              <div className="form-group">
                <label>Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter email"
                  required
                />
              </div>

              <div className="form-group">
                <label>Password *</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter password (min 6 characters)"
                  required
                />
              </div>

              <div className="form-group">
                <label>Role</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                >
                  <option value="admin">Admin</option>
                  <option value="super-admin">Super Admin</option>
                </select>
              </div>

              <button type="submit" className="btn-save">
                💾 Create Admin
              </button>
            </form>
          </div>
        )}

        <div className="info-box">
          <h2>ℹ️ About Admin Management</h2>
          <p>Only super-admins can create new admin accounts. Each new admin will have access to the admin panel to manage players, polls, news, and history.</p>
          <ul>
            <li><strong>Super Admin:</strong> Can manage everything including creating new admins</li>
            <li><strong>Admin:</strong> Can manage players, polls, news, and history</li>
          </ul>
        </div>
      </main>
    </div>
  );
}

export default AdminManagement;
