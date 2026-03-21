# employee/feedbacks/routes.py
from flask import Blueprint, jsonify
from db import get_connection
from ..utils import _isoformat

emp_feedbacks_bp = Blueprint('emp_feedbacks', __name__)

@emp_feedbacks_bp.route('/<int:employee_id>', methods=['GET'])
def get_assigned_feedbacks(employee_id):
    """Return customer feedback entries for orders assigned to this employee."""
    conn = get_connection()
    cur  = conn.cursor()
    try:
        cur.execute(
            """
            SELECT DISTINCT
                f.feedback_id, f.member_id, f.order_id, f.rating, f.comments, f.feedback_date
            FROM freshwash.feedback f
            JOIN freshwash.member m ON m.member_id = f.member_id
            WHERE m.assigned_employee_id = %s
            ORDER BY f.feedback_date DESC
            """,
            (employee_id,)
        )
        feedbacks = []
        for r in cur.fetchall():
            feedbacks.append({
                "feedback_id":   r[0],
                "member_id":     r[1],
                "order_id":      r[2],
                "rating":        r[3],
                "comments":      r[4],
                "feedback_date": _isoformat(r[5])
            })
        return jsonify(feedbacks), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        cur.close()
        conn.close()
