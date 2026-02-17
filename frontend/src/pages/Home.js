import React, { useState, useEffect } from 'react';
import { getTeams, getMatches, getNews, getPlayers, getActivePolls } from '../services/api';
import MatchCard from '../components/MatchCard';
import NewsCard from '../components/NewsCard';
import PlayerCard from '../components/PlayerCard';
import History from '../components/History';
import '../styles/home.css';

const Home = () => {
  const [team, setTeam] = useState(null);
  const [upcomingMatches, setUpcomingMatches] = useState([]);
  const [recentNews, setRecentNews] = useState([]);
  const [featuredPlayers, setFeaturedPlayers] = useState([]);
  const [featuredPolls, setFeaturedPolls] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch KKR team
      const teamsResponse = await getTeams();
      const kkrTeam = teamsResponse.data[0]; // Get first team (KKR)
      setTeam(kkrTeam);

      if (kkrTeam) {
        // Fetch matches
        const matchesResponse = await getMatches();
        const matchesData = matchesResponse.data || [];

        const latestMatches = matchesData
          .sort((a, b) => {
            if (a.status === 'Live') return -1;
            if (b.status === 'Live') return 1;
            if (a.status === 'Upcoming') return -1;
            if (b.status === 'Upcoming') return 1;
            const dateA = new Date(a.date || a.createdAt || 0);
            const dateB = new Date(b.date || b.createdAt || 0);
            return dateB - dateA;
          })
          .slice(0, 3);

        setUpcomingMatches(latestMatches);

        // Fetch news
        const newsResponse = await getNews();
        setRecentNews(newsResponse.data.slice(0, 3));

        // Fetch featured players
        const playersResponse = await getPlayers();
        const filteredPlayers = playersResponse.data
          .filter(player => player.name !== 'Manish Pandey')
          .slice(0, 3);
        setFeaturedPlayers(filteredPlayers);

        // Fetch active polls
        const pollsResponse = await getActivePolls();
        setFeaturedPolls(pollsResponse.data.slice(0, 3));
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="home">
      <section className="hero">
        <div className="hero-content">
          <h1>Welcome to Kolkata Knight Riders</h1>
          <p>Korbo Lorbo Jeetbo Re - We Will Act, We Will Fight, We Will Win!</p>
        </div>
      </section>

      {team && (
        <section className="team-details">
          <div className="kkr-header">
            <h2>{team.name}</h2>
            <p className="team-motto">Two-Time IPL Champions (2012, 2014)</p>
          </div>
          <div className="details-grid">
            <div className="detail-card">
              <h4>Coach</h4>
              <p>{team.coachName || 'N/A'}</p>
            </div>
            <div className="detail-card">
              <h4>Captain</h4>
              <p>{team.captainName || 'N/A'}</p>
            </div>
            <div className="detail-card">
              <h4>Home Ground</h4>
              <p>{team.headquarters || 'N/A'}</p>
            </div>
            <div className="detail-card">
              <h4>Founded</h4>
              <p>{team.founded || 'N/A'}</p>
            </div>
          </div>
        </section>
      )}

      <section className="upcoming-matches">
        <h2>Matches</h2>
        {upcomingMatches.length > 0 ? (
          <div className="matches-list">
            {upcomingMatches.map(match => (
              <MatchCard key={match._id} match={match} />
            ))}
          </div>
        ) : (
          <p className="no-data">No upcoming matches scheduled</p>
        )}
      </section>

      <section className="featured-players">
        <h2>Featured Players</h2>
        {featuredPlayers.length > 0 ? (
          <div className="players-grid">
            {featuredPlayers.map(player => (
              <PlayerCard key={player._id} player={player} />
            ))}
          </div>
        ) : (
          <p className="no-data">No players data available</p>
        )}
      </section>

      <section className="home-poll">
        <h2>Fan Poll</h2>
        {featuredPolls.length > 0 ? (
          <div className="home-poll-list">
            {featuredPolls.map(poll => (
              <div key={poll._id} className="home-poll-card">
                <p className="home-poll-question">{poll.question}</p>
                <a
                  className="home-poll-link"
                  href={`/polls#poll-${poll._id}`}
                >
                  Vote on this poll →
                </a>
              </div>
            ))}
          </div>
        ) : (
          <p className="no-data">No active polls at the moment</p>
        )}
      </section>

      <section className="recent-news">
        <h2>Latest News</h2>
        {recentNews.length > 0 ? (
          <div className="news-grid">
            {recentNews.map(article => (
              <NewsCard key={article._id} article={article} />
            ))}
          </div>
        ) : (
          <p className="no-data">No news available</p>
        )}
      </section>

      <History />

      <section className="features">
        <h2>Join the KKR Family</h2>
        <div className="features-grid">
          <div className="feature-card">
            <h3>🏏 Match Updates</h3>
            <p>Get live scores, match schedules, and detailed match reports for all KKR games.</p>
          </div>
          <div className="feature-card">
            <h3>👥 Player Stats</h3>
            <p>Explore detailed profiles of your favorite KKR players with career statistics.</p>
          </div>
          <div className="feature-card">
            <h3>📰 Team News</h3>
            <p>Stay updated with the latest KKR news, transfers, and team announcements.</p>
          </div>
          <div className="feature-card">
            <h3>🗳️ Fan Polls</h3>
            <p>Vote in polls, share your opinions, and engage with fellow KKR fans.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
