import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getActivePolls } from '../services/api';
import PollCard from '../components/PollCard';
import '../styles/polls.css';

const Polls = () => {
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    fetchPolls();
  }, []);

  useEffect(() => {
    if (loading || !location.hash) return;
    const targetId = location.hash.replace('#', '');
    const target = document.getElementById(targetId);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [loading, location.hash]);

  const fetchPolls = async () => {
    try {
      setLoading(true);
      const response = await getActivePolls();
      setPolls(response.data);
    } catch (error) {
      console.error('Error fetching polls:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVote = () => {
    fetchPolls(); // Refresh polls after voting
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="polls-page">
      <section className="page-header">
        <h1>Fan Polls</h1>
        <p>Share your opinions and vote on exciting questions</p>
      </section>

      <section className="polls-grid">
        {polls.length > 0 ? (
          polls.map(poll => (
            <div key={poll._id} id={`poll-${poll._id}`}>
              <PollCard poll={poll} onVote={handleVote} />
            </div>
          ))
        ) : (
          <p className="no-data">No active polls at the moment</p>
        )}
      </section>
    </div>
  );
};

export default Polls;
