from flask import Blueprint, jsonify, request
from db import get_connection

pricing_bp = Blueprint('admin_pricing', __name__)

@pricing_bp.route('/pricing', methods=['GET'])
def get_all_pricing():
    """Get all pricing rules with service and clothing type details"""
    conn = get_connection()
    cur = conn.cursor()
    try:
        cur.execute(
            "SELECT p.price_id, p.service_id, s.service_name, p.type_id, ct.type_name, p.price "
            "FROM freshwash.price p "
            "JOIN freshwash.service s ON p.service_id = s.service_id "
            "JOIN freshwash.clothing_type ct ON p.type_id = ct.type_id "
            "ORDER BY p.price_id"
        )
        rows = cur.fetchall()
        pricing = []
        for r in rows:
            pricing.append({
                "price_id": r[0],
                "service_id": r[1],
                "service_name": r[2],
                "type_id": r[3],
                "type_name": r[4],
                "price": float(r[5])
            })
        return jsonify(pricing), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400
    finally:
        cur.close()
        conn.close()

@pricing_bp.route('/pricing/<int:price_id>', methods=['GET'])
def get_pricing_details(price_id):
    """Get specific pricing rule details"""
    conn = get_connection()
    cur = conn.cursor()
    try:
        cur.execute(
            "SELECT p.price_id, p.service_id, s.service_name, p.type_id, ct.type_name, p.price "
            "FROM freshwash.price p "
            "JOIN freshwash.service s ON p.service_id = s.service_id "
            "JOIN freshwash.clothing_type ct ON p.type_id = ct.type_id "
            "WHERE p.price_id = %s",
            (price_id,)
        )
        row = cur.fetchone()
        if row:
            return jsonify({
                "price_id": row[0],
                "service_id": row[1],
                "service_name": row[2],
                "type_id": row[3],
                "type_name": row[4],
                "price": float(row[5])
            }), 200
        return jsonify({"error": "Pricing rule not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 400
    finally:
        cur.close()
        conn.close()

@pricing_bp.route('/pricing', methods=['POST'])
def create_pricing():
    """Create a new pricing rule"""
    data = request.json
    conn = get_connection()
    cur = conn.cursor()
    try:
        cur.execute(
            "INSERT INTO freshwash.price (service_id, type_id, price) "
            "VALUES (%s, %s, %s) RETURNING price_id",
            (data['service_id'], data['type_id'], data['price'])
        )
        price_id = cur.fetchone()[0]
        conn.commit()
        return jsonify({"price_id": price_id, "message": "Pricing rule created"}), 201
    except Exception as e:
        conn.rollback()
        return jsonify({"error": str(e)}), 400
    finally:
        cur.close()
        conn.close()

@pricing_bp.route('/pricing/<int:price_id>', methods=['PUT'])
def update_pricing(price_id):
    """Update a pricing rule"""
    data = request.json
    conn = get_connection()
    cur = conn.cursor()
    try:
        cur.execute(
            "UPDATE freshwash.price SET price = %s WHERE price_id = %s",
            (data['price'], price_id)
        )
        conn.commit()
        return jsonify({"message": "Pricing rule updated"}), 200
    except Exception as e:
        conn.rollback()
        return jsonify({"error": str(e)}), 400
    finally:
        cur.close()
        conn.close()

@pricing_bp.route('/pricing/<int:price_id>', methods=['DELETE'])
def delete_pricing(price_id):
    """Delete a pricing rule"""
    conn = get_connection()
    cur = conn.cursor()
    try:
        cur.execute("DELETE FROM freshwash.price WHERE price_id = %s", (price_id,))
        conn.commit()
        return jsonify({"message": "Pricing rule deleted"}), 200
    except Exception as e:
        conn.rollback()
        return jsonify({"error": str(e)}), 400
    finally:
        cur.close()
        conn.close()

@pricing_bp.route('/clothing-types', methods=['GET'])
def get_clothing_types():
    """Get all clothing types for pricing rules"""
    conn = get_connection()
    cur = conn.cursor()
    try:
        cur.execute("SELECT type_id, type_name FROM freshwash.clothing_type ORDER BY type_name")
        rows = cur.fetchall()
        types = []
        for r in rows:
            types.append({
                "type_id": r[0],
                "type_name": r[1]
            })
        return jsonify(types), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400
    finally:
        cur.close()
        conn.close()
