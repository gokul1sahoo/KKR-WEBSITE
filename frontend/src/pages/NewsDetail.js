import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getNewsById } from '../services/api';
import '../styles/newsDetail.css';

const NewsDetail = () => {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await getNewsById(id);
        setArticle(response.data);
      } catch (error) {
        console.error('Error fetching news article:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id]);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!article) {
    return (
      <div className="news-detail">
        <p className="no-data">News article not found.</p>
        <Link to="/news" className="news-back">Back to News</Link>
      </div>
    );
  }

  return (
    <div className="news-detail">
      <div className="news-detail-container">
        <Link to="/news" className="news-back">← Back to News</Link>

        <div className="news-detail-header">
          <h1>{article.title}</h1>
          <div className="news-detail-meta">
            <span>By {article.author || 'Admin'}</span>
            <span>{formatDate(article.publishedAt)}</span>
            <span>👁️ {article.views} views</span>
          </div>
        </div>

        <div className="news-detail-image">
          <img
            src={article.image || 'https://via.placeholder.com/900x450?text=No+Image'}
            alt={article.title}
          />
        </div>

        <div className="news-detail-content">
          <p>{article.content}</p>
        </div>
      </div>
    </div>
  );
};

export default NewsDetail;
