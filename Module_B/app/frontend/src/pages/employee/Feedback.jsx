import React, { useState, useMemo, useEffect } from 'react';
import { Search, Star } from 'lucide-react';
import { getAssignedFeedbacks } from '../../utils/employeeApi';
import '../../styles/admin.css';

const EmployeeFeedback = () => {
  const currentEmployee = useMemo(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user.employeeId;
  }, []);

  const [feedbacks, setFeedbacks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRating, setFilterRating] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!currentEmployee) {
      setError('No employee ID found.');
      setLoading(false);
      return;
    }
    const fetchFeedbacks = async () => {
      setLoading(true);
      try {
        const data = await getAssignedFeedbacks(currentEmployee);
        setFeedbacks(data);
      } catch (err) {
        setError(err.message || 'Failed to load feedbacks');
      } finally {
        setLoading(false);
      }
    };
    fetchFeedbacks();
  }, [currentEmployee]);

  // IDs are numbers — use String() before .toLowerCase()
  const filteredFeedbacks = feedbacks.filter((feedback) => {
    const search = searchTerm.toLowerCase();
    const matchesSearch =
      String(feedback.member_id).toLowerCase().includes(search) ||
      String(feedback.order_id).toLowerCase().includes(search);
    const matchesRating =
      filterRating === 'all' || feedback.rating === parseInt(filterRating);
    return matchesSearch && matchesRating;
  });

  const averageRating =
    feedbacks.length > 0
      ? (feedbacks.reduce((s, f) => s + f.rating, 0) / feedbacks.length).toFixed(1)
      : 0;

  const getRatingStars = (rating) =>
    [...Array(5)].map((_, i) => (
      <Star
        key={i}
        size={16}
        style={{
          fill: i < rating ? '#fbbf24' : '#e5e7eb',
          color: i < rating ? '#fbbf24' : '#e5e7eb',
        }}
      />
    ));

  return (
    <div className="admin-page">
      <header className="page-header">
        <h1>Assigned Orders — Feedback</h1>
        <p>View customer feedback for your assigned orders</p>
      </header>

      {error && (
        <div style={{ background: '#fee2e2', color: '#dc2626', padding: '12px 16px', borderRadius: 8, marginBottom: 16 }}>
          ⚠️ {error}
        </div>
      )}

      {/* ── Stats ── */}
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
          <span className="stat-label">Excellent</span>
        </div>
      </div>

      {/* ── Search + rating filter ── */}
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

      {/* ── Feedback cards ── */}
      {loading ? (
        <p style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>Loading feedbacks…</p>
      ) : (
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
              <p>{feedbacks.length === 0 ? 'No feedbacks received yet' : 'No feedbacks match your search'}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default EmployeeFeedback;
