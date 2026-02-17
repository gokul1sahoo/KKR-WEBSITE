import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AdminNews.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function AdminNews() {
  const [newsList, setNewsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    image: null,
    publishedAt: new Date().toISOString().split('T')[0]
  });
  const [message, setMessage] = useState({ type: '', text: '' });
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
      return;
    }

    fetchNews();
  }, [navigate]);

  const fetchNews = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.get(`${API_URL}/api/admin/news`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNewsList(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching news:', error);
      if (error.response?.status === 401) {
        navigate('/admin/login');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const submitData = new FormData();
    submitData.append('title', formData.title);
    submitData.append('content', formData.content);
    submitData.append('publishedAt', formData.publishedAt);
    if (formData.image) {
      submitData.append('image', formData.image);
    }

    try {
      const token = localStorage.getItem('adminToken');

      if (editingId) {
        await axios.put(`${API_URL}/api/admin/news/${editingId}`, submitData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });
        setMessage({ type: 'success', text: 'News updated successfully!' });
      } else {
        await axios.post(`${API_URL}/api/admin/news`, submitData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });
        setMessage({ type: 'success', text: 'News created successfully!' });
      }

      fetchNews();
      setFormData({ title: '', content: '', image: null, publishedAt: new Date().toISOString().split('T')[0] });
      setShowForm(false);
      setEditingId(null);
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.error || 'Failed to save news' });
    } finally {
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    }
  };

  const handleDeleteNews = async (newsId) => {
    if (!window.confirm('Are you sure you want to delete this news?')) return;

    try {
      const token = localStorage.getItem('adminToken');
      await axios.delete(`${API_URL}/api/admin/news/${newsId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setMessage({ type: 'success', text: 'News deleted successfully!' });
      fetchNews();
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.error || 'Failed to delete news' });
    } finally {
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    }
  };

  const handleEditNews = (news) => {
    setFormData({
      title: news.title,
      content: news.content,
      image: null,
      publishedAt: news.publishedAt ? news.publishedAt.split('T')[0] : new Date().toISOString().split('T')[0]
    });
    setEditingId(news._id);
    setShowForm(true);
  };

  if (loading) {
    return <div className="loading">Loading news...</div>;
  }

  return (
    <div className="admin-dashboard">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-header">
          <h2>KKR Admin</h2>
        </div>
        <nav className="admin-nav">
          <Link to="/admin/dashboard" className="admin-nav-link">📊 Dashboard</Link>
          <Link to="/admin/players" className="admin-nav-link">👥 Players</Link>
          <Link to="/admin/matches" className="admin-nav-link">🏏 Matches</Link>
          <Link to="/admin/cricket-matches" className="admin-nav-link">🏟️ Cricket API</Link>
          <Link to="/admin/polls" className="admin-nav-link">📊 Polls</Link>
          <Link to="/admin/news" className="admin-nav-link active">📰 News</Link>
          <Link to="/admin/history" className="admin-nav-link">📚 History</Link>
          <Link to="/" className="admin-nav-link">🌐 View Website</Link>
        </nav>
      </aside>

      <main className="admin-content">
        <div className="admin-header">
          <h1>Manage News</h1>
          <button 
            className="btn-primary"
            onClick={() => {
              setShowForm(!showForm);
              setEditingId(null);
              setFormData({ title: '', content: '', image: null, publishedAt: new Date().toISOString().split('T')[0] });
            }}
          >
            {showForm ? '❌ Cancel' : '➕ Add News'}
          </button>
        </div>

        {message.text && (
          <div className={`message ${message.type}`}>
            {message.text}
          </div>
        )}

        {showForm && (
          <div className="news-form-container">
            <form onSubmit={handleSubmit} className="news-form">
              <div className="form-group">
                <label>Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  placeholder="Enter news title"
                />
              </div>

              <div className="form-group">
                <label>Content *</label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  required
                  placeholder="Enter news content"
                  rows="8"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setFormData({ ...formData, image: e.target.files[0] })}
                  />
                </div>

                <div className="form-group">
                  <label>Publish Date *</label>
                  <input
                    type="date"
                    value={formData.publishedAt}
                    onChange={(e) => setFormData({ ...formData, publishedAt: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="form-actions">
                <button type="submit" className="btn-save">
                  💾 {editingId ? 'Update News' : 'Create News'}
                </button>
                <button 
                  type="button" 
                  className="btn-cancel"
                  onClick={() => {
                    setShowForm(false);
                    setEditingId(null);
                  }}
                >
                  ❌ Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="news-list">
          <h2>All News ({newsList.length})</h2>
          {newsList.length === 0 ? (
            <p className="no-data">No news articles yet</p>
          ) : (
            newsList.map(news => (
              <div key={news._id} className="news-item">
                {news.image && (
                  <img src={news.image} alt={news.title} className="news-thumbnail" />
                )}
                <div className="news-content">
                  <h3>{news.title}</h3>
                  <p className="news-date">📅 {new Date(news.publishedAt).toLocaleDateString()}</p>
                  <p className="news-excerpt">{news.content.substring(0, 150)}...</p>
                  <div className="news-actions">
                    <button 
                      className="btn-edit"
                      onClick={() => handleEditNews(news)}
                    >
                      ✏️ Edit
                    </button>
                    <button 
                      className="btn-delete"
                      onClick={() => handleDeleteNews(news._id)}
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}

export default AdminNews;
