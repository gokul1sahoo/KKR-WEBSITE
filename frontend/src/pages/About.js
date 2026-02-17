import React from 'react';
import '../styles/about.css';

const About = () => {
  return (
    <div className="about-page">
      <section className="about-header">
        <h1>About Kolkata Knight Riders</h1>
        <p>Two-Time IPL Champions - Korbo Lorbo Jeetbo Re!</p>
      </section>

      <section className="about-content">
        <div className="about-section">
          <h2>Our Legacy</h2>
          <p>
            Kolkata Knight Riders, owned by Bollywood superstar Shah Rukh Khan's Red Chillies Entertainment,
            is one of the most successful franchises in IPL history. Founded in 2008, KKR has won the IPL
            championship twice (2012 and 2014) under the leadership of Gautam Gambhir. Known for their
            iconic purple and gold colors and the motto "Korbo Lorbo Jeetbo Re" (We Will Act, We Will Fight,
            We Will Win), KKR has one of the most passionate fan bases in cricket.
          </p>
        </div>

        <div className="about-section">
          <h2>What We Offer</h2>
          <ul>
            <li><strong>Team Information:</strong> Comprehensive details about your favorite IPL team, including coach, captain, and team history</li>
            <li><strong>Player Profiles:</strong> Detailed player profiles with statistics, roles, and achievements</li>
            <li><strong>Match Schedules:</strong> Upcoming match schedules, live scores, and detailed match reports</li>
            <li><strong>Latest News:</strong> Breaking news, transfers, match reports, and team updates</li>
            <li><strong>Fan Engagement:</strong> Interactive polls, forums, and social media integration</li>
            <li><strong>Live Updates:</strong> Real-time match updates and live commentary</li>
          </ul>
        </div>

        <div className="about-section">
          <h2>Technology Stack</h2>
          <p>
            This platform is built using the MERN stack (MongoDB, Express, React, Node.js) to deliver 
            a fast, responsive, and feature-rich user experience. Our modern architecture ensures 
            scalability and reliability for millions of cricket fans.
          </p>
        </div>

        <div className="about-section">
          <h2>Get In Touch</h2>
          <p>
            Have suggestions or feedback? We'd love to hear from you! Reach out to us through our 
            social media channels or contact us directly at info@iplteamhub.com
          </p>
        </div>
      </section>
    </div>
  );
};

export default About;
