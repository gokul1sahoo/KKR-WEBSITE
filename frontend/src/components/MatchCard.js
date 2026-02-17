import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/matchCard.css';

const MatchCard = ({ match }) => {
  const formatDate = (dateString) => {
    if (!dateString) return 'TBD';
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <Link to={`/matches/${match._id}`} className="match-card-link">
      <div className={`match-card ${match.status?.toLowerCase()}`}>
      <div className="match-header">
        <span className="match-status">{match.status}</span>
        <span className="match-venue">{match.venue}</span>
      </div>
      
      <div className="match-date">
        {formatDate(match.date)}
      </div>
      
      <div className="match-teams">
        <div className="team home-team">
          <p className="team-name">{match.homeTeam?.name || match.homeTeamName || 'Team A'}</p>
          {match.status === 'Completed' && (
            <p className="team-score">{match.homeTeamScore}</p>
          )}
        </div>
        
        <div className="match-vs">vs</div>
        
        <div className="team away-team">
          <p className="team-name">{match.awayTeam?.name || match.awayTeamName || 'Team B'}</p>
          {match.status === 'Completed' && (
            <p className="team-score">{match.awayTeamScore}</p>
          )}
        </div>
      </div>
      
      {match.status === 'Completed' && match.result && (
        <div className="match-result">
          <p>{match.result}</p>
        </div>
      )}
      
      {match.status === 'Live' && (
        <div className="live-badge">
          <span className="pulse"></span> LIVE
        </div>
      )}
      </div>
    </Link>
  );
};

export default MatchCard;
