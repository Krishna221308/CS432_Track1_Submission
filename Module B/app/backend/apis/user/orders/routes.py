from flask import Blueprint, jsonify, request
from db import get_connection

orders_bp = Blueprint('user_orders', __name__)

@orders_bp.route('/orders/<int:member_id>', methods=['GET'])
def get_user_orders(member_id):
    conn = get_connection()
    cur = conn.cursor()
    try:
        cur.execute(
            "SELECT order_id, order_date, pickup_time, total_amount, current_status "
            "FROM freshwash.laundry_order WHERE member_id = %s ORDER BY order_date DESC",
            (member_id,)
        )
        rows = cur.fetchall()
        orders = []
        for r in rows:
            orders.append({
                "order_id": r[0],
                "order_date": r[1].isoformat(),
                "pickup_time": r[2].isoformat(),
                "total_amount": float(r[3]),
                "order_status": r[4].lower()
            })
        return jsonify(orders)
    finally:
        cur.close()
        conn.close()
