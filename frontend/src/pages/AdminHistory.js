import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminHistory.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const AdminHistory = () => {
  const [history, setHistory] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    year: new Date().getFullYear(),
    image: null
  });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const token = localStorage.getItem('adminToken');

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/admin/history`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setHistory(response.data);
    } catch (error) {
      console.error('Error fetching history:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleImageChange = (e) => {
    setFormData({
      ...formData,
      image: e.target.files[0]
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();
      data.append('title', formData.title);
      data.append('description', formData.description);
      data.append('year', formData.year);
      if (formData.image) {
        data.append('image', formData.image);
      }

      if (editingId) {
        await axios.put(`${API_URL}/api/admin/history/${editingId}`, data, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });
        setMessage('History updated successfully!');
      } else {
        await axios.post(`${API_URL}/api/admin/history`, data, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });
        setMessage('History created successfully!');
      }

      setFormData({
        title: '',
        description: '',
        year: new Date().getFullYear(),
        image: null
      });
      setEditingId(null);
      fetchHistory();
    } catch (error) {
      setMessage('Error: ' + error.response?.data?.error || error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item) => {
    setFormData({
      title: item.title,
      description: item.description,
      year: item.year,
      image: null
    });
    setEditingId(item._id);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this history record?')) {
      try {
        await axios.delete(`${API_URL}/api/admin/history/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMessage('History deleted successfully!');
        fetchHistory();
      } catch (error) {
        setMessage('Error deleting history: ' + error.message);
      }
    }
  };

  const handleCancel = () => {
    setFormData({
      title: '',
      description: '',
      year: new Date().getFullYear(),
      image: null
    });
    setEditingId(null);
  };

  return (
    <div className="admin-history">
      <h1>Manage History</h1>

      {message && (
        <div className={`message ${message.includes('Error') ? 'error' : 'success'}`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="history-form">
        <h2>{editingId ? 'Edit History' : 'Add New History'}</h2>

        <div className="form-group">
          <label>Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            required
            placeholder="Enter history title"
          />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            required
            placeholder="Enter history description"
            rows="5"
          />
        </div>

        <div className="form-group">
          <label>Year</label>
          <input
            type="number"
            name="year"
            value={formData.year}
            onChange={handleInputChange}
            min="2000"
            max={new Date().getFullYear()}
          />
        </div>

        <div className="form-group">
          <label>Upload Image</label>
          <input
            type="file"
            onChange={handleImageChange}
            accept="image/*"
          />
        </div>

        <div className="form-buttons">
          <button type="submit" disabled={loading} className="btn-submit">
            {loading ? 'Saving...' : (editingId ? 'Update' : 'Create')}
          </button>
          {editingId && (
            <button type="button" onClick={handleCancel} className="btn-cancel">
              Cancel
            </button>
          )}
        </div>
      </form>

      <section className="history-list">
        <h2>History Records</h2>
        {history.length > 0 ? (
          <div className="history-grid">
            {history.map(item => (
              <div key={item._id} className="history-card">
                {item.image && (
                  <img src={item.image} alt={item.title} className="history-image" />
                )}
                <div className="history-content">
                  <h3>{item.title}</h3>
                  <p className="year">Year: {item.year}</p>
                  <p className="description">{item.description.substring(0, 100)}...</p>
                  <div className="card-actions">
                    <button onClick={() => handleEdit(item)} className="btn-edit">Edit</button>
                    <button onClick={() => handleDelete(item._id)} className="btn-delete">Delete</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="no-data">No history records yet</p>
        )}
      </section>
    </div>
  );
};

export default AdminHistory;
