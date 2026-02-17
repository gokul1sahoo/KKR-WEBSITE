import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AdminCricketMatches.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const AdminCricketMatches = () => {
  const [apiMatches, setApiMatches] = useState([]);
  const [publishedIds, setPublishedIds] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [filterStatus, setFilterStatus] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
      return;
    }

    fetchMatches();
  }, [navigate]);

  const fetchMatches = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      const [apiResponse, adminMatches] = await Promise.all([
        axios.get(`${API_URL}/api/admin/cricket-matches`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`${API_URL}/api/admin/matches`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      const externalIds = new Set(
        (adminMatches.data || [])
          .filter(match => match.source === 'cricapi' && match.externalMatchId)
          .map(match => String(match.externalMatchId))
      );

      setPublishedIds(externalIds);
      setApiMatches(apiResponse.data?.data || []);
    } catch (error) {
      console.error('Error fetching CricAPI matches:', error);
      setMessage({ type: 'error', text: error.response?.data?.error || 'Failed to fetch matches' });
    } finally {
      setLoading(false);
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    }
  };

  const publishMatch = async (match) => {
    try {
      const token = localStorage.getItem('adminToken');
      await axios.post(
        `${API_URL}/api/admin/cricket-matches/publish`,
        { match },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage({ type: 'success', text: 'Match published successfully!' });
      setPublishedIds((prev) => new Set(prev).add(String(match.id || match.matchId || match.unique_id || match.match_id)));
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.error || 'Failed to publish match' });
    } finally {
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    }
  };

  const normalizeStatus = (match) => {
    if (match?.matchEnded) return 'Completed';
    if (match?.matchStarted) return 'Live';
    return 'Upcoming';
  };

  const filteredMatches = useMemo(() => {
    if (filterStatus === 'all') return apiMatches;
    return apiMatches.filter(match => normalizeStatus(match) === filterStatus);
  }, [apiMatches, filterStatus]);

  const formatDate = (value) => {
    if (!value) return 'TBD';
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return value;
    return parsed.toLocaleString();
  };

  const getTeams = (match) => {
    if (Array.isArray(match?.teamInfo) && match.teamInfo.length >= 2) {
      return [match.teamInfo[0]?.name, match.teamInfo[1]?.name];
    }
    if (Array.isArray(match?.teams) && match.teams.length >= 2) {
      return [match.teams[0], match.teams[1]];
    }
    return ['Home', 'Away'];
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
          <Link to="/admin/matches" className="admin-nav-link">🏏 Matches</Link>
          <Link to="/admin/cricket-matches" className="admin-nav-link active">🏟️ Cricket API</Link>
          <Link to="/admin/polls" className="admin-nav-link">📊 Polls</Link>
          <Link to="/admin/news" className="admin-nav-link">📰 News</Link>
          <Link to="/admin/history" className="admin-nav-link">📚 History</Link>
          <Link to="/" className="admin-nav-link">🌐 View Website</Link>
        </nav>
      </aside>

      <main className="admin-content">
        <div className="admin-header">
          <h1>Cricket API Matches</h1>
          <button className="btn-primary" onClick={fetchMatches}>
            🔄 Refresh
          </button>
        </div>

        {message.text && (
          <div className={`message ${message.type}`}>
            {message.text}
          </div>
        )}

        <div className="api-filter">
          <label>Filter by Status</label>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="all">All</option>
            <option value="Upcoming">Upcoming</option>
            <option value="Live">Live</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        <div className="api-match-list">
          {filteredMatches.length === 0 ? (
            <p className="no-data">No matches available.</p>
          ) : (
            filteredMatches.map((match) => {
              const status = normalizeStatus(match);
              const externalId = String(match.id || match.matchId || match.unique_id || match.match_id || '');
              const [home, away] = getTeams(match);
              const isPublished = publishedIds.has(externalId);

              return (
                <div key={externalId || match.name} className="api-match-card">
                  <div className="api-match-info">
                    <h3>{home} vs {away}</h3>
                    <p className="api-match-meta">
                      📅 {formatDate(match.dateTimeGMT || match.dateTime || match.date)} ·
                      📍 {match.venue || 'Venue TBD'} ·
                      🟣 {status}
                    </p>
                    {match.status && <p className="api-match-status">{match.status}</p>}
                  </div>
                  <div className="api-match-actions">
                    <button
                      className="btn-save"
                      onClick={() => publishMatch(match)}
                      disabled={isPublished}
                    >
                      {isPublished ? 'Published' : 'Publish to Site'}
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminCricketMatches;
