from flask import Blueprint, jsonify
from db import get_connection

profile_bp = Blueprint('user_profile', __name__)

@profile_bp.route('/profile/<int:member_id>', methods=['GET'])
def get_user_profile(member_id):
    conn = get_connection()
    cur = conn.cursor()
    try:
        cur.execute(
            "SELECT name, age, email, contact_number, address FROM freshwash.member WHERE member_id = %s",
            (member_id,)
        )
        row = cur.fetchone()
        if row:
            return jsonify({
                "name": row[0],
                "age": row[1],
                "email": row[2],
                "contact": row[3],
                "address": row[4]
            })
        return jsonify({"error": "Member not found"}), 404
    finally:
        cur.close()
        conn.close()
