import React, { useState } from 'react';
import { votePoll } from '../services/api';
import '../styles/poll.css';

const PollCard = ({ poll, onVote }) => {
  const [canVote, setCanVote] = useState(true);
  const totalVotes = poll.options.reduce((sum, opt) => sum + opt.votes, 0);

  const handleVote = async (optionIndex) => {
    if (!canVote) return;
    
    try {
      await votePoll(poll._id, { optionIndex });
      setCanVote(false);
      onVote && onVote();
    } catch (error) {
      console.error('Error voting:', error);
    }
  };

  return (
    <div className="poll-card">
      <h3>{poll.question}</h3>
      
      <div className="poll-options">
        {poll.options.map((option, index) => {
          const percentage = totalVotes > 0 ? (option.votes / totalVotes) * 100 : 0;
          
          return (
            <div key={index} className="poll-option">
              <div className="option-header">
                <span className="option-text">{option.option}</span>
                <span className="option-votes">{option.votes} votes</span>
              </div>
              
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
              
              {canVote && (
                <button 
                  className="vote-btn"
                  onClick={() => handleVote(index)}
                >
                  Vote
                </button>
              )}
            </div>
          );
        })}
      </div>
      
      {!canVote && <p className="voted-msg">✓ Thank you for voting!</p>}
    </div>
  );
};

export default PollCard;
