import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/newsCard.css';

const NewsCard = ({ article }) => {
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <div className="news-card">
      <div className="news-image">
        <img src={article.image || 'https://via.placeholder.com/400x250?text=No+Image'} alt={article.title} />
        <span className="news-category">{article.category}</span>
      </div>
      
      <div className="news-content">
        <h3>{article.title}</h3>
        
        <div className="news-meta">
          <span className="news-author">By {article.author || 'Admin'}</span>
          <span className="news-date">{formatDate(article.publishedAt)}</span>
          <span className="news-views">👁️ {article.views} views</span>
        </div>
        
        <p className="news-excerpt">{article.content.substring(0, 120)}...</p>
        
        <Link to={`/news/${article._id}`} className="read-more">
          Read More →
        </Link>
      </div>
    </div>
  );
};

export default NewsCard;
