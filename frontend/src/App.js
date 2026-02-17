import React from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Players from './pages/Players';
import PlayerDetail from './pages/PlayerDetail';
import Matches from './pages/Matches';
import MatchDetail from './pages/MatchDetail';
import News from './pages/News';
import NewsDetail from './pages/NewsDetail';
import Polls from './pages/Polls';
import About from './pages/About';
import HistoryPage from './pages/History';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import AdminManagement from './pages/AdminManagement';
import AdminPlayers from './pages/AdminPlayers';
import AdminMatches from './pages/AdminMatches';
import AdminCricketMatches from './pages/AdminCricketMatches';
import AdminPolls from './pages/AdminPolls';
import AdminNews from './pages/AdminNews';
import AdminHistory from './pages/AdminHistory';
import './styles/app.css';

function App() {
  return (
    <Router>
      <Routes>
        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/management" element={<AdminManagement />} />
        <Route path="/admin/players" element={<AdminPlayers />} />
        <Route path="/admin/matches" element={<AdminMatches />} />
        <Route path="/admin/cricket-matches" element={<AdminCricketMatches />} />
        <Route path="/admin/polls" element={<AdminPolls />} />
        <Route path="/admin/news" element={<AdminNews />} />
        <Route path="/admin/history" element={<AdminHistory />} />

        {/* Public Routes */}
        <Route path="/*" element={
          <>
            <Navbar />
            <main className="main-content">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/players" element={<Players />} />
                <Route path="/player/:playerId" element={<PlayerDetail />} />
                <Route path="/matches" element={<Matches />} />
                <Route path="/matches/:id" element={<MatchDetail />} />
                <Route path="/news" element={<News />} />
                <Route path="/news/:id" element={<NewsDetail />} />
                <Route path="/polls" element={<Polls />} />
                <Route path="/history" element={<HistoryPage />} />
                <Route path="/about" element={<About />} />
              </Routes>
            </main>
            <Footer />
          </>
        } />
      </Routes>
    </Router>
  );
}

export default App;
