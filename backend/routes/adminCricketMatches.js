const express = require('express');
const router = express.Router();
const Match = require('../models/Match');
const { authMiddleware } = require('../middleware/auth');

const normalizeTeamName = (value) => (value || '').trim();

const extractTeams = (match) => {
  if (Array.isArray(match?.teamInfo) && match.teamInfo.length >= 2) {
    return [
      normalizeTeamName(match.teamInfo[0]?.name || match.teamInfo[0]?.shortname),
      normalizeTeamName(match.teamInfo[1]?.name || match.teamInfo[1]?.shortname)
    ];
  }

  if (Array.isArray(match?.teams) && match.teams.length >= 2) {
    return [normalizeTeamName(match.teams[0]), normalizeTeamName(match.teams[1])];
  }

  return ['Home', 'Away'];
};

const mapStatus = (match) => {
  if (match?.matchEnded) return 'Completed';
  if (match?.matchStarted) return 'Live';
  return 'Upcoming';
};

const parseDate = (match) => {
  const raw = match?.dateTimeGMT || match?.dateTime || match?.date;
  if (!raw) return undefined;
  const parsed = new Date(raw);
  return Number.isNaN(parsed.getTime()) ? undefined : parsed;
};

router.get('/', authMiddleware, async (req, res) => {
  try {
    const apiKey = process.env.CRICAPI_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'CRICAPI_KEY is not set on the server.' });
    }

    const url = `https://api.cricapi.com/v1/currentMatches?apikey=${apiKey}&offset=0`;
    const response = await fetch(url);
    if (!response.ok) {
      return res.status(502).json({ error: 'Failed to fetch live match data.' });
    }

    const data = await response.json();
    res.json({ data: Array.isArray(data?.data) ? data.data : [] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/publish', authMiddleware, async (req, res) => {
  try {
    const match = req.body?.match;
    if (!match) {
      return res.status(400).json({ error: 'Match data is required.' });
    }

    const externalMatchId = match.id || match.matchId || match.unique_id || match.match_id;
    if (!externalMatchId) {
      return res.status(400).json({ error: 'Match id is missing from API data.' });
    }

    const [homeTeamName, awayTeamName] = extractTeams(match);
    const status = mapStatus(match);
    const date = parseDate(match);

    const payload = {
      externalMatchId,
      source: 'cricapi',
      homeTeamName,
      awayTeamName,
      venue: match.venue || undefined,
      date,
      status,
      result: status === 'Completed' ? match.status : undefined,
      description: match.name || undefined
    };

    const saved = await Match.findOneAndUpdate(
      { externalMatchId, source: 'cricapi' },
      payload,
      { new: true, upsert: true }
    );

    res.json({ message: 'Match published successfully', match: saved });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
