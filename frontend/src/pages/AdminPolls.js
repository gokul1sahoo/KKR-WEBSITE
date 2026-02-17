import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AdminPolls.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function AdminPolls() {
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    question: '',
    options: ['', ''],
    endDate: ''
  });
  const [message, setMessage] = useState({ type: '', text: '' });
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
      return;
    }

    fetchPolls();
  }, [navigate]);

  const fetchPolls = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.get(`${API_URL}/api/admin/polls`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPolls(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching polls:', error);
      if (error.response?.status === 401) {
        navigate('/admin/login');
      }
    }
  };

  const handleAddOption = () => {
    setFormData({
      ...formData,
      options: [...formData.options, '']
    });
  };

  const handleRemoveOption = (index) => {
    const newOptions = formData.options.filter((_, i) => i !== index);
    setFormData({ ...formData, options: newOptions });
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...formData.options];
    newOptions[index] = value;
    setFormData({ ...formData, options: newOptions });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Filter out empty options
    const filteredOptions = formData.options.filter(opt => opt.trim() !== '');

    if (filteredOptions.length < 2) {
      setMessage({ type: 'error', text: 'At least 2 options are required!' });
      return;
    }

    const submitData = {
      question: formData.question,
      options: filteredOptions.map(opt => ({ text: opt, votes: 0 })),
      endDate: formData.endDate
    };

    try {
      const token = localStorage.getItem('adminToken');

      if (editingId) {
        await axios.put(`${API_URL}/api/admin/polls/${editingId}`, submitData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMessage({ type: 'success', text: 'Poll updated successfully!' });
      } else {
        await axios.post(`${API_URL}/api/admin/polls`, submitData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMessage({ type: 'success', text: 'Poll created successfully!' });
      }

      fetchPolls();
      setFormData({ question: '', options: ['', ''], endDate: '' });
      setShowForm(false);
      setEditingId(null);
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.error || 'Failed to save poll' });
    } finally {
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    }
  };

  const handleDeletePoll = async (pollId) => {
    if (!window.confirm('Are you sure you want to delete this poll?')) return;

    try {
      const token = localStorage.getItem('adminToken');
      await axios.delete(`${API_URL}/api/admin/polls/${pollId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setMessage({ type: 'success', text: 'Poll deleted successfully!' });
      fetchPolls();
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.error || 'Failed to delete poll' });
    } finally {
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    }
  };

  const handleResetVotes = async (pollId) => {
    if (!window.confirm('Reset all votes for this poll?')) return;

    try {
      const token = localStorage.getItem('adminToken');
      await axios.put(`${API_URL}/api/admin/polls/${pollId}/reset-votes`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setMessage({ type: 'success', text: 'Poll votes reset!' });
      fetchPolls();
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to reset votes' });
    } finally {
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    }
  };

  if (loading) {
    return <div className="loading">Loading polls...</div>;
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
          <Link to="/admin/polls" className="admin-nav-link active">📊 Polls</Link>
          <Link to="/admin/news" className="admin-nav-link">📰 News</Link>
          <Link to="/admin/history" className="admin-nav-link">📚 History</Link>
          <Link to="/" className="admin-nav-link">🌐 View Website</Link>
        </nav>
      </aside>

      <main className="admin-content">
        <div className="admin-header">
          <h1>Manage Polls</h1>
          <button 
            className="btn-primary"
            onClick={() => {
              setShowForm(!showForm);
              setEditingId(null);
              setFormData({ question: '', options: ['', ''], endDate: '' });
            }}
          >
            {showForm ? '❌ Cancel' : '➕ Create Poll'}
          </button>
        </div>

        {message.text && (
          <div className={`message ${message.type}`}>
            {message.text}
          </div>
        )}

        {showForm && (
          <div className="poll-form-container">
            <form onSubmit={handleSubmit} className="poll-form">
              <div className="form-group">
                <label>Question *</label>
                <input
                  type="text"
                  value={formData.question}
                  onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                  required
                  placeholder="Enter poll question"
                />
              </div>

              <div className="form-group">
                <label>Options *</label>
                <div className="options-list">
                  {formData.options.map((option, index) => (
                    <div key={index} className="option-input">
                      <input
                        type="text"
                        value={option}
                        onChange={(e) => handleOptionChange(index, e.target.value)}
                        placeholder={`Option ${index + 1}`}
                      />
                      {formData.options.length > 2 && (
                        <button
                          type="button"
                          className="btn-remove-option"
                          onClick={() => handleRemoveOption(index)}
                        >
                          ❌
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  className="btn-add-option"
                  onClick={handleAddOption}
                >
                  ➕ Add Option
                </button>
              </div>

              <div className="form-group">
                <label>End Date</label>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                />
              </div>

              <div className="form-actions">
                <button type="submit" className="btn-save">
                  💾 {editingId ? 'Update Poll' : 'Create Poll'}
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

        <div className="polls-list">
          <h2>All Polls ({polls.length})</h2>
          {polls.length === 0 ? (
            <p className="no-data">No polls yet</p>
          ) : (
            polls.map(poll => (
              <div key={poll._id} className="poll-item">
                <div className="poll-content">
                  <h3>{poll.question}</h3>
                  <div className="poll-options">
                    {poll.options.map((option, index) => (
                      <div key={index} className="poll-option">
                        <span className="option-text">{option.text}</span>
                        <span className="option-votes">{option.votes} votes</span>
                      </div>
                    ))}
                  </div>
                  <p className="poll-total">Total votes: {poll.totalVotes}</p>
                  {poll.endDate && (
                    <p className="poll-date">Ends: {new Date(poll.endDate).toLocaleDateString()}</p>
                  )}
                </div>
                <div className="poll-actions">
                  <button 
                    className="btn-reset"
                    onClick={() => handleResetVotes(poll._id)}
                  >
                    🔄 Reset
                  </button>
                  <button 
                    className="btn-delete"
                    onClick={() => handleDeletePoll(poll._id)}
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}

export default AdminPolls;
