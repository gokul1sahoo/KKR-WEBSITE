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


## Contributing

Feel free to fork this project and submit pull requests for any improvements.

## License

This project is open source and available under the MIT License.

## Author

Gokul Sahoo
## To see website

https://kkr-website.onrender.com

