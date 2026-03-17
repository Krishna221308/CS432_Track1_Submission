# employee/payments/routes.py
from flask import Blueprint, jsonify, request
from db import get_connection
from ..utils import _safe_float, _isoformat

emp_payments_bp = Blueprint('emp_payments', __name__)

@emp_payments_bp.route('/<int:employee_id>', methods=['GET'])
def get_assigned_payments(employee_id):
    """Return all payments for orders assigned to this employee."""
    conn = get_connection()
    cur  = conn.cursor()
    try:
        cur.execute(
            """
            SELECT DISTINCT
                p.payment_id, p.order_id, p.payment_amount,
                p.payment_mode, p.payment_date, ps.status_name AS payment_status
            FROM freshwash.payment p
            JOIN freshwash.laundry_order    lo ON lo.order_id   = p.order_id
            JOIN freshwash.order_assignment oa ON oa.order_id   = lo.order_id
            LEFT JOIN freshwash.payment_status ps ON ps.payment_id = p.payment_id
            WHERE oa.employee_id = %s
            ORDER BY p.payment_date DESC
            """,
            (employee_id,)
        )
        rows = cur.fetchall()
        payments = []
        for r in rows:
            payments.append({
                "payment_id":     r[0],
                "order_id":       r[1],
                "payment_amount": _safe_float(r[2]),
                "payment_mode":   r[3],
                "payment_date":   _isoformat(r[4]),
                "payment_status": r[5]
            })
        return jsonify(payments), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        cur.close()
        conn.close()

@emp_payments_bp.route('/<int:payment_id>', methods=['PUT'])
def update_payment_status(payment_id):
    """Toggle the payment status (Success / Pending / Failed)."""
    data = request.get_json(silent=True)
    if data is None or 'payment_status' not in data:
        return jsonify({"error": "Request body must contain 'payment_status'"}), 400

    new_status = data['payment_status'].strip()
    if new_status not in ('Success', 'Pending', 'Failed'):
        return jsonify({"error": "payment_status must be 'Success', 'Pending', or 'Failed'"}), 400

    conn = get_connection()
    cur  = conn.cursor()
    try:
        cur.execute("SELECT payment_id FROM freshwash.payment WHERE payment_id = %s", (payment_id,))
        if not cur.fetchone():
            return jsonify({"error": f"Payment {payment_id} not found"}), 404

        cur.execute("SELECT payment_status_id FROM freshwash.payment_status WHERE payment_id = %s", (payment_id,))
        existing = cur.fetchone()

        if existing:
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
        return jsonify({"message": "Payment status updated", "payment_id": payment_id, "payment_status": new_status}), 200
    except Exception as e:
        conn.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        cur.close()
        conn.close()
