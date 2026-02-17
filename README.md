# Kolkata Knight Riders (KKR) - Official Fan Hub 💜⚡

A comprehensive MERN stack website dedicated to **Kolkata Knight Riders** with team information, match schedules, player profiles, statistics, news updates, and fan engagement features.

**Korbo Lorbo Jeetbo Re** - We Will Act, We Will Fight, We Will Win!

## Features

✨ **Team Information**

- Detailed team profiles with coach, captain, and statistics
- Team colors and social media links

🏏 **Match Management**

- Upcoming matches and schedules
- Live match updates
- Completed match results and highlights

👥 **Player Profiles**

- Comprehensive player information
- Career statistics
- Role-based filtering (Batsman, Bowler, All-rounder, Wicket-keeper)

📰 **News & Updates**

- Latest team news and announcements
- Categorized news (Transfer, Match Report, Injury, Achievement, General)
- View tracking

🗳️ **Fan Engagement**

- Interactive polls and voting system
- Real-time vote tracking

## Tech Stack

**Frontend:**

- React 18.2
- React Router DOM for navigation
- Axios for API calls
- Modern CSS3 with responsive design

**Backend:**

- Node.js with Express.js
- MongoDB for database
- Mongoose ODM
- CORS and body-parser middleware

**Database:**

- MongoDB

## Project Structure

```
IPL/
├── backend/
│   ├── models/
│   │   ├── Team.js
│   │   ├── Player.js
│   │   ├── Match.js
│   │   ├── News.js
│   │   └── Poll.js
│   ├── routes/
│   │   ├── teamRoutes.js
│   │   ├── playerRoutes.js
│   │   ├── matchRoutes.js
│   │   ├── newsRoutes.js
│   │   └── pollRoutes.js
│   ├── controllers/
│   │   ├── teamController.js
│   │   ├── playerController.js
│   │   ├── matchController.js
│   │   ├── newsController.js
│   │   └── pollController.js
│   ├── server.js
│   ├── package.json
│   └── .env.example
│
└── frontend/
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.js
    │   │   ├── Footer.js
    │   │   ├── PlayerCard.js
    │   │   ├── MatchCard.js
    │   │   ├── NewsCard.js
    │   │   └── PollCard.js
    │   ├── pages/
    │   │   ├── Home.js
    │   │   ├── Players.js
    │   │   ├── Matches.js
    │   │   ├── News.js
    │   │   ├── Polls.js
    │   │   └── About.js
    │   ├── services/
    │   │   └── api.js
    │   ├── styles/
    │   │   ├── index.css
    │   │   ├── app.css
    │   │   ├── navbar.css
    │   │   ├── footer.css
    │   │   ├── home.css
    │   │   ├── players.css
    │   │   ├── matches.css
    │   │   ├── news.css
    │   │   ├── polls.css
    │   │   ├── playerCard.css
    │   │   ├── matchCard.css
    │   │   ├── newsCard.css
    │   │   ├── poll.css
    │   │   └── about.css
    │   ├── App.js
    │   └── index.js
    └── package.json
```

## Installation & Setup

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MongoDB (local or cloud - MongoDB Atlas)

### Backend Setup

1. **Navigate to backend directory:**

   ```bash
   cd backend
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Create .env file:**

   ```bash
   Copy .env.example to .env and update the values
   ```

4. **Example .env file:**

   ```
   MONGODB_URI=mongodb://localhost:27017/ipl-team-website
   PORT=5000
   NODE_ENV=development
   JWT_SECRET=your_jwt_secret_key_here
   CORS_ORIGIN=http://localhost:3000
   ```

5. **Start the server:**
   ```bash
   npm run dev
   ```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory:**

   ```bash
   cd frontend
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Create .env file (optional):**

   ```
   REACT_APP_API_URL=http://localhost:5000/api
   ```

4. **Start the development server:**
   ```bash
   npm start
   ```

The frontend will run on `http://localhost:3000`

## API Endpoints

### Team Endpoints

- `GET /api/team` - Get all teams
- `GET /api/team/:id` - Get team by ID
- `POST /api/team` - Create new team
- `PUT /api/team/:id` - Update team
- `DELETE /api/team/:id` - Delete team

### Player Endpoints

- `GET /api/players` - Get all players
- `GET /api/players/team/:teamId` - Get players by team
- `GET /api/players/:id` - Get player by ID
- `POST /api/players` - Create new player
- `PUT /api/players/:id` - Update player
- `DELETE /api/players/:id` - Delete player

### Match Endpoints

- `GET /api/matches` - Get all matches
- `GET /api/matches/team/:teamId` - Get matches by team
- `GET /api/matches/:id` - Get match by ID
- `POST /api/matches` - Create new match
- `PUT /api/matches/:id` - Update match
- `DELETE /api/matches/:id` - Delete match

### News Endpoints

- `GET /api/news` - Get all news articles
- `GET /api/news/team/:teamId` - Get news by team
- `GET /api/news/:id` - Get news by ID
- `POST /api/news` - Create new article
- `PUT /api/news/:id` - Update article
- `DELETE /api/news/:id` - Delete article

### Poll Endpoints

- `GET /api/polls` - Get all polls
- `GET /api/polls/active` - Get active polls
- `GET /api/polls/:id` - Get poll by ID
- `POST /api/polls` - Create new poll
- `POST /api/polls/:id/vote` - Vote on poll
- `PUT /api/polls/:id` - Update poll
- `DELETE /api/polls/:id` - Delete poll

## Sample Data

You can populate the database with sample data using the MongoDB client:

```javascript
// Sample Team
db.teams.insertOne({
  name: "Mumbai Indians",
  logo: "https://example.com/logo.png",
  founded: 2008,
  headquarters: "Mumbai, Maharashtra",
  coachName: "Mahela Jayawardene",
  captainName: "Rohit Sharma",
  description:
    "Mumbai Indians is one of the most successful teams in IPL history",
  colors: ["Blue", "Gold"],
  wins: 85,
  losses: 65,
  socialLinks: {
    twitter: "https://twitter.com/mipaltan",
    instagram: "https://instagram.com/mipaltan",
    facebook: "https://facebook.com/officialmumbaiindians",
  },
});
```

## Features to Implement

- User authentication and authorization
- Comment and discussion forum
- Advanced search and filtering
- Player comparison tool
- Fantasy league integration
- Mobile app (React Native)
- Admin dashboard
- Email notifications
- Live match commentary
- Merchandise store

## Contributing

Feel free to fork this project and submit pull requests for any improvements.

## License

This project is open source and available under the MIT License.

## Author

Created as part of the ShadowFox Internship Program

---

**Happy Coding! 🏏**
