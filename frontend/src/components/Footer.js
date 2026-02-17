import React from 'react';
import '../styles/footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3>About</h3>
          <p>Official fan hub for Kolkata Knight Riders - Three-time IPL Champions. Korbo Lorbo Jeetbo Re!</p>
        </div>
        
        <div className="footer-section">
          <h3>Quick Links</h3>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/players">Players</a></li>
            <li><a href="/matches">Matches</a></li>
            <li><a href="/news">News</a></li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h3>Follow Us</h3>
          <div className="social-links">
            <a href="https://twitter.com/KKRiders" target="_blank" rel="noopener noreferrer" className="social-link">Twitter</a>
            <a href="https://instagram.com/kkriders" target="_blank" rel="noopener noreferrer" className="social-link">Instagram</a>
            <a href="https://facebook.com/KolkataKnightRiders" target="_blank" rel="noopener noreferrer" className="social-link">Facebook</a>
          </div>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; {currentYear} KKR. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
