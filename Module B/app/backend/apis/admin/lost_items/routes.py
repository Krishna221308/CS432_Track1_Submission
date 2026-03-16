from flask import Blueprint, jsonify
from db import get_connection

lost_items_bp = Blueprint('admin_lost_items', __name__)

@lost_items_bp.route('/lost-items', methods=['GET'])
def get_all_lost_items():
    """Get all reported lost items"""
    conn = get_connection()
    cur = conn.cursor()
    try:
        cur.execute(
            "SELECT li.lost_id, li.order_id, lo.member_id, m.name, li.item_description, "
            "li.compensation_amount, li.reported_date "
            "FROM freshwash.lost_item li "
            "JOIN freshwash.laundry_order lo ON li.order_id = lo.order_id "
            "JOIN freshwash.member m ON lo.member_id = m.member_id "
            "ORDER BY li.reported_date DESC"
        )
        rows = cur.fetchall()
        lost_items = []
        for r in rows:
            lost_items.append({
                "lost_item_id": r[0],
                "order_id": r[1],
                "member_id": r[2],
                "member_name": r[3],
                "item_description": r[4],
                "compensation_amount": float(r[5]),
                "reported_date": r[6].isoformat() if r[6] else None
            })
        return jsonify(lost_items), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400
    finally:
        cur.close()
        conn.close()

@lost_items_bp.route('/lost-items/<int:lost_item_id>', methods=['GET'])
def get_lost_item_details(lost_item_id):
    """Get specific lost item details"""
    conn = get_connection()
    cur = conn.cursor()
    try:
        cur.execute(
            "SELECT li.lost_id, li.order_id, lo.member_id, m.name, m.email, m.contact_number, "
            "li.item_description, li.compensation_amount, li.reported_date "
            "FROM freshwash.lost_item li "
            "JOIN freshwash.laundry_order lo ON li.order_id = lo.order_id "
            "JOIN freshwash.member m ON lo.member_id = m.member_id "
            "WHERE li.lost_id = %s",
            (lost_item_id,)
        )
        row = cur.fetchone()
        if row:
            return jsonify({
                "lost_item_id": row[0],
                "order_id": row[1],
                "member_id": row[2],
                "member_name": row[3],
                "member_email": row[4],
                "member_contact": row[5],
                "item_description": row[6],
                "compensation_amount": float(row[7]),
                "reported_date": row[8].isoformat() if row[8] else None
            }), 200
        return jsonify({"error": "Lost item not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 400
    finally:
        cur.close()
        conn.close()

@lost_items_bp.route('/lost-items/<int:lost_item_id>/status', methods=['PUT'])
def update_lost_item_status(lost_item_id):
    """Update lost item status"""
    from flask import request
    data = request.json
    conn = get_connection()
    cur = conn.cursor()
    try:
        cur.execute(
            "UPDATE freshwash.lost_item SET status = %s WHERE lost_id = %s",
            (data['status'], lost_item_id)
        )
        conn.commit()
        return jsonify({"message": "Lost item status updated"}), 200
    except Exception as e:
        conn.rollback()
        return jsonify({"error": str(e)}), 400
    finally:
        cur.close()
        conn.close()
