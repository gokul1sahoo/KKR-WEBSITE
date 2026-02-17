import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AdminMatches.css';

const API_URL = process.env.REACT_APP_API_URL || '';

const AdminMatches = () => {
  const [matches, setMatches] = useState([]);
  const [teams, setTeams] = useState([]);
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [formData, setFormData] = useState({
    matchNumber: '',
    date: '',
    venue: '',
    homeTeam: '',
    homeTeamName: '',
    awayTeam: '',
    awayTeamName: '',
    homeTeamScore: '',
    awayTeamScore: '',
    result: '',
    winnerTeamId: '',
    status: 'Upcoming',
    highlights: '',
    liveScoreUrl: '',
    manOfMatch: '',
    manOfMatchName: '',
    description: ''
  });

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
      return;
    }

    fetchMatches();
    fetchTeams();
    fetchPlayers();
  }, [navigate]);

  const fetchMatches = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.get(`${API_URL}/api/admin/matches`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMatches(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching matches:', error);
      if (error.response?.status === 401) {
        navigate('/admin/login');
      }
    }
  };

  const fetchTeams = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/team`);
      setTeams(response.data || []);
    } catch (error) {
      console.error('Error fetching teams:', error);
    }
  };

  const fetchPlayers = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/players`);
      setPlayers(response.data || []);
    } catch (error) {
      console.error('Error fetching players:', error);
    }
  };

  const formatDateTimeInput = (dateValue) => {
    if (!dateValue) return '';
    return new Date(dateValue).toISOString().slice(0, 16);
  };

  const resetForm = () => {
    setFormData({
      matchNumber: '',
      date: '',
      venue: '',
      homeTeam: '',
      homeTeamName: '',
      awayTeam: '',
      awayTeamName: '',
      homeTeamScore: '',
      awayTeamScore: '',
      result: '',
      winnerTeamId: '',
      status: 'Upcoming',
      highlights: '',
      liveScoreUrl: '',
      manOfMatch: '',
      manOfMatchName: '',
      description: ''
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const hasHomeTeam = formData.homeTeam || formData.homeTeamName.trim();
    const hasAwayTeam = formData.awayTeam || formData.awayTeamName.trim();
    if (formData.homeTeam && formData.awayTeam && formData.homeTeam === formData.awayTeam) {
      setMessage({ type: 'error', text: 'Home Team and Away Team cannot be the same.' });
      return;
    }

    const toNumber = (value) => (value === '' ? undefined : Number(value));

    const submitData = {
      matchNumber: toNumber(formData.matchNumber),
      date: formData.date || undefined,
      venue: formData.venue || undefined,
      homeTeam: formData.homeTeamName.trim() ? undefined : formData.homeTeam,
      homeTeamName: formData.homeTeamName.trim() || undefined,
      awayTeam: formData.awayTeamName.trim() ? undefined : formData.awayTeam,
      awayTeamName: formData.awayTeamName.trim() || undefined,
      homeTeamScore: toNumber(formData.homeTeamScore),
      awayTeamScore: toNumber(formData.awayTeamScore),
      result: formData.result || undefined,
      winnerTeamId: formData.winnerTeamId || undefined,
      status: formData.status,
      highlights: formData.highlights || undefined,
      liveScoreUrl: formData.liveScoreUrl || undefined,
      manOfMatch: formData.manOfMatchName.trim() ? undefined : formData.manOfMatch,
      manOfMatchName: formData.manOfMatchName.trim() || undefined,
      description: formData.description || undefined
    };

    try {
      const token = localStorage.getItem('adminToken');

      if (editingId) {
        await axios.put(`${API_URL}/api/admin/matches/${editingId}`, submitData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMessage({ type: 'success', text: 'Match updated successfully!' });
      } else {
        await axios.post(`${API_URL}/api/admin/matches`, submitData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMessage({ type: 'success', text: 'Match created successfully!' });
      }

      fetchMatches();
      resetForm();
      setShowForm(false);
      setEditingId(null);
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.error || 'Failed to save match' });
    } finally {
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    }
  };

  const handleEdit = (match) => {
    setFormData({
      matchNumber: match.matchNumber ?? '',
      date: formatDateTimeInput(match.date),
      venue: match.venue || '',
      homeTeam: match.homeTeam?._id || '',
      homeTeamName: match.homeTeamName || '',
      awayTeam: match.awayTeam?._id || '',
      awayTeamName: match.awayTeamName || '',
      homeTeamScore: match.homeTeamScore ?? '',
      awayTeamScore: match.awayTeamScore ?? '',
      result: match.result || '',
      winnerTeamId: match.winnerTeamId?._id || '',
      status: match.status || 'Upcoming',
      highlights: match.highlights || '',
      liveScoreUrl: match.liveScoreUrl || '',
      manOfMatch: match.manOfMatch?._id || '',
      manOfMatchName: match.manOfMatchName || '',
      description: match.description || ''
    });
    setEditingId(match._id);
    setShowForm(true);
  };

  const handleDelete = async (matchId) => {
    if (!window.confirm('Are you sure you want to delete this match?')) return;

    try {
      const token = localStorage.getItem('adminToken');
      await axios.delete(`${API_URL}/api/admin/matches/${matchId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setMessage({ type: 'success', text: 'Match deleted successfully!' });
      fetchMatches();
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.error || 'Failed to delete match' });
    } finally {
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    }
  };

  if (loading) {
    return <div className="loading">Loading matches...</div>;
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
          <Link to="/admin/matches" className="admin-nav-link active">🏏 Matches</Link>
          <Link to="/admin/cricket-matches" className="admin-nav-link">🏟️ Cricket API</Link>
          <Link to="/admin/polls" className="admin-nav-link">📊 Polls</Link>
          <Link to="/admin/news" className="admin-nav-link">📰 News</Link>
          <Link to="/admin/history" className="admin-nav-link">📚 History</Link>
          <Link to="/" className="admin-nav-link">🌐 View Website</Link>
        </nav>
      </aside>

      <main className="admin-content">
        <div className="admin-header">
          <h1>Manage Matches</h1>
          <button
            className="btn-primary"
            onClick={() => {
              setShowForm(!showForm);
              setEditingId(null);
              resetForm();
            }}
          >
            {showForm ? '❌ Cancel' : '➕ Create Match'}
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
              <div className="form-row">
                <div className="form-group">
                  <label>Match Number</label>
                  <input
                    type="number"
                    value={formData.matchNumber}
                    onChange={(e) => setFormData({ ...formData, matchNumber: e.target.value })}
                    placeholder="Match number"
                  />
                </div>
                <div className="form-group">
                  <label>Date & Time *</label>
                  <input
                    type="datetime-local"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Status *</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  >
                    <option value="Upcoming">Upcoming</option>
                    <option value="Live">Live</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Home Team *</label>
                  <input
                    type="text"
                    value={formData.homeTeamName}
                    onChange={(e) => setFormData({
                      ...formData,
                      homeTeamName: e.target.value,
                      homeTeam: ''
                    })}
                    placeholder="Enter home team name"
                  />
                  <span className="helper-text">Or select from the list below</span>
                  <select
                    value={formData.homeTeam}
                    onChange={(e) => setFormData({
                      ...formData,
                      homeTeam: e.target.value,
                      homeTeamName: ''
                    })}
                  >
                    <option value="">Select home team</option>
                    {teams.map(team => (
                      <option key={team._id} value={team._id}>{team.name}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Away Team *</label>
                  <input
                    type="text"
                    value={formData.awayTeamName}
                    onChange={(e) => setFormData({
                      ...formData,
                      awayTeamName: e.target.value,
                      awayTeam: ''
                    })}
                    placeholder="Enter away team name"
                  />
                  <span className="helper-text">Or select from the list below</span>
                  <select
                    value={formData.awayTeam}
                    onChange={(e) => setFormData({
                      ...formData,
                      awayTeam: e.target.value,
                      awayTeamName: ''
                    })}
                  >
                    <option value="">Select away team</option>
                    {teams.map(team => (
                      <option key={team._id} value={team._id}>{team.name}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Venue</label>
                  <input
                    type="text"
                    value={formData.venue}
                    onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                    placeholder="Enter venue"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Home Team Score</label>
                  <input
                    type="number"
                    value={formData.homeTeamScore}
                    onChange={(e) => setFormData({ ...formData, homeTeamScore: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Away Team Score</label>
                  <input
                    type="number"
                    value={formData.awayTeamScore}
                    onChange={(e) => setFormData({ ...formData, awayTeamScore: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Winner Team</label>
                  <select
                    value={formData.winnerTeamId}
                    onChange={(e) => setFormData({ ...formData, winnerTeamId: e.target.value })}
                  >
                    <option value="">Select winner</option>
                    {teams.map(team => (
                      <option key={team._id} value={team._id}>{team.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Man of the Match</label>
                  <input
                    type="text"
                    value={formData.manOfMatchName}
                    onChange={(e) => setFormData({
                      ...formData,
                      manOfMatchName: e.target.value,
                      manOfMatch: ''
                    })}
                    placeholder="Enter player name"
                  />
                  <span className="helper-text">Or select from the list below</span>
                  <select
                    value={formData.manOfMatch}
                    onChange={(e) => setFormData({
                      ...formData,
                      manOfMatch: e.target.value,
                      manOfMatchName: ''
                    })}
                  >
                    <option value="">Select player</option>
                    {players.map(player => (
                      <option key={player._id} value={player._id}>{player.name}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Result</label>
                  <input
                    type="text"
                    value={formData.result}
                    onChange={(e) => setFormData({ ...formData, result: e.target.value })}
                    placeholder="Match result"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Live Score / Result URL (optional)</label>
                <input
                  type="url"
                  value={formData.liveScoreUrl}
                  onChange={(e) => setFormData({ ...formData, liveScoreUrl: e.target.value })}
                  placeholder="https://example.com/live-score"
                />
              </div>

              <div className="form-group">
                <label>Highlights</label>
                <textarea
                  value={formData.highlights}
                  onChange={(e) => setFormData({ ...formData, highlights: e.target.value })}
                  rows="3"
                  placeholder="Key highlights"
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows="4"
                  placeholder="Match description"
                />
              </div>

              <div className="form-actions">
                <button type="submit" className="btn-save">
                  💾 {editingId ? 'Update Match' : 'Create Match'}
                </button>
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => {
                    setShowForm(false);
                    setEditingId(null);
                    resetForm();
                  }}
                >
                  ❌ Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="matches-list">
          <h2>All Matches ({matches.length})</h2>
          {matches.length === 0 ? (
            <p className="no-data">No matches created yet</p>
          ) : (
            matches.map(match => (
              <div key={match._id} className="match-item">
                <div className="match-info">
                  <h3>
                    {match.homeTeam?.name || match.homeTeamName || 'Home'} vs {match.awayTeam?.name || match.awayTeamName || 'Away'}
                  </h3>
                  <p className="match-meta">
                    📅 {match.date ? new Date(match.date).toLocaleString() : 'TBD'} ·
                    📍 {match.venue || 'Venue TBD'} ·
                    🟣 {match.status}
                  </p>
                  {match.result && <p className="match-result">Result: {match.result}</p>}
                  {match.liveScoreUrl && (
                    <a
                      className="match-link"
                      href={match.liveScoreUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      🔗 Live score / result link
                    </a>
                  )}
                </div>
                <div className="match-actions">
                  <button className="btn-edit" onClick={() => handleEdit(match)}>
                    ✏️ Edit
                  </button>
                  <button className="btn-delete" onClick={() => handleDelete(match._id)}>
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
};

export default AdminMatches;
