import React, { useState, useEffect } from 'react';
import { getPlayers, getPlayersByTeam, getTeams } from '../services/api';
import PlayerCard from '../components/PlayerCard';
import '../styles/players.css';

const Players = () => {
  const [players, setPlayers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState('all');
  const [filterRole, setFilterRole] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTeams();
    fetchPlayers();
  }, []);

  const fetchTeams = async () => {
    try {
      const response = await getTeams();
      setTeams(response.data);
    } catch (error) {
      console.error('Error fetching teams:', error);
    }
  };

  const fetchPlayers = async (teamId = null) => {
    try {
      setLoading(true);
      console.log('Fetching players... TeamId:', teamId);
      let response;
      if (teamId && teamId !== 'all') {
        console.log('Fetching players for team:', teamId);
        response = await getPlayersByTeam(teamId);
      } else {
        console.log('Fetching all players');
        response = await getPlayers();
      }
      console.log('Players response:', response);
      console.log('Players data:', response.data);
      console.log('Number of players:', response.data.length);
      setPlayers(response.data);
    } catch (error) {
      console.error('Error fetching players:', error);
      console.error('Error details:', error.response || error.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredPlayers = players.filter(player => {
    if (filterRole !== 'all' && player.role !== filterRole) {
      return false;
    }
    return true;
  });
  
  console.log('Total players:', players.length);
  console.log('Filtered players:', filteredPlayers.length);
  console.log('Filter role:', filterRole);

  const handleTeamChange = (teamId) => {
    setSelectedTeam(teamId);
    fetchPlayers(teamId);
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="players-page">
      <section className="page-header">
        <h1>Player Profiles</h1>
        <p>Explore detailed profiles of all team players</p>
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
          <label>Filter by Role:</label>
          <select value={filterRole} onChange={(e) => setFilterRole(e.target.value)}>
            <option value="all">All Roles</option>
            <option value="Batsman">Batsman</option>
            <option value="Bowler">Bowler</option>
            <option value="All-rounder">All-rounder</option>
            <option value="Wicket-keeper">Wicket-keeper</option>
          </select>
        </div>
      </section>

      <section className="players-grid">
        {filteredPlayers.length > 0 ? (
          filteredPlayers.map(player => (
            <PlayerCard key={player._id} player={player} />
          ))
        ) : (
          <p className="no-data">No players found</p>
        )}
      </section>
    </div>
  );
};

export default Players;
