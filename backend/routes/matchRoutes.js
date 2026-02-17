const express = require('express');
const router = express.Router();
const matchController = require('../controllers/matchController');
const Match = require('../models/Match');

router.get('/', matchController.getAllMatches);
router.get('/team/:teamId', matchController.getMatchesByTeam);
router.get('/:id/current', async (req, res) => {
	try {
		const match = await Match.findById(req.params.id)
			.populate('homeTeam')
			.populate('awayTeam');

		if (!match) {
			return res.status(404).json({ message: 'Match not found' });
		}

		if (match.status === 'Upcoming') {
			return res.json({ status: 'Upcoming', message: 'Match not started yet.' });
		}

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
		const matches = Array.isArray(data?.data) ? data.data : [];

		const normalize = (value) =>
			(value || '').toLowerCase().replace(/[^a-z0-9]/g, '');

		const homeName = normalize(match.homeTeam?.name || match.homeTeamName);
		const awayName = normalize(match.awayTeam?.name || match.awayTeamName);

		const isMatch = (item) => {
			const names = new Set();

			if (Array.isArray(item?.teams)) {
				item.teams.forEach((team) => names.add(normalize(team)));
			}

			if (Array.isArray(item?.teamInfo)) {
				item.teamInfo.forEach((team) => {
					names.add(normalize(team?.name));
					names.add(normalize(team?.shortname));
				});
			}

			if (item?.name) {
				names.add(normalize(item.name));
			}

			return homeName && awayName && names.has(homeName) && names.has(awayName);
		};

		const liveMatch = matches.find(isMatch) || null;

		res.json({ status: match.status, match: liveMatch });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});
router.get('/:id', matchController.getMatchById);
router.post('/', matchController.createMatch);
router.put('/:id', matchController.updateMatch);
router.delete('/:id', matchController.deleteMatch);

module.exports = router;
