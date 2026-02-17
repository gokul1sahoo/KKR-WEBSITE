import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/playerCard.css';

const PlayerCard = ({ player }) => {
  return (
    <div className="player-card">
      <div className="player-image">
        <img src={player.profileImage || 'https://via.placeholder.com/200x250?text=' + player.name} alt={player.name} />
      </div>
      <div className="player-info">
        <h3>{player.name}</h3>
        <p className="role">{player.role}</p>
        <Link to={`/player/${player._id}`} className="btn-details">
          See Details
        </Link>
      </div>
    </div>
  );
};

export default PlayerCard;
