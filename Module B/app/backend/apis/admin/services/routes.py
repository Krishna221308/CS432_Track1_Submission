from flask import Blueprint, jsonify, request
from db import get_connection

services_bp = Blueprint('admin_services', __name__)

@services_bp.route('/services', methods=['GET'])
def get_all_services():
    """Get all available services"""
    conn = get_connection()
    cur = conn.cursor()
    try:
        cur.execute(
            "SELECT service_id, service_name, service_description, base_price "
            "FROM freshwash.service "
            "ORDER BY service_id"
        )
        rows = cur.fetchall()
        services = []
        for r in rows:
            services.append({
                "service_id": r[0],
                "service_name": r[1],
                "service_description": r[2],
                "base_price": float(r[3])
            })
        return jsonify(services), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400
    finally:
        cur.close()
        conn.close()

@services_bp.route('/services/<int:service_id>', methods=['GET'])
def get_service_details(service_id):
    """Get specific service details"""
    conn = get_connection()
    cur = conn.cursor()
    try:
        cur.execute(
            "SELECT service_id, service_name, service_description, base_price "
            "FROM freshwash.service "
            "WHERE service_id = %s",
            (service_id,)
        )
        row = cur.fetchone()
        if row:
            return jsonify({
                "service_id": row[0],
                "service_name": row[1],
                "service_description": row[2],
                "base_price": float(row[3])
            }), 200
        return jsonify({"error": "Service not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 400
    finally:
        cur.close()
        conn.close()

@services_bp.route('/services', methods=['POST'])
def create_service():
    """Create new service"""
    data = request.json
    conn = get_connection()
    cur = conn.cursor()
    try:
        cur.execute(
            "INSERT INTO freshwash.service (service_name, service_description, base_price) "
            "VALUES (%s, %s, %s) RETURNING service_id",
            (data['service_name'], data['service_description'], data['base_price'])
        )
        service_id = cur.fetchone()[0]
        conn.commit()
        return jsonify({"message": "Service created", "service_id": service_id}), 201
    except Exception as e:
        conn.rollback()
        return jsonify({"error": str(e)}), 400
    finally:
        cur.close()
        conn.close()

@services_bp.route('/services/<int:service_id>', methods=['PUT'])
def update_service(service_id):
    """Update service details"""
    data = request.json
    conn = get_connection()
    cur = conn.cursor()
    try:
        cur.execute(
            "UPDATE freshwash.service SET service_name = %s, service_description = %s, base_price = %s "
            "WHERE service_id = %s",
            (data['service_name'], data['service_description'], data['base_price'], service_id)
        )
        conn.commit()
        return jsonify({"message": "Service updated"}), 200
    except Exception as e:
        conn.rollback()
        return jsonify({"error": str(e)}), 400
    finally:
        cur.close()
        conn.close()

@services_bp.route('/services/<int:service_id>', methods=['DELETE'])
def delete_service(service_id):
    """Delete service"""
    conn = get_connection()
    cur = conn.cursor()
    try:
        cur.execute(
            "DELETE FROM freshwash.service WHERE service_id = %s",
            (service_id,)
        )
        conn.commit()
        return jsonify({"message": "Service deleted"}), 200
    except Exception as e:
        conn.rollback()
        return jsonify({"error": str(e)}), 400
    finally:
        cur.close()
        conn.close()
