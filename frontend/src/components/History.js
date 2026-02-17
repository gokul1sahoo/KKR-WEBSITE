import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/history.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const History = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/history`);
      setHistory(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching history:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading history...</div>;
  }

  return (
    <section className="history-section">
      <h2>KKR History & Legacy</h2>
      {history.length > 0 ? (
        <div className="history-timeline">
          {history.map((item, index) => (
            <div key={item._id} className={`timeline-item ${index % 2 === 0 ? 'left' : 'right'}`}>
              <div className="timeline-content">
                {item.image && (
                  <img src={item.image} alt={item.title} className="timeline-image" />
                )}
                <div className="timeline-text">
                  <h3>{item.title}</h3>
                  <p className="timeline-year">{item.year}</p>
                  <p className="timeline-description">{item.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="no-data">No history records available</p>
      )}
    </section>
  );
};

export default History;
