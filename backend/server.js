const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Database Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ipl-team-website')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
const teamRoutes = require('./routes/teamRoutes');
const playerRoutes = require('./routes/playerRoutes');
const matchRoutes = require('./routes/matchRoutes');
const newsRoutes = require('./routes/newsRoutes');
const pollRoutes = require('./routes/pollRoutes');
const historyRoutes = require('./routes/historyRoutes');
const userRoutes = require('./routes/user');

// Admin Routes
const adminRoutes = require('./routes/admin');
const adminPlayerRoutes = require('./routes/adminPlayers');
const adminPollRoutes = require('./routes/adminPolls');
const adminNewsRoutes = require('./routes/adminNews');
const adminHistoryRoutes = require('./routes/adminHistory');
const adminMatchRoutes = require('./routes/adminMatches');
const adminCricketMatchesRoutes = require('./routes/adminCricketMatches');

app.use('/api/team', teamRoutes);
app.use('/api/players', playerRoutes);
app.use('/api/matches', matchRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/polls', pollRoutes);
app.use('/api/history', historyRoutes);
app.use('/api/user', userRoutes);

// Admin API Routes
app.use('/api/admin', adminRoutes);
app.use('/api/admin/players', adminPlayerRoutes);
app.use('/api/admin/polls', adminPollRoutes);
app.use('/api/admin/news', adminNewsRoutes);
app.use('/api/admin/history', adminHistoryRoutes);
app.use('/api/admin/matches', adminMatchRoutes);
app.use('/api/admin/cricket-matches', adminCricketMatchesRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ message: 'Server is running' });
});

const frontendBuildPath = path.join(__dirname, '../frontend/build');
if (fs.existsSync(frontendBuildPath)) {
  app.use(express.static(frontendBuildPath));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api/')) {
      return next();
    }
    return res.sendFile(path.join(frontendBuildPath, 'index.html'));
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal Server Error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
