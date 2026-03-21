import React, { useState, useMemo, useEffect } from 'react';
import { Star, Plus, AlertCircle } from 'lucide-react';
import { useToast } from '../../components/Toast';
import '../../styles/admin.css';
import { getMemberId } from '../../utils/auth';

const UserFeedback = () => {
  const currentMember = getMemberId();

  const [memberOrders, setMemberOrders] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);

  useEffect(() => {
    if (!currentMember) return;

    const fetchData = async () => {
      try {
        const ordersRes = await fetch(`http://localhost:5000/api/user/orders/${currentMember}`);
        const ordersData = await ordersRes.json();
        if (ordersRes.ok) setMemberOrders(ordersData);

        // Note: Currently no specific API for member feedbacks list in the refactor, 
        // normally we'd fetch these from a user-specific feedback endpoint.
        // For now, we'll fetch from a general list or just use an empty array.
        // Assuming we might add GET /api/user/feedbacks/%member_id%
      } catch (err) {
        console.error('Error fetching feedback data:', err);
      }
    };

    fetchData();
  }, [currentMember]);
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState('');
  const [rating, setRating] = useState(5);
  const [comments, setComments] = useState('');
  const [hoverRating, setHoverRating] = useState(0);
  const addToast = useToast();

  const handleSubmitFeedback = async () => {
    if (!selectedOrder) {
      addToast('Please select an order', 'error');
      return;
    }

    if (feedbacks.some((f) => f.order_id === selectedOrder)) {
      addToast('You have already provided feedback for this order', 'warning');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/user/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          member_id: currentMember,
          order_id: selectedOrder,
          rating,
          comments
        }),
      });

      if (!response.ok) throw new Error('Failed to submit feedback');

      addToast('Thank you for your feedback!', 'success');

      // Refresh local state (simplified)
      setFeedbacks([...feedbacks, { order_id: selectedOrder, rating, comments, feedback_date: 'Just now' }]);

      setSelectedOrder('');
      setRating(5);
      setComments('');
      setShowFeedbackForm(false);
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  const averageRating = useMemo(() => {
    if (feedbacks.length === 0) return 0;
    const total = feedbacks.reduce((sum, f) => sum + f.rating, 0);
    return (total / feedbacks.length).toFixed(1);
  }, [feedbacks]);

  const getRatingStar = (starValue, currentRating = rating) => {
    return starValue <= currentRating ? '#fbbf24' : '#e5e7eb';
  };

  return (
    <div className="admin-page">
      <header className="page-header">
        <h1>My Feedback</h1>
        <p>Share your experience with our service</p>
      </header>


      <div className="stats-section">
        <div className="stat-box">
          <h3>Total Feedbacks</h3>
          <p className="stat-value">{feedbacks.length}</p>
          <span className="stat-label">Submitted</span>
        </div>
        <div className="stat-box">
          <h3>Average Rating</h3>
          <p className="stat-value" style={{ color: '#fbbf24' }}>{averageRating}</p>
          <span className="stat-label">Stars</span>
        </div>
        <div className="stat-box">
          <h3>5-Star Reviews</h3>
          <p className="stat-value" style={{ color: '#10b981' }}>
            {feedbacks.filter((f) => f.rating === 5).length}
          </p>
        </div>
        <div className="stat-box">
          <h3>Eligible to Review</h3>
          <p className="stat-value">{memberOrders.length - feedbacks.length}</p>
          <span className="stat-label">Orders</span>
        </div>
      </div>

      <div className="form-card">
        <div className="card-header">
          <h2>Leave Feedback</h2>
          {!showFeedbackForm && memberOrders.length > feedbacks.length && (
            <button className="btn btn-primary" onClick={() => setShowFeedbackForm(true)}>
              <Plus size={18} style={{ marginRight: '8px' }} />
              Add Feedback
            </button>
          )}
        </div>

        {showFeedbackForm && (
          <div className="form-body">
            <div className="form-group">
              <label htmlFor="order-select">Select Order *</label>
              <select
                id="order-select"
                className="form-select"
                value={selectedOrder}
                onChange={(e) => setSelectedOrder(e.target.value)}
              >
                <option value="">-- Choose an Order --</option>
                {memberOrders
                  .filter((order) => !feedbacks.some((f) => f.order_id === order.order_id))
                  .map((order) => (
                    <option key={order.order_id} value={order.order_id}>
                      {order.order_id} - {order.order_date}
                    </option>
                  ))}
              </select>
            </div>

            <div className="form-group">
              <label>Rate Your Experience *</label>
              <div className="rating-input">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    className="star-btn"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                  >
                    <Star
                      size={32}
                      fill={getRatingStar(star, hoverRating || rating)}
                      color={getRatingStar(star, hoverRating || rating)}
                    />
                  </button>
                ))}
              </div>
              <p className="rating-label">
                {rating === 1 && 'Poor'}
                {rating === 2 && 'Fair'}
                {rating === 3 && 'Good'}
                {rating === 4 && 'Very Good'}
                {rating === 5 && 'Excellent'}
              </p>
            </div>

            <div className="form-group">
              <label htmlFor="comments">Comments (optional)</label>
              <textarea
                id="comments"
                className="form-textarea"
                placeholder="Share your experience... (max 500 characters)"
                value={comments}
                onChange={(e) => setComments(e.target.value.slice(0, 500))}
                rows="4"
              />
              <p className="char-count">{comments.length}/500</p>
            </div>

            <div className="form-actions">
              <button className="btn btn-secondary" onClick={() => setShowFeedbackForm(false)}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleSubmitFeedback}>
                Submit Feedback
              </button>
            </div>
          </div>
        )}
      </div>

      {feedbacks.length > 0 && (
        <div className="feedback-grid">
          <h2>Your Reviews</h2>
          <div className="grid">
            {feedbacks.map((feedback) => (
              <div className="feedback-card" key={feedback.feedback_id}>
                <div className="feedback-header">
                  <div className="feedback-meta">
                    <p className="feedback-order">Order ID: {feedback.order_id}</p>
                    <p className="feedback-date">{feedback.feedback_date}</p>
                  </div>
                </div>
                <div className="rating-display">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={18}
                      fill={star <= feedback.rating ? '#fbbf24' : '#e5e7eb'}
                      color={star <= feedback.rating ? '#fbbf24' : '#e5e7eb'}
                    />
                  ))}
                  <span className="rating-value">({feedback.rating}/5)</span>
                </div>
                {feedback.comments && <p className="feedback-comments">{feedback.comments}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      <style>{`
        .form-card {
          background: white;
          border-radius: 8px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          margin-bottom: 24px;
          overflow: hidden;
        }

        body.dark-theme .form-card {
          background: var(--bg-card);
          border: 1px solid var(--glass-border);
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 20px;
          border-bottom: 1px solid #e5e7eb;
          background: #f9fafb;
        }

        body.dark-theme .card-header {
          background: rgba(255, 255, 255, 0.05);
          border-bottom-color: var(--glass-border);
        }

        .card-header h2 {
          margin: 0;
          font-size: 1.1rem;
          color: #1f2937;
          font-weight: 600;
        }

        body.dark-theme .card-header h2 {
          color: #f3f4f6;
        }

        .form-body {
          padding: 24px;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-group label {
          display: block;
          margin-bottom: 8px;
          font-size: 0.95rem;
          font-weight: 500;
          color: #374151;
        }

        body.dark-theme .form-group label {
          color: #d1d5db;
        }

        .form-select,
        .form-textarea {
          width: 100%;
          padding: 10px;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          font-size: 14px;
          background-color: #fff;
          transition: border-color 0.2s;
          font-family: inherit;
        }

        body.dark-theme .form-select,
        body.dark-theme .form-textarea {
          background-color: rgba(30, 41, 59, 0.5);
          border-color: var(--glass-border);
          color: #f8fafc;
        }

        .form-select:hover,
        .form-textarea:hover {
          border-color: #d1d5db;
        }

        .form-select:focus,
        .form-textarea:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .form-textarea {
          resize: vertical;
        }

        .char-count {
          font-size: 0.85rem;
          color: #6b7280;
          margin-top: 4px;
          text-align: right;
        }

        .rating-input {
          display: flex;
          gap: 12px;
          margin: 16px 0;
        }

        .star-btn {
          background: none;
          border: none;
          cursor: pointer;
          padding: 0;
          transition: transform 0.2s;
        }

        .star-btn:hover {
          transform: scale(1.15);
        }

        .rating-label {
          color: #6b7280;
          font-size: 0.9rem;
          margin: 8px 0 0 0;
        }

        .form-actions {
          display: flex;
          gap: 12px;
          padding-top: 16px;
          border-top: 1px solid #e5e7eb;
        }

        body.dark-theme .form-actions {
          border-top-color: var(--glass-border);
        }

        .btn {
          padding: 10px 20px;
          border: none;
          border-radius: 6px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .btn-primary {
          background: #3b82f6;
          color: white;
        }

        .btn-primary:hover {
          background: #2563eb;
        }

        .btn-secondary {
          background: #e5e7eb;
          color: #374151;
        }

        .btn-secondary:hover {
          background: #d1d5db;
        }

        .success-message {
          background: #d1fae5;
          border: 1px solid #6ee7b7;
          color: #047857;
          padding: 12px 16px;
          border-radius: 6px;
          margin-bottom: 24px;
          display: flex;
          align-items: center;
        }

        .feedback-grid {
          margin-top: 32px;
        }

        .feedback-grid h2 {
          font-size: 1.1rem;
          color: #1f2937;
          font-weight: 600;
          margin-bottom: 16px;
        }

        body.dark-theme .feedback-grid h2 {
          color: #f3f4f6;
        }

        .grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 16px;
        }

        .feedback-card {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          padding: 16px;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
          transition: all 0.2s;
        }

        body.dark-theme .feedback-card {
          background: var(--bg-card);
          border-color: var(--glass-border);
        }

        .feedback-card:hover {
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          transform: translateY(-2px);
        }

        body.dark-theme .feedback-card:hover {
          border-color: var(--primary);
        }

        .feedback-header {
          margin-bottom: 12px;
        }

        .feedback-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .feedback-order {
          font-size: 0.9rem;
          font-weight: 600;
          color: #374151;
          margin: 0;
        }

        .feedback-date {
          font-size: 0.85rem;
          color: #9ca3af;
          margin: 0;
        }

        .rating-display {
          display: flex;
          align-items: center;
          gap: 4px;
          margin-bottom: 12px;
        }

        .rating-value {
          font-size: 0.9rem;
          color: #6b7280;
          margin-left: 4px;
        }

        .feedback-comments {
          color: #4b5563;
          font-size: 0.95rem;
          line-height: 1.5;
          margin: 0;
        }
      `}</style>
    </div>
  );
};

export default UserFeedback;
