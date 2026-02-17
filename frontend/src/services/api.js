import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Team Services
export const getTeams = () => api.get('/team');
export const getTeamById = (id) => api.get(`/team/${id}`);
export const createTeam = (data) => api.post('/team', data);
export const updateTeam = (id, data) => api.put(`/team/${id}`, data);
export const deleteTeam = (id) => api.delete(`/team/${id}`);

// Player Services
export const getPlayers = () => api.get('/players');
export const getPlayersByTeam = (teamId) => api.get(`/players/team/${teamId}`);
export const getPlayerById = (id) => api.get(`/players/${id}`);
export const createPlayer = (data) => api.post('/players', data);
export const updatePlayer = (id, data) => api.put(`/players/${id}`, data);
export const deletePlayer = (id) => api.delete(`/players/${id}`);

// Match Services
export const getMatches = () => api.get('/matches');
export const getMatchesByTeam = (teamId) => api.get(`/matches/team/${teamId}`);
export const getMatchById = (id) => api.get(`/matches/${id}`);
export const getMatchCurrent = (id) => api.get(`/matches/${id}/current`);
export const createMatch = (data) => api.post('/matches', data);
export const updateMatch = (id, data) => api.put(`/matches/${id}`, data);
export const deleteMatch = (id) => api.delete(`/matches/${id}`);

// News Services
export const getNews = () => api.get('/news');
export const getNewsByTeam = (teamId) => api.get(`/news/team/${teamId}`);
export const getNewsById = (id) => api.get(`/news/${id}`);
export const createNews = (data) => api.post('/news', data);
export const updateNews = (id, data) => api.put(`/news/${id}`, data);
export const deleteNews = (id) => api.delete(`/news/${id}`);

// Poll Services
export const getPolls = () => api.get('/polls');
export const getActivePolls = () => api.get('/polls/active');
export const getPollById = (id) => api.get(`/polls/${id}`);
export const createPoll = (data) => api.post('/polls', data);
export const votePoll = (id, data) => api.post(`/polls/${id}/vote`, data);
export const updatePoll = (id, data) => api.put(`/polls/${id}`, data);
export const deletePoll = (id) => api.delete(`/polls/${id}`);

// History Services
export const getHistory = () => api.get('/history');
export const getHistoryById = (id) => api.get(`/history/${id}`);

export default api;
