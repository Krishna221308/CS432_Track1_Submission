from flask import Blueprint, jsonify
from db import get_connection

feedbacks_bp = Blueprint('admin_feedbacks', __name__)

@feedbacks_bp.route('/feedbacks', methods=['GET'])
def get_all_feedbacks():
    """Get all customer feedbacks"""
    conn = get_connection()
    cur = conn.cursor()
    try:
        cur.execute(
            "SELECT f.feedback_id, f.member_id, m.name, f.order_id, f.rating, f.comments, f.feedback_date "
            "FROM freshwash.feedback f "
            "JOIN freshwash.member m ON f.member_id = m.member_id "
            "ORDER BY f.feedback_date DESC"
        )
        rows = cur.fetchall()
        feedbacks = []
        for r in rows:
            feedbacks.append({
                "feedback_id": r[0],
                "member_id": r[1],
                "member_name": r[2],
                "order_id": r[3],
                "rating": r[4],
                "comments": r[5],
                "feedback_date": r[6].isoformat() if r[6] else None
            })
        return jsonify(feedbacks), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400
    finally:
        cur.close()
        conn.close()

@feedbacks_bp.route('/feedbacks/<int:feedback_id>', methods=['GET'])
def get_feedback_details(feedback_id):
    """Get specific feedback details"""
    conn = get_connection()
    cur = conn.cursor()
    try:
        cur.execute(
            "SELECT f.feedback_id, f.member_id, m.name, m.email, f.order_id, f.rating, f.comments, f.feedback_date "
            "FROM freshwash.feedback f "
            "JOIN freshwash.member m ON f.member_id = m.member_id "
            "WHERE f.feedback_id = %s",
            (feedback_id,)
        )
        row = cur.fetchone()
        if row:
            return jsonify({
                "feedback_id": row[0],
                "member_id": row[1],
                "member_name": row[2],
                "member_email": row[3],
                "order_id": row[4],
                "rating": row[5],
                "comments": row[6],
                "feedback_date": row[7].isoformat() if row[7] else None
            }), 200
        return jsonify({"error": "Feedback not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 400
    finally:
        cur.close()
        conn.close()

@feedbacks_bp.route('/feedbacks/member/<int:member_id>', methods=['GET'])
def get_member_feedbacks(member_id):
    """Get all feedbacks from a specific member"""
    conn = get_connection()
    cur = conn.cursor()
    try:
        cur.execute(
            "SELECT f.feedback_id, f.order_id, f.rating, f.comments, f.feedback_date "
            "FROM freshwash.feedback f "
            "WHERE f.member_id = %s "
            "ORDER BY f.feedback_date DESC",
            (member_id,)
        )
        rows = cur.fetchall()
        feedbacks = []
        for r in rows:
            feedbacks.append({
                "feedback_id": r[0],
                "order_id": r[1],
                "rating": r[2],
                "comments": r[3],
                "feedback_date": r[4].isoformat() if r[4] else None
            })
        return jsonify(feedbacks), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400
    finally:
        cur.close()
        conn.close()
