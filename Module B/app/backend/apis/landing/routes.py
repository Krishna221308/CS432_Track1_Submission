from flask import Blueprint, jsonify
from db import get_connection

landing_bp = Blueprint('landing_api', __name__)

@landing_bp.route('/data', methods=['GET'])
def get_landing_data():
    """Get services and pricing for landing page (Public)"""
    conn = get_connection()
    cur = conn.cursor()
    try:
        # Get Services
        cur.execute(
            "SELECT service_id, service_name, service_description, base_price "
            "FROM freshwash.service "
            "ORDER BY service_id"
        )
        services_rows = cur.fetchall()
        services = []
        for r in services_rows:
            services.append({
                "service_id": r[0],
                "service_name": r[1],
                "service_description": r[2],
                "base_price": float(r[3])
            })

        # Get Pricing rules
        cur.execute(
            "SELECT p.price_id, p.service_id, s.service_name, p.type_id, ct.type_name, p.price "
            "FROM freshwash.price p "
            "JOIN freshwash.service s ON p.service_id = s.service_id "
            "JOIN freshwash.clothing_type ct ON p.type_id = ct.type_id "
            "ORDER BY p.price_id"
        )
        pricing_rows = cur.fetchall()
        pricing = []
        for r in pricing_rows:
            pricing.append({
                "price_id": r[0],
                "service_id": r[1],
                "service_name": r[2],
                "cloth_type": r[4], # cloth_type in frontend
                "price": float(r[5])
            })

        return jsonify({
            "services": services,
            "pricing": pricing
        }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400
    finally:
        cur.close()
        conn.close()
