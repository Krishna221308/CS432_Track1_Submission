from flask import Blueprint, request, jsonify
from db import get_connection

interactions_bp = Blueprint('user_interactions', __name__)

@interactions_bp.route('/feedback', methods=['POST'])
def submit_feedback():
    data = request.json
    conn = get_connection()
    cur = conn.cursor()
    try:
        cur.execute(
            "INSERT INTO freshwash.feedback (member_id, order_id, rating, comments) VALUES (%s, %s, %s, %s)",
            (data['member_id'], data['order_id'], data['rating'], data['comments'])
        )
        conn.commit()
        return jsonify({"message": "Feedback submitted"}), 201
    finally:
        cur.close()
        conn.close()

@interactions_bp.route('/lost-items', methods=['POST'])
def report_lost_item():
    data = request.json
    conn = get_connection()
    cur = conn.cursor()
    try:
        cur.execute(
            "INSERT INTO freshwash.lost_item (order_id, item_description, compensation_amount) VALUES (%s, %s, %s)",
            (data['order_id'], data['item_description'], data.get('compensation_amount', 0))
        )
        conn.commit()
        return jsonify({"message": "Item reported"}), 201
    finally:
        cur.close()
        conn.close()
