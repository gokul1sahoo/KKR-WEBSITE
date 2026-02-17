import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './PlayerDetail.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function PlayerDetail() {
  const { playerId } = useParams();
  const navigate = useNavigate();
  const [player, setPlayer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPlayerDetail();
  }, [playerId]);

  const fetchPlayerDetail = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/players`);
      const foundPlayer = response.data.find(p => p._id === playerId);
      
      if (foundPlayer) {
        setPlayer(foundPlayer);
      } else {
        setError('Player not found');
      }
      setLoading(false);
    } catch (err) {
      setError('Failed to load player details');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="player-detail-container">
        <div className="loading">Loading player details...</div>
      </div>
    );
  }

  if (error || !player) {
    return (
      <div className="player-detail-container">
        <div className="error-message">
          {error || 'Player not found'}
        </div>
        <button className="btn-back" onClick={() => navigate('/players')}>
          ← Back to Players
        </button>
      </div>
    );
  }

  return (
    <div className="player-detail-container">
      <button className="btn-back" onClick={() => navigate('/players')}>
        ← Back to Players
      </button>

      <div className="player-detail-content">
        {/* Player Image Section */}
        <div className="player-detail-image-section">
          <img
            src={player.profileImage || 'https://via.placeholder.com/300x400?text=' + player.name}
            alt={player.name}
            className="player-detail-image"
          />
          <div className="player-jersey">#{player.jerseyNumber}</div>
        </div>

        {/* Player Info Section */}
        <div className="player-detail-info-section">
          <h1 className="player-detail-name">{player.name}</h1>
          <p className="player-detail-role">{player.role}</p>

          {/* Basic Info */}
          <div className="player-detail-card basic-info">
            <h2>Basic Information</h2>
            <div className="info-grid">
              <div className="info-item">
                <span className="label">Jersey Number:</span>
                <span className="value">#{player.jerseyNumber}</span>
              </div>
              <div className="info-item">
                <span className="label">Role:</span>
                <span className="value">{player.role}</span>
              </div>
              {player.biography && (
                <div className="info-item full-width">
                  <span className="label">Bio:</span>
                  <span className="value">{player.biography}</span>
                </div>
              )}
            </div>
          </div>

          {/* Statistics Section */}
          <div className="player-detail-card statistics">
            <h2>Career Statistics</h2>
            <div className="stats-grid">
              {/* Batting Stats */}
              <div className="stat-box">
                <div className="stat-label">Matches</div>
                <div className="stat-value">{player.statistics?.matches || 0}</div>
              </div>

              <div className="stat-box">
                <div className="stat-label">Runs</div>
                <div className="stat-value">{player.statistics?.runs || 0}</div>
              </div>

              {player.statistics?.strikeRate && (
                <div className="stat-box">
                  <div className="stat-label">Strike Rate</div>
                  <div className="stat-value">{player.statistics.strikeRate}</div>
                </div>
              )}

              {player.statistics?.avgRuns && (
                <div className="stat-box">
                  <div className="stat-label">Avg Runs</div>
                  <div className="stat-value">{player.statistics.avgRuns}</div>
                </div>
              )}

              {/* Bowling Stats */}
              {player.statistics?.wickets > 0 && (
                <div className="stat-box">
                  <div className="stat-label">Wickets</div>
                  <div className="stat-value">{player.statistics.wickets}</div>
                </div>
              )}

              {player.statistics?.economy && (
                <div className="stat-box">
                  <div className="stat-label">Economy</div>
                  <div className="stat-value">{player.statistics.economy}</div>
                </div>
              )}

              {player.statistics?.avgWickets && (
                <div className="stat-box">
                  <div className="stat-label">Avg Wickets</div>
                  <div className="stat-value">{player.statistics.avgWickets}</div>
                </div>
              )}

              {player.statistics?.bowlingAvg && (
                <div className="stat-box">
                  <div className="stat-label">Bowling Avg</div>
                  <div className="stat-value">{player.statistics.bowlingAvg}</div>
                </div>
              )}
            </div>
          </div>

          {/* Detailed Stats Table */}
          {player.statistics && Object.keys(player.statistics).length > 0 && (
            <div className="player-detail-card detailed-stats">
              <h2>Detailed Performance</h2>
              <table className="stats-table">
                <tbody>
                  {Object.entries(player.statistics).map(([key, value]) => (
                    <tr key={key}>
                      <td className="stat-name">
                        {key.charAt(0).toUpperCase() + key.slice(1)}
                      </td>
                      <td className="stat-value">{value || 'N/A'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Similar Players Section */}
      <div className="player-suggestions">
        <h2>Other {player.role}s</h2>
        <p>View other {player.role.toLowerCase()}s in the squad</p>
        <button className="btn-view-all" onClick={() => navigate('/players')}>
          View All Players →
        </button>
      </div>
    </div>
  );
}

export default PlayerDetail;
