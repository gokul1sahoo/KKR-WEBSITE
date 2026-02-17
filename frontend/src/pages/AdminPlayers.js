import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AdminPlayers.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function AdminPlayers() {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingPlayer, setEditingPlayer] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
      return;
    }

    fetchPlayers();
  }, [navigate]);

  const fetchPlayers = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.get(`${API_URL}/api/admin/players`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPlayers(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching players:', error);
      if (error.response?.status === 401) {
        navigate('/admin/login');
      }
    }
  };

  const handleImageUpload = async (playerId, file) => {
    if (!file) return;

    setUploadingImage(playerId);
    const formData = new FormData();
    formData.append('image', file);
    formData.append('slug', players.find(p => p._id === playerId)?.name.toLowerCase().replace(/\s+/g, '-'));

    try {
      const token = localStorage.getItem('adminToken');
      await axios.post(`${API_URL}/api/admin/players/${playerId}/upload-image`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      setMessage({ type: 'success', text: 'Image uploaded successfully!' });
      fetchPlayers();
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.error || 'Failed to upload image' });
    } finally {
      setUploadingImage(null);
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    }
  };

  const handleUpdateStats = async (playerId, stats) => {
    try {
      const token = localStorage.getItem('adminToken');
      await axios.put(`${API_URL}/api/admin/players/${playerId}/stats`, stats, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setMessage({ type: 'success', text: 'Statistics updated successfully!' });
      fetchPlayers();
      setEditingPlayer(null);
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.error || 'Failed to update statistics' });
    } finally {
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    }
  };

  const handleDeletePlayer = async (playerId) => {
    if (!window.confirm('Are you sure you want to delete this player?')) return;

    try {
      const token = localStorage.getItem('adminToken');
      await axios.delete(`${API_URL}/api/admin/players/${playerId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setMessage({ type: 'success', text: 'Player deleted successfully!' });
      fetchPlayers();
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.error || 'Failed to delete player' });
    } finally {
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    }
  };

  if (loading) {
    return <div className="loading">Loading players...</div>;
  }

  return (
    <div className="admin-dashboard">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-header">
          <h2>KKR Admin</h2>
        </div>
        <nav className="admin-nav">
          <Link to="/admin/dashboard" className="admin-nav-link">📊 Dashboard</Link>
          <Link to="/admin/players" className="admin-nav-link active">👥 Players</Link>
          <Link to="/admin/matches" className="admin-nav-link">🏏 Matches</Link>
          <Link to="/admin/cricket-matches" className="admin-nav-link">🏟️ Cricket API</Link>
          <Link to="/admin/polls" className="admin-nav-link">📊 Polls</Link>
          <Link to="/admin/news" className="admin-nav-link">📰 News</Link>
          <Link to="/admin/history" className="admin-nav-link">📚 History</Link>
          <Link to="/" className="admin-nav-link">🌐 View Website</Link>
        </nav>
      </aside>

      <main className="admin-content">
        <div className="admin-header">
          <h1>Manage Players</h1>
          <p>Upload photos, update statistics, and manage player information</p>
        </div>

        {message.text && (
          <div className={`message ${message.type}`}>
            {message.text}
          </div>
        )}

        <div className="players-grid">
          {players.map(player => (
            <div key={player._id} className="player-admin-card">
              <div className="player-image-section">
                <img 
                  src={player.profileImage || 'https://via.placeholder.com/200x250?text=' + player.name} 
                  alt={player.name}
                  className="player-admin-image"
                />
                <label className="upload-btn">
                  {uploadingImage === player._id ? 'Uploading...' : '📸 Upload Photo'}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(player._id, e.target.files[0])}
                    disabled={uploadingImage === player._id}
                  />
                </label>
              </div>

              <div className="player-info-section">
                <h3>{player.name}</h3>
                <p className="player-role">{player.role} • #{player.jerseyNumber}</p>

                {editingPlayer === player._id ? (
                  <div className="stats-edit-form">
                    <input
                      type="number"
                      placeholder="Matches"
                      defaultValue={player.statistics?.matches}
                      id={`matches-${player._id}`}
                    />
                    <input
                      type="number"
                      placeholder="Runs"
                      defaultValue={player.statistics?.runs}
                      id={`runs-${player._id}`}
                    />
                    <input
                      type="number"
                      step="0.01"
                      placeholder="Strike Rate"
                      defaultValue={player.statistics?.strikeRate}
                      id={`sr-${player._id}`}
                    />
                    <input
                      type="number"
                      placeholder="Wickets"
                      defaultValue={player.statistics?.wickets}
                      id={`wickets-${player._id}`}
                    />
                    <input
                      type="number"
                      step="0.01"
                      placeholder="Economy"
                      defaultValue={player.statistics?.economy}
                      id={`economy-${player._id}`}
                    />
                    <div className="stats-edit-buttons">
                      <button 
                        className="btn-save"
                        onClick={() => handleUpdateStats(player._id, {
                          matches: parseInt(document.getElementById(`matches-${player._id}`).value),
                          runs: parseInt(document.getElementById(`runs-${player._id}`).value),
                          strikeRate: parseFloat(document.getElementById(`sr-${player._id}`).value),
                          wickets: parseInt(document.getElementById(`wickets-${player._id}`).value),
                          economy: parseFloat(document.getElementById(`economy-${player._id}`).value)
                        })}
                      >
                        💾 Save
                      </button>
                      <button 
                        className="btn-cancel"
                        onClick={() => setEditingPlayer(null)}
                      >
                        ❌ Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="player-stats">
                      <div className="stat-item">
                        <strong>Matches:</strong> {player.statistics?.matches || 0}
                      </div>
                      <div className="stat-item">
                        <strong>Runs:</strong> {player.statistics?.runs || 0}
                      </div>
                      {player.statistics?.strikeRate && (
                        <div className="stat-item">
                          <strong>SR:</strong> {player.statistics.strikeRate}
                        </div>
                      )}
                      {player.statistics?.wickets > 0 && (
                        <div className="stat-item">
                          <strong>Wickets:</strong> {player.statistics.wickets}
                        </div>
                      )}
                    </div>

                    <div className="player-actions">
                      <button 
                        className="btn-edit"
                        onClick={() => setEditingPlayer(player._id)}
                      >
                        ✏️ Edit Stats
                      </button>
                      <button 
                        className="btn-delete"
                        onClick={() => handleDeletePlayer(player._id)}
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default AdminPlayers;
