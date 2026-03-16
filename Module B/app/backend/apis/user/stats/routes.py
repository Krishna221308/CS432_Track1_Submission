from flask import Blueprint, jsonify
from db import get_connection

stats_bp = Blueprint('user_stats', __name__)

@stats_bp.route('/stats/<int:member_id>', methods=['GET'])
def get_user_stats(member_id):
    conn = get_connection()
    cur = conn.cursor()
    try:
        cur.execute(
            "SELECT lifetime_spend, (SELECT COALESCE(SUM(payment_amount), 0) FROM freshwash.payment p JOIN freshwash.laundry_order lo ON p.order_id = lo.order_id WHERE lo.member_id = %s AND p.payment_id NOT IN (SELECT payment_id FROM freshwash.payment_status WHERE status_name = 'Success')) as pending_payment "
            "FROM freshwash.member_portfolio_view WHERE member_id = %s",
            (member_id, member_id)
        )
        row = cur.fetchone()
        if row:
            return jsonify({
                "totalSpent": float(row[0]),
                "pendingPayment": float(row[1])
            })
        return jsonify({"error": "Member not found"}), 404
    finally:
        cur.close()
        conn.close()
