import React, { useState, useEffect } from 'react';
import { getNews, getNewsByTeam, getTeams } from '../services/api';
import NewsCard from '../components/NewsCard';
import '../styles/news.css';

const News = () => {
  const [news, setNews] = useState([]);
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTeams();
    fetchNews();
  }, []);

  const fetchTeams = async () => {
    try {
      const response = await getTeams();
      setTeams(response.data);
    } catch (error) {
      console.error('Error fetching teams:', error);
    }
  };

  const fetchNews = async (teamId = null) => {
    try {
      setLoading(true);
      let response;
      if (teamId && teamId !== 'all') {
        response = await getNewsByTeam(teamId);
      } else {
        response = await getNews();
      }
      setNews(response.data);
    } catch (error) {
      console.error('Error fetching news:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredNews = news.filter(article => {
    if (filterCategory !== 'all' && article.category !== filterCategory) {
      return false;
    }
    return true;
  });

  const handleTeamChange = (teamId) => {
    setSelectedTeam(teamId);
    fetchNews(teamId);
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="news-page">
      <section className="page-header">
        <h1>Latest News</h1>
        <p>Stay updated with the latest team news and updates</p>
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
          <label>Filter by Category:</label>
          <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
            <option value="all">All Categories</option>
            <option value="Transfer">Transfer</option>
            <option value="Match Report">Match Report</option>
            <option value="Injury">Injury</option>
            <option value="Achievement">Achievement</option>
            <option value="General">General</option>
          </select>
        </div>
      </section>

      <section className="news-grid">
        {filteredNews.length > 0 ? (
          filteredNews.map(article => (
            <NewsCard key={article._id} article={article} />
          ))
        ) : (
          <p className="no-data">No news articles found</p>
        )}
      </section>
    </div>
  );
};

export default News;
