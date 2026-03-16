from flask import Blueprint, jsonify, request
from db import get_connection

orders_bp = Blueprint('admin_orders', __name__)

@orders_bp.route('/orders', methods=['GET'])
def get_all_orders():
    """Get all laundry orders with member details"""
    conn = get_connection()
    cur = conn.cursor()
    try:
        cur.execute(
            "SELECT lo.order_id, lo.member_id, m.name, lo.order_date, lo.pickup_time, "
            "lo.total_amount, lo.current_status "
            "FROM freshwash.laundry_order lo "
            "JOIN freshwash.member m ON lo.member_id = m.member_id "
            "ORDER BY lo.order_date DESC"
        )
        rows = cur.fetchall()
        orders = []
        for r in rows:
            orders.append({
                "order_id": r[0],
                "member_id": r[1],
                "member_name": r[2],
                "order_date": r[3].isoformat(),
                "pickup_time": r[4].isoformat(),
                "total_amount": float(r[5]),
                "order_status": r[6]
            })
        return jsonify(orders), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400
    finally:
        cur.close()
        conn.close()

@orders_bp.route('/orders/<int:order_id>', methods=['GET'])
def get_order_details(order_id):
    """Get specific order details"""
    conn = get_connection()
    cur = conn.cursor()
    try:
        cur.execute(
            "SELECT lo.order_id, lo.member_id, m.name, m.email, m.contact_number, "
            "lo.order_date, lo.pickup_time, lo.total_amount, lo.current_status "
            "FROM freshwash.laundry_order lo "
            "JOIN freshwash.member m ON lo.member_id = m.member_id "
            "WHERE lo.order_id = %s",
            (order_id,)
        )
        row = cur.fetchone()
        if row:
            return jsonify({
                "order_id": row[0],
                "member_id": row[1],
                "member_name": row[2],
                "member_email": row[3],
                "member_contact": row[4],
                "order_date": row[5].isoformat(),
                "pickup_time": row[6].isoformat(),
                "total_amount": float(row[7]),
                "order_status": row[8]
            }), 200
        return jsonify({"error": "Order not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 400
    finally:
        cur.close()
        conn.close()

@orders_bp.route('/orders/<int:order_id>', methods=['PUT'])
def update_order_status(order_id):
    """Update order status"""
    data = request.json
    conn = get_connection()
    cur = conn.cursor()
    try:
        cur.execute(
            "UPDATE freshwash.laundry_order SET current_status = %s WHERE order_id = %s",
            (data['status'], order_id)
        )
        conn.commit()
        return jsonify({"message": "Order status updated"}), 200
    except Exception as e:
        conn.rollback()
        return jsonify({"error": str(e)}), 400
    finally:
        cur.close()
        conn.close()
