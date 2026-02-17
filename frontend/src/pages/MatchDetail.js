import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getMatchById, getMatchCurrent } from '../services/api';
import '../styles/matchDetail.css';

const MatchDetail = () => {
  const { id } = useParams();
  const [match, setMatch] = useState(null);
  const [liveData, setLiveData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingLive, setLoadingLive] = useState(false);

  useEffect(() => {
    const fetchMatch = async () => {
      try {
        const response = await getMatchById(id);
        setMatch(response.data);
      } catch (error) {
        console.error('Error fetching match:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMatch();
  }, [id]);

  useEffect(() => {
    const fetchLive = async () => {
      if (!match || match.status === 'Upcoming') return;
      try {
        setLoadingLive(true);
        const response = await getMatchCurrent(id);
        setLiveData(response.data);
      } catch (error) {
        console.error('Error fetching live match data:', error);
      } finally {
        setLoadingLive(false);
      }
    };

    fetchLive();
  }, [id, match]);

  const formatDate = (dateString) => {
    if (!dateString) return 'TBD';
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return 'TBD';
    const options = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Asia/Kolkata',
      hour12: true
    };
    return date.toLocaleString('en-IN', options);
  };

  const getFirstValue = (obj, keys, fallback = '') => {
    for (const key of keys) {
      if (obj && obj[key] !== undefined && obj[key] !== null) {
        return obj[key];
      }
    }
    return fallback;
  };

  const getScorecards = (liveMatch) => {
    if (!liveMatch) return [];
    if (Array.isArray(liveMatch.scorecard)) return liveMatch.scorecard;
    if (Array.isArray(liveMatch.scoreCard)) return liveMatch.scoreCard;
    if (Array.isArray(liveMatch.innings)) return liveMatch.innings;
    return [];
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!match) {
    return (
      <div className="match-detail">
        <p className="no-data">Match not found.</p>
        <Link to="/matches" className="back-link">Back to Matches</Link>
      </div>
    );
  }

  const homeName = match.homeTeam?.name || match.homeTeamName || 'Home';
  const awayName = match.awayTeam?.name || match.awayTeamName || 'Away';
  const liveMatch = liveData?.match;
  const scorecards = getScorecards(liveMatch);

  return (
    <div className="match-detail">
      <div className="match-detail-container">
        <Link to="/matches" className="back-link">← Back to Matches</Link>

        <div className="match-detail-header">
          <h1>{homeName} vs {awayName}</h1>
          <div className="match-detail-meta">
            <span>📅 {formatDate(match.date)}</span>
            <span>📍 {match.venue || 'Venue TBD'}</span>
            <span>🟣 {match.status}</span>
          </div>
        </div>

        {(match.result || (match.status === 'Completed' && liveMatch?.status)) && (
          <div className="match-result-box">
            <strong>Result:</strong> {match.result || liveMatch.status}
          </div>
        )}

        {match.status === 'Upcoming' && (
          <div className="match-note">
            Match not started yet.
          </div>
        )}

        {match.status !== 'Upcoming' && (
          <div className="live-section">
            <h2>Live / Result Details</h2>
            {loadingLive && <p className="loading-inline">Loading live score...</p>}
            {!loadingLive && liveMatch ? (
              <div className="live-card">
                <div className="live-header">
                  <p className="live-name">{liveMatch.name}</p>
                  <p className="live-status">{liveMatch.status}</p>
                </div>

                {Array.isArray(liveMatch.score) && liveMatch.score.length > 0 ? (
                  <div className="live-scores">
                    {liveMatch.score.map((score, index) => (
                      <div key={index} className="score-row">
                        <span className="score-team">{score.inning}</span>
                        <span className="score-value">
                          {score.r}/{score.w} ({score.o})
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="no-data">Score details not available.</p>
                )}
              </div>
            ) : (
              !loadingLive && <p className="no-data">No live result found for this match.</p>
            )}

            {!loadingLive && scorecards.length > 0 && (
              <div className="scorecard-section">
                <h2>Scorecard</h2>
                <div className="scorecard-grid">
                  {scorecards.map((inning, index) => {
                    const batting =
                      inning.batting || inning.batsmen || inning.batsman || [];
                    const bowling = inning.bowling || inning.bowlers || [];
                    const inningName = getFirstValue(inning, ['inning', 'name', 'team', 'title'], 'Innings');

                    return (
                      <div key={index} className="scorecard-card">
                        <h3>{inningName}</h3>

                        {Array.isArray(batting) && batting.length > 0 && (
                          <div className="scorecard-block">
                            <h4>Batting</h4>
                            <div className="scorecard-table">
                              <div className="scorecard-row scorecard-head">
                                <span>Player</span>
                                <span>R</span>
                                <span>B</span>
                                <span>4s</span>
                                <span>6s</span>
                                <span>SR</span>
                              </div>
                              {batting.map((player, idx) => (
                                <div key={idx} className="scorecard-row">
                                  <span>{getFirstValue(player, ['batsman', 'name', 'player', 'bat'], 'N/A')}</span>
                                  <span>{getFirstValue(player, ['r', 'runs'], '-')}</span>
                                  <span>{getFirstValue(player, ['b', 'balls'], '-')}</span>
                                  <span>{getFirstValue(player, ['4s', 'fours'], '-')}</span>
                                  <span>{getFirstValue(player, ['6s', 'sixes'], '-')}</span>
                                  <span>{getFirstValue(player, ['sr', 'strikeRate'], '-')}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {Array.isArray(bowling) && bowling.length > 0 && (
                          <div className="scorecard-block">
                            <h4>Bowling</h4>
                            <div className="scorecard-table">
                              <div className="scorecard-row scorecard-head">
                                <span>Bowler</span>
                                <span>O</span>
                                <span>M</span>
                                <span>R</span>
                                <span>W</span>
                                <span>Econ</span>
                              </div>
                              {bowling.map((player, idx) => (
                                <div key={idx} className="scorecard-row">
                                  <span>{getFirstValue(player, ['bowler', 'name', 'player', 'bowl'], 'N/A')}</span>
                                  <span>{getFirstValue(player, ['o', 'overs'], '-')}</span>
                                  <span>{getFirstValue(player, ['m', 'maidens'], '-')}</span>
                                  <span>{getFirstValue(player, ['r', 'runs'], '-')}</span>
                                  <span>{getFirstValue(player, ['w', 'wickets'], '-')}</span>
                                  <span>{getFirstValue(player, ['econ', 'economy'], '-')}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MatchDetail;
