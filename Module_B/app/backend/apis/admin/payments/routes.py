from flask import Blueprint, jsonify, request
from db import get_connection

payments_bp = Blueprint('admin_payments', __name__)

@payments_bp.route('/payments', methods=['GET'])
def get_all_payments():
    """Get all payments with order and member details"""
    conn = get_connection()
    cur = conn.cursor()
    try:
        cur.execute(
            "SELECT p.payment_id, p.order_id, lo.member_id, m.name, p.payment_mode, "
            "p.payment_amount, p.payment_date, ps.status_name "
            "FROM freshwash.payment p "
            "JOIN freshwash.laundry_order lo ON p.order_id = lo.order_id "
            "JOIN freshwash.member m ON lo.member_id = m.member_id "
            "LEFT JOIN freshwash.payment_status ps ON p.payment_id = ps.payment_id "
            "ORDER BY p.payment_date DESC"
        )
        rows = cur.fetchall()
        payments = []
        for r in rows:
            payments.append({
                "payment_id": r[0],
                "order_id": r[1],
                "member_id": r[2],
                "member_name": r[3],
                "payment_mode": r[4],
                "payment_amount": float(r[5]),
                "payment_date": r[6].isoformat() if r[6] else None,
                "status": r[7]
            })
        return jsonify(payments), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400
    finally:
        cur.close()
        conn.close()

@payments_bp.route('/payments/<int:payment_id>', methods=['GET'])
def get_payment_details(payment_id):
    """Get specific payment details"""
    conn = get_connection()
    cur = conn.cursor()
    try:
        cur.execute(
            "SELECT p.payment_id, p.order_id, lo.member_id, m.name, m.email, m.contact_number, "
            "p.payment_mode, p.payment_amount, p.payment_date, ps.status_name "
            "FROM freshwash.payment p "
            "JOIN freshwash.laundry_order lo ON p.order_id = lo.order_id "
            "JOIN freshwash.member m ON lo.member_id = m.member_id "
            "LEFT JOIN freshwash.payment_status ps ON p.payment_id = ps.payment_id "
            "WHERE p.payment_id = %s",
            (payment_id,)
        )
        row = cur.fetchone()
        if row:
            return jsonify({
                "payment_id": row[0],
                "order_id": row[1],
                "member_id": row[2],
                "member_name": row[3],
                "member_email": row[4],
                "member_contact": row[5],
                "payment_mode": row[6],
                "payment_amount": float(row[7]),
                "payment_date": row[8].isoformat() if row[8] else None,
                "status": row[9]
            }), 200
        return jsonify({"error": "Payment not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 400
    finally:
        cur.close()
        conn.close()

@payments_bp.route('/payments/<int:payment_id>/status', methods=['PUT'])
def update_payment_status(payment_id):
    """Update payment status"""
    data = request.json
    conn = get_connection()
    cur = conn.cursor()
    try:
        # Verify payment exists
        cur.execute("SELECT payment_id FROM freshwash.payment WHERE payment_id = %s", (payment_id,))
        if not cur.fetchone():
            return jsonify({"error": "Payment not found"}), 404
            
        new_status = data.get('status', 'Pending')
        
        # Upsert payment status
        cur.execute("SELECT payment_status_id FROM freshwash.payment_status WHERE payment_id = %s", (payment_id,))
        existing_status = cur.fetchone()
        
        if existing_status:
            cur.execute(
                "UPDATE freshwash.payment_status SET status_name = %s, status_timestamp = CURRENT_TIMESTAMP WHERE payment_id = %s",
                (new_status, payment_id)
            )
        else:
            cur.execute(
                "INSERT INTO freshwash.payment_status (payment_id, status_name) VALUES (%s, %s)",
                (payment_id, new_status)
            )
            
        conn.commit()
        return jsonify({"message": "Payment status updated", "status": new_status}), 200
    except Exception as e:
        conn.rollback()
        return jsonify({"error": str(e)}), 400
    finally:
        cur.close()
        conn.close()
