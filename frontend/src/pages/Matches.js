import React, { useState, useEffect } from 'react';
import { getMatches, getMatchesByTeam, getTeams } from '../services/api';
import MatchCard from '../components/MatchCard';
import '../styles/matches.css';

const Matches = () => {
  const [matches, setMatches] = useState([]);
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTeams();
    fetchMatches();
  }, []);

  const fetchTeams = async () => {
    try {
      const response = await getTeams();
      setTeams(response.data);
    } catch (error) {
      console.error('Error fetching teams:', error);
    }
  };

  const fetchMatches = async (teamId = null) => {
    try {
      setLoading(true);
      let response;
      if (teamId && teamId !== 'all') {
        response = await getMatchesByTeam(teamId);
      } else {
        response = await getMatches();
      }
      setMatches(response.data);
    } catch (error) {
      console.error('Error fetching matches:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredMatches = matches
    .filter(match => {
      if (filterStatus !== 'all' && match.status !== filterStatus) {
        return false;
      }
      return true;
    })
    .sort((a, b) => {
      if (a.status === 'Live') return -1;
      if (b.status === 'Live') return 1;
      if (a.status === 'Upcoming') return -1;
      if (b.status === 'Upcoming') return 1;
      if (!a.date && !b.date) return 0;
      if (!a.date) return 1;
      if (!b.date) return -1;
      return new Date(b.date) - new Date(a.date);
    });

  const handleTeamChange = (teamId) => {
    setSelectedTeam(teamId);
    fetchMatches(teamId);
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="matches-page">
      <section className="page-header">
        <h1>Match Schedule</h1>
        <p>View all matches and live updates</p>
      </section>

      <section className="filters">
        <div className="filter-group">
          <label>Filter by Team:</label>
          <select value={selectedTeam} onChange={(e) => handleTeamChange(e.target.value)}>
            <option value="all">All Teams</option>
            {teams.map(team => (
              <option key={team._id} value={team._id}>{team.name}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>Filter by Status:</label>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="all">All Matches</option>
            <option value="Upcoming">Upcoming</option>
            <option value="Live">Live</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
      </section>

      <section className="matches-list">
        {filteredMatches.length > 0 ? (
          filteredMatches.map(match => (
            <MatchCard key={match._id} match={match} />
          ))
        ) : (
          <p className="no-data">No matches found</p>
        )}
      </section>
    </div>
  );
};

export default Matches;
