from flask import request, jsonify
from auth import signup_user, login_user
from db import get_connection

def register_routes(app):
    
    @app.route('/api/signup', methods=['POST'])
    def signup():
        data = request.json
        try:
            res = signup_user(data)
            return jsonify({"message": "User created", "data": res}), 201
        except Exception as e:
            return jsonify({"error": str(e)}), 400

    @app.route('/api/login', methods=['POST'])
    def login():
        data = request.json
        res = login_user(data.get('username'), data.get('password'))
        if res:
            return jsonify(res), 200
        return jsonify({"error": "Invalid credentials"}), 401

    @app.route('/api/user/stats/<int:member_id>', methods=['GET'])
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

    @app.route('/api/user/orders/<int:member_id>', methods=['GET'])
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

    @app.route('/api/user/payments/<int:member_id>', methods=['GET'])
    def get_user_payments(member_id):
        conn = get_connection()
        cur = conn.cursor()
        try:
            cur.execute(
                "SELECT p.payment_id, p.order_id, p.payment_mode, p.payment_amount, p.payment_date, ps.status_name "
                "FROM freshwash.payment p "
                "JOIN freshwash.laundry_order lo ON p.order_id = lo.order_id "
                "LEFT JOIN freshwash.payment_status ps ON p.payment_id = ps.payment_id "
                "WHERE lo.member_id = %s ORDER BY p.payment_date DESC",
                (member_id,)
            )
            rows = cur.fetchall()
            payments = []
            for r in rows:
                payments.append({
                    "payment_id": r[0],
                    "order_id": r[1],
                    "payment_mode": r[2],
                    "payment_amount": float(r[3]),
                    "payment_date": r[4].isoformat() if r[4] else None,
                    "status": r[5]
                })
            return jsonify(payments)
        finally:
            cur.close()
            conn.close()

    @app.route('/api/user/feedback', methods=['POST'])
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

    @app.route('/api/user/lost-items', methods=['POST'])
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
