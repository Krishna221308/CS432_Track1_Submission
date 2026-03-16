import React, { useState, useEffect } from 'react';
import { Search, Star } from 'lucide-react';
import '../../styles/admin.css';

const AdminFeedbacks = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  
  useEffect(() => {
    // TODO: Fetch feedbacks from backend API
    // setFeedbacks(fetchedFeedbacks);
  }, []);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRating, setFilterRating] = useState('all');

  const filteredFeedbacks = feedbacks.filter((feedback) => {
    const matchesSearch =
      feedback.member_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      feedback.order_id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRating = filterRating === 'all' || feedback.rating === parseInt(filterRating);
    return matchesSearch && matchesRating;
  });

  const averageRating = (
    feedbacks.reduce((sum, f) => sum + f.rating, 0) / feedbacks.length
  ).toFixed(1);

  const getRatingStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        size={16}
        style={{
          fill: i < rating ? '#fbbf24' : '#e5e7eb',
          color: i < rating ? '#fbbf24' : '#e5e7eb',
        }}
      />
    ));
  };

  return (
    <div className="admin-page">
      <header className="page-header">
        <h1>Customer Feedbacks</h1>
        <p>Review and manage customer feedback and ratings</p>
      </header>

      <div className="stats-section">
        <div className="stat-box">
          <h3>Average Rating</h3>
          <p className="stat-value">{averageRating} / 5</p>
          <div className="rating-stars">{getRatingStars(Math.round(averageRating))}</div>
        </div>
        <div className="stat-box">
          <h3>Total Feedbacks</h3>
          <p className="stat-value">{feedbacks.length}</p>
          <span className="stat-label">Reviews Received</span>
        </div>
        <div className="stat-box">
          <h3>5-Star Reviews</h3>
          <p className="stat-value" style={{ color: '#10b981' }}>
            {feedbacks.filter((f) => f.rating === 5).length}
          </p>
          <span className="stat-label">Excellent Service</span>
        </div>
      </div>

      <div className="filters-section">
        <div className="search-box">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search by member ID or order ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-buttons">
          <button
            className={`filter-btn ${filterRating === 'all' ? 'active' : ''}`}
            onClick={() => setFilterRating('all')}
          >
            All ({feedbacks.length})
          </button>
          {[5, 4, 3, 2, 1].map((rating) => (
            <button
              key={rating}
              className={`filter-btn ${filterRating === rating.toString() ? 'active' : ''}`}
              onClick={() => setFilterRating(rating.toString())}
            >
              {rating}★ ({feedbacks.filter((f) => f.rating === rating).length})
            </button>
          ))}
        </div>
      </div>

      <div className="feedbacks-grid">
        {filteredFeedbacks.length > 0 ? (
          filteredFeedbacks.map((feedback) => (
            <div key={feedback.feedback_id} className="feedback-card">
              <div className="feedback-header">
                <div>
                  <h3>Member: {feedback.member_id}</h3>
                  <p className="feedback-order">Order: {feedback.order_id}</p>
                </div>
                <div className="rating-display">{feedback.rating}.0</div>
              </div>

              <div className="feedback-stars">{getRatingStars(feedback.rating)}</div>

              <p className="feedback-comment">{feedback.comments}</p>

              <p className="feedback-date">{feedback.feedback_date}</p>
            </div>
          ))
        ) : (
          <div className="no-data-container">
            <p>No feedbacks found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminFeedbacks;
