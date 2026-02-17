const mongoose = require('mongoose');
require('dotenv').config();

const Team = require('./models/Team');
const Player = require('./models/Player');
const Match = require('./models/Match');
const News = require('./models/News');
const Poll = require('./models/Poll');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ipl-team-website')
  .then(() => console.log('MongoDB connected for seeding'))
  .catch(err => console.error('MongoDB connection error:', err));

// KKR Team Data (Updated for IPL 2026)
const kkrTeam = {
  name: "Kolkata Knight Riders",
  logo: "https://upload.wikimedia.org/wikipedia/en/4/4c/Kolkata_Knight_Riders_Logo.svg",
  founded: 2008,
  headquarters: "Kolkata, West Bengal",
  coachName: "Abhishek Nayar",
  captainName: "Ajinkya Rahane",
  description: "Kolkata Knight Riders (KKR) is a franchise cricket team representing Kolkata in the Indian Premier League. Owned by Bollywood actor Shah Rukh Khan's Red Chillies Entertainment, KKR has won the IPL championship three times in 2012, 2014, and 2024. 'Korbo Lorbo Jeetbo Re' - We will do, fight, and win!",
  colors: ["Purple", "Gold"],
  wins: 125,
  losses: 108,
  socialLinks: {
    twitter: "https://twitter.com/KKRiders",
    instagram: "https://instagram.com/kkriders",
    facebook: "https://facebook.com/KolkataKnightRiders"
  }
};

// KKR Players Data (Official IPL 2026 Squad from iplt20.com)
const kkrPlayers = [
  // BATTERS
  {
    name: "Ajinkya Rahane",
    jerseyNumber: 3,
    role: "Batsman",
    battingStyle: "Right-hand bat",
    bowlingStyle: "Right-arm off break",
    dateOfBirth: new Date("1988-11-06"),
    nationality: "India",
    profileImage: "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320,q_50/lsci/db/PICTURES/CMS/319900/319946.png",
    statistics: {
      matches: 13,
      runs: 390,
      wickets: 0,
      strikeRate: 147.73,
      bowlingAverage: 0
    },
    biography: "Captain of KKR for IPL 2026. A right-handed top-order batter with a perfect combination of talent, consistency and aggression. Known for his elegant stroke-play and solid temperament."
  },
  {
    name: "Rinku Singh",
    jerseyNumber: 28,
    role: "Batsman",
    battingStyle: "Left-hand bat",
    bowlingStyle: "Right-arm off break",
    dateOfBirth: new Date("1997-10-12"),
    nationality: "India",
    profileImage: "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320,q_50/lsci/db/PICTURES/CMS/348400/348482.png",
    statistics: {
      matches: 42,
      runs: 965,
      wickets: 0,
      strikeRate: 145.8,
      bowlingAverage: 0
    },
    biography: "Rising star and finisher for KKR, known for his match-winning performances. A left-handed hard-hitting batsman who thrives under pressure."
  },
  {
    name: "Angkrish Raghuvanshi",
    jerseyNumber: 21,
    role: "Batsman",
    battingStyle: "Right-hand bat",
    bowlingStyle: "Right-arm off break",
    dateOfBirth: new Date("2005-01-16"),
    nationality: "India",
    profileImage: "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320,q_50/lsci/db/PICTURES/CMS/377200/377282.png",
    statistics: {
      matches: 8,
      runs: 185,
      wickets: 0,
      strikeRate: 142.5,
      bowlingAverage: 0
    },
    biography: "Young and talented opening batsman with impressive strokeplay. One of India's brightest prospects."
  },
  {
    name: "Manish Pandey",
    jerseyNumber: 18,
    role: "Batsman",
    battingStyle: "Right-hand bat",
    bowlingStyle: "Right-arm medium",
    dateOfBirth: new Date("1989-10-10"),
    nationality: "India",
    profileImage: "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320,q_50/lsci/db/PICTURES/CMS/302700/302782.png",
    statistics: {
      matches: 168,
      runs: 3650,
      wickets: 2,
      strikeRate: 125.8,
      bowlingAverage: 45.0
    },
    biography: "Experienced middle-order batsman with excellent finishing abilities. Known for his consistency and composure."
  },
  {
    name: "Cameron Green",
    jerseyNumber: 77,
    role: "Batsman",
    battingStyle: "Right-hand bat",
    bowlingStyle: "Right-arm fast-medium",
    dateOfBirth: new Date("1999-06-03"),
    nationality: "Australia",
    profileImage: "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320,q_50/lsci/db/PICTURES/CMS/348900/348991.png",
    statistics: {
      matches: 25,
      runs: 485,
      wickets: 12,
      strikeRate: 138.7,
      bowlingAverage: 32.4
    },
    biography: "Tall Australian all-rounder with powerful hitting and useful pace bowling. A genuine batting all-rounder."
  },
  {
    name: "Finn Allen",
    jerseyNumber: 52,
    role: "Wicket-keeper",
    battingStyle: "Right-hand bat",
    bowlingStyle: "Right-arm off break",
    dateOfBirth: new Date("2000-04-22"),
    nationality: "New Zealand",
    profileImage: "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320,q_50/lsci/db/PICTURES/CMS/327700/327763.png",
    statistics: {
      matches: 18,
      runs: 425,
      wickets: 0,
      strikeRate: 165.3,
      bowlingAverage: 0
    },
    biography: "Explosive New Zealand wicket-keeper batsman known for aggressive stroke-play at the top of the order."
  },
  {
    name: "Tejasvi Singh",
    jerseyNumber: 66,
    role: "Wicket-keeper",
    battingStyle: "Right-hand bat",
    bowlingStyle: "Right-arm medium",
    dateOfBirth: new Date("2003-08-15"),
    nationality: "India",
    profileImage: "https://www.iplt20.com/assets/images/default-player-image.png",
    statistics: {
      matches: 2,
      runs: 35,
      wickets: 0,
      strikeRate: 128.5,
      bowlingAverage: 0
    },
    biography: "Young Indian wicket-keeper batsman with potential. A promising talent for the future."
  },
  {
    name: "Rahul Tripathi",
    jerseyNumber: 23,
    role: "Batsman",
    battingStyle: "Right-hand bat",
    bowlingStyle: "Right-arm off break",
    dateOfBirth: new Date("1991-03-02"),
    nationality: "India",
    profileImage: "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320,q_50/lsci/db/PICTURES/CMS/322100/322192.png",
    statistics: {
      matches: 91,
      runs: 2378,
      wickets: 1,
      strikeRate: 142.8,
      bowlingAverage: 48.0
    },
    biography: "Aggressive middle-order batsman capable of scoring quickly. Known for his innovative shot-making."
  },
  {
    name: "Tim Seifert",
    jerseyNumber: 55,
    role: "Wicket-keeper",
    battingStyle: "Right-hand bat",
    bowlingStyle: "Right-arm medium",
    dateOfBirth: new Date("1994-12-12"),
    nationality: "New Zealand",
    profileImage: "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320,q_50/lsci/db/PICTURES/CMS/304800/304854.png",
    statistics: {
      matches: 15,
      runs: 245,
      wickets: 0,
      strikeRate: 148.2,
      bowlingAverage: 0
    },
    biography: "New Zealand wicket-keeper batsman with aggressive intent. A hard-hitting player in the middle order."
  },
  {
    name: "Rovman Powell",
    jerseyNumber: 27,
    role: "Batsman",
    battingStyle: "Right-hand bat",
    bowlingStyle: "Right-arm medium",
    dateOfBirth: new Date("1993-07-23"),
    nationality: "West Indies",
    profileImage: "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320,q_50/lsci/db/PICTURES/CMS/304400/304486.png",
    statistics: {
      matches: 52,
      runs: 895,
      wickets: 3,
      strikeRate: 152.5,
      bowlingAverage: 38.5
    },
    biography: "West Indian power-hitter who can clear the boundaries with ease. Captain of West Indies T20 team."
  },

  // ALL-ROUNDERS
  {
    name: "Anukul Roy",
    jerseyNumber: 44,
    role: "All-rounder",
    battingStyle: "Left-hand bat",
    bowlingStyle: "Slow left-arm orthodox",
    dateOfBirth: new Date("1998-11-30"),
    nationality: "India",
    profileImage: "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320,q_50/lsci/db/PICTURES/CMS/304900/304920.png",
    statistics: {
      matches: 12,
      runs: 95,
      wickets: 15,
      strikeRate: 125.0,
      bowlingAverage: 26.8
    },
    biography: "Left-arm spinner and handy lower-order batsman. Part of India's U-19 World Cup winning squad."
  },
  {
    name: "Sarthak Ranjan",
    jerseyNumber: 88,
    role: "All-rounder",
    battingStyle: "Right-hand bat",
    bowlingStyle: "Right-arm off break",
    dateOfBirth: new Date("2004-05-20"),
    nationality: "India",
    profileImage: "https://www.iplt20.com/assets/images/default-player-image.png",
    statistics: {
      matches: 1,
      runs: 8,
      wickets: 1,
      strikeRate: 115.0,
      bowlingAverage: 28.0
    },
    biography: "Young all-rounder with promising abilities in both batting and bowling. Emerging talent from domestic cricket."
  },
  {
    name: "Daksh Kamra",
    jerseyNumber: 91,
    role: "All-rounder",
    battingStyle: "Right-hand bat",
    bowlingStyle: "Right-arm medium",
    dateOfBirth: new Date("2005-03-18"),
    nationality: "India",
    profileImage: "https://www.iplt20.com/assets/images/default-player-image.png",
    statistics: {
      matches: 0,
      runs: 0,
      wickets: 0,
      strikeRate: 0,
      bowlingAverage: 0
    },
    biography: "Uncapped all-rounder from Delhi. A promising young talent picked up in IPL 2026 auction."
  },
  {
    name: "Rachin Ravindra",
    jerseyNumber: 48,
    role: "All-rounder",
    battingStyle: "Left-hand bat",
    bowlingStyle: "Slow left-arm orthodox",
    dateOfBirth: new Date("1999-11-18"),
    nationality: "New Zealand",
    profileImage: "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320,q_50/lsci/db/PICTURES/CMS/348500/348583.png",
    statistics: {
      matches: 15,
      runs: 385,
      wickets: 8,
      strikeRate: 135.6,
      bowlingAverage: 32.5
    },
    biography: "Talented New Zealand all-rounder with a bright future. Left-handed batsman and left-arm orthodox spinner."
  },
  {
    name: "Ramandeep Singh",
    jerseyNumber: 17,
    role: "All-rounder",
    battingStyle: "Right-hand bat",
    bowlingStyle: "Right-arm medium",
    dateOfBirth: new Date("1997-09-13"),
    nationality: "India",
    profileImage: "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320,q_50/lsci/db/PICTURES/CMS/327600/327698.png",
    statistics: {
      matches: 18,
      runs: 187,
      wickets: 12,
      strikeRate: 142.0,
      bowlingAverage: 32.5
    },
    biography: "Young all-rounder from Punjab with big-hitting abilities and useful pace bowling."
  },

  // BOWLERS
  {
    name: "Vaibhav Arora",
    jerseyNumber: 39,
    role: "Bowler",
    battingStyle: "Right-hand bat",
    bowlingStyle: "Right-arm fast-medium",
    dateOfBirth: new Date("1999-08-28"),
    nationality: "India",
    profileImage: "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320,q_50/lsci/db/PICTURES/CMS/348400/348495.png",
    statistics: {
      matches: 22,
      runs: 18,
      wickets: 28,
      strikeRate: 95.5,
      bowlingAverage: 24.5
    },
    biography: "Right-arm fast-medium bowler from Himachal Pradesh. Known for swing bowling and early breakthroughs."
  },
  {
    name: "Matheesha Pathirana",
    jerseyNumber: 99,
    role: "Bowler",
    battingStyle: "Right-hand bat",
    bowlingStyle: "Right-arm fast",
    dateOfBirth: new Date("2002-10-13"),
    nationality: "Sri Lanka",
    profileImage: "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320,q_50/lsci/db/PICTURES/CMS/348400/348438.png",
    statistics: {
      matches: 18,
      runs: 12,
      wickets: 24,
      strikeRate: 88.0,
      bowlingAverage: 22.8
    },
    biography: "Young Sri Lankan fast bowler with a unique slinging action. Known as 'Baby Malinga' for his bowling style."
  },
  {
    name: "Kartik Tyagi",
    jerseyNumber: 54,
    role: "Bowler",
    battingStyle: "Right-hand bat",
    bowlingStyle: "Right-arm fast",
    dateOfBirth: new Date("2000-11-08"),
    nationality: "India",
    profileImage: "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320,q_50/lsci/db/PICTURES/CMS/304800/304837.png",
    statistics: {
      matches: 16,
      runs: 8,
      wickets: 18,
      strikeRate: 92.5,
      bowlingAverage: 28.5
    },
    biography: "Young Indian fast bowler with raw pace. Part of India's U-19 World Cup winning team."
  },
  {
    name: "Prashant Solanki",
    jerseyNumber: 73,
    role: "Bowler",
    battingStyle: "Right-hand bat",
    bowlingStyle: "Right-arm off break",
    dateOfBirth: new Date("2002-06-12"),
    nationality: "India",
    profileImage: "https://www.iplt20.com/assets/images/default-player-image.png",
    statistics: {
      matches: 3,
      runs: 2,
      wickets: 4,
      strikeRate: 75.0,
      bowlingAverage: 26.0
    },
    biography: "Off-spin bowler from Maharashtra. An emerging talent in domestic cricket."
  },
  {
    name: "Akash Deep",
    jerseyNumber: 87,
    role: "Bowler",
    battingStyle: "Right-hand bat",
    bowlingStyle: "Right-arm fast-medium",
    dateOfBirth: new Date("1996-12-15"),
    nationality: "India",
    profileImage: "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320,q_50/lsci/db/PICTURES/CMS/348400/348416.png",
    statistics: {
      matches: 8,
      runs: 5,
      wickets: 12,
      strikeRate: 88.5,
      bowlingAverage: 24.8
    },
    biography: "Bengal fast bowler who has impressed in domestic cricket. Made his Test debut for India in 2024."
  },
  {
    name: "Harshit Rana",
    jerseyNumber: 19,
    role: "Bowler",
    battingStyle: "Right-hand bat",
    bowlingStyle: "Right-arm fast",
    dateOfBirth: new Date("2002-12-22"),
    nationality: "India",
    profileImage: "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320,q_50/lsci/db/PICTURES/CMS/348400/348430.png",
    statistics: {
      matches: 15,
      runs: 28,
      wickets: 22,
      strikeRate: 112.0,
      bowlingAverage: 28.5
    },
    biography: "Young fast bowler from Delhi with genuine pace. Part of Delhi's Ranji Trophy winning squad."
  },
  {
    name: "Umran Malik",
    jerseyNumber: 58,
    role: "Bowler",
    battingStyle: "Right-hand bat",
    bowlingStyle: "Right-arm fast",
    dateOfBirth: new Date("1999-11-22"),
    nationality: "India",
    profileImage: "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320,q_50/lsci/db/PICTURES/CMS/327600/327695.png",
    statistics: {
      matches: 28,
      runs: 18,
      wickets: 32,
      strikeRate: 98.5,
      bowlingAverage: 30.2
    },
    biography: "One of India's fastest bowlers, capable of bowling over 150 km/h. Known for express pace."
  },
  {
    name: "Sunil Narine",
    jerseyNumber: 74,
    role: "Bowler",
    battingStyle: "Left-hand bat",
    bowlingStyle: "Right-arm off break",
    dateOfBirth: new Date("1988-05-26"),
    nationality: "West Indies",
    profileImage: "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320,q_50/lsci/db/PICTURES/CMS/304400/304489.png",
    statistics: {
      matches: 162,
      runs: 1125,
      wickets: 165,
      strikeRate: 168.2,
      bowlingAverage: 24.8
    },
    biography: "Master spinner and explosive opening batsman for KKR. One of the most successful bowlers in IPL history."
  },
  {
    name: "Varun Chakaravarthy",
    jerseyNumber: 29,
    role: "Bowler",
    battingStyle: "Right-hand bat",
    bowlingStyle: "Right-arm off break",
    dateOfBirth: new Date("1991-08-01"),
    nationality: "India",
    profileImage: "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320,q_50/lsci/db/PICTURES/CMS/304800/304840.png",
    statistics: {
      matches: 13,
      runs: 0,
      wickets: 17,
      strikeRate: 0,
      bowlingAverage: 7.66
    },
    biography: "Mystery spinner and key wicket-taker for KKR. One of the Purple Cap contenders with exceptional economy rate."
  }
];

// Sample News Articles (Updated for IPL 2026)
const newsArticles = [
  {
    title: "Ajinkya Rahane Named Captain of Kolkata Knight Riders",
    content: "Kolkata Knight Riders have appointed experienced batsman Ajinkya Rahane as captain for IPL 2026. The right-handed batter led Mumbai to their 42nd Ranji Trophy title and was the highest run-scorer in the 2024 Syed Mushtaq Ali Trophy. KKR management believes his leadership and form make him the perfect choice to lead the franchise.",
    image: "https://via.placeholder.com/400x250?text=Ajinkya+Rahane+Captain",
    author: "KKR Media Team",
    category: "General",
    publishedAt: new Date("2026-01-21")
  },
  {
    title: "KKR Announces Retained Players Ahead of IPL 2026 Auction",
    content: "Kolkata Knight Riders have announced their retained players ahead of the TATA IPL 2026 Auction. The franchise has shown faith in their core group including match-winners like Rinku Singh and Varun Chakaravarthy. With Abhishek Nayar as head coach and Shane Watson joining as assistant coach, KKR is building a formidable squad.",
    image: "https://via.placeholder.com/400x250?text=KKR+Retentions",
    author: "Sports Desk",
    category: "Transfer",
    publishedAt: new Date("2025-11-01")
  },
  {
    title: "Varun Chakaravarthy: Purple Cap Contender Returns Stronger",
    content: "Mystery spinner Varun Chakaravarthy has been in exceptional form for KKR in IPL 2025, taking 17 wickets in 13 matches with an outstanding economy rate of 7.66. The Tamil Nadu spinner is among the favorites for the Purple Cap and will be crucial to KKR's bowling attack in IPL 2026.",
    image: "https://via.placeholder.com/400x250?text=Varun+Chakaravarthy",
    author: "KKR Insider",
    category: "Achievement",
    publishedAt: new Date("2026-02-05")
  }
];

// Sample Polls (Updated for IPL 2026)
const polls = [
  {
    question: "Who will be KKR's top run scorer this season?",
    options: [
      { option: "Ajinkya Rahane", votes: 145 },
      { option: "Rinku Singh", votes: 230 },
      { option: "Sunil Narine", votes: 98 },
      { option: "Rovman Powell", votes: 67 }
    ],
    active: true
  },
  {
    question: "Which bowler will take most wickets for KKR?",
    options: [
      { option: "Varun Chakaravarthy", votes: 189 },
      { option: "Matheesha Pathirana", votes: 156 },
      { option: "Sunil Narine", votes: 112 },
      { option: "Harshit Rana", votes: 45 }
    ],
    active: true
  },
  {
    question: "Will KKR defend their IPL 2024 title in 2026?",
    options: [
      { option: "Yes, definitely!", votes: 478 },
      { option: "Close call, but yes", votes: 234 },
      { option: "Not sure", votes: 89 },
      { option: "Unlikely", votes: 23 }
    ],
    active: true
  }
];

// Sample Matches
const matches = [
  {
    matchNumber: 1,
    date: new Date("2026-03-25T19:30:00"),
    venue: "Eden Gardens, Kolkata",
    status: "Upcoming",
    description: "KKR season opener at home"
  },
  {
    matchNumber: 5,
    date: new Date("2026-03-30T19:30:00"),
    venue: "Wankhede Stadium, Mumbai",
    status: "Upcoming",
    description: "KKR vs MI away match"
  },
  {
    matchNumber: 8,
    date: new Date("2026-04-03T15:30:00"),
    venue: "Eden Gardens, Kolkata",
    status: "Upcoming",
    description: "KKR home match"
  }
];

// Seed function
async function seedDatabase() {
  try {
    // Clear existing data
    console.log('Clearing existing data...');
    await Team.deleteMany({});
    await Player.deleteMany({});
    await News.deleteMany({});
    await Poll.deleteMany({});
    await Match.deleteMany({});

    // Insert KKR team
    console.log('Inserting KKR team data...');
    const team = await Team.create(kkrTeam);
    console.log('✓ Team created:', team.name);

    // Insert players with team reference
    console.log('Inserting KKR players...');
    const playersWithTeam = kkrPlayers.map(player => ({
      ...player,
      teamId: team._id
    }));
    const players = await Player.insertMany(playersWithTeam);
    console.log(`✓ ${players.length} players added`);

    // Insert news with team reference
    console.log('Inserting news articles...');
    const newsWithTeam = newsArticles.map(article => ({
      ...article,
      teamId: team._id
    }));
    const news = await News.insertMany(newsWithTeam);
    console.log(`✓ ${news.length} news articles added`);

    // Insert polls with team reference
    console.log('Inserting polls...');
    const pollsWithTeam = polls.map(poll => ({
      ...poll,
      teamId: team._id
    }));
    const createdPolls = await Poll.insertMany(pollsWithTeam);
    console.log(`✓ ${createdPolls.length} polls added`);

    // Insert matches
    console.log('Inserting matches...');
    const matchesWithTeam = matches.map(match => ({
      ...match,
      homeTeam: team._id
    }));
    const createdMatches = await Match.insertMany(matchesWithTeam);
    console.log(`✓ ${createdMatches.length} matches added`);

    console.log('\n🎉 Database seeded successfully for Kolkata Knight Riders!');
    console.log('Korbo Lorbo Jeetbo Re! 💜⚡');
    
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    mongoose.connection.close();
  }
}

// Run seed function
seedDatabase();
