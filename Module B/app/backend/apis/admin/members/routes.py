from flask import Blueprint, jsonify, request
from db import get_connection

members_bp = Blueprint('admin_members', __name__)

@members_bp.route('/members', methods=['GET'])
def get_all_members():
    """Get all registered members"""
    conn = get_connection()
    cur = conn.cursor()
    try:
        cur.execute(
            "SELECT member_id, name, age, email, contact_number, address, created_at "
            "FROM freshwash.member "
            "ORDER BY member_id ASC"
        )
        rows = cur.fetchall()
        members = []
        for r in rows:
            members.append({
                "member_id": r[0],
                "name": r[1],
                "age": r[2],
                "email": r[3],
                "contact": r[4],
                "address": r[5],
                "created_at": r[6].isoformat() if r[6] else None
            })
        return jsonify(members), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400
    finally:
        cur.close()
        conn.close()

@members_bp.route('/members/<int:member_id>', methods=['GET'])
def get_member_details(member_id):
    """Get specific member details"""
    conn = get_connection()
    cur = conn.cursor()
    try:
        cur.execute(
            "SELECT member_id, name, age, email, contact_number, address, created_at "
            "FROM freshwash.member "
            "WHERE member_id = %s",
            (member_id,)
        )
        row = cur.fetchone()
        if row:
            return jsonify({
                "member_id": row[0],
                "name": row[1],
                "age": row[2],
                "email": row[3],
                "contact": row[4],
                "address": row[5],
                "created_at": row[6].isoformat() if row[6] else None
            }), 200
        return jsonify({"error": "Member not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 400
    finally:
        cur.close()
        conn.close()

@members_bp.route('/members/<int:member_id>', methods=['PUT'])
def update_member(member_id):
    """Update member profile"""
    data = request.json
    conn = get_connection()
    cur = conn.cursor()
    try:
        cur.execute(
            "UPDATE freshwash.member SET name = %s, age = %s, email = %s, contact_number = %s, address = %s "
            "WHERE member_id = %s",
            (data['name'], data['age'], data['email'], data['contact'], data['address'], member_id)
        )
        conn.commit()
        return jsonify({"message": "Member updated"}), 200
    except Exception as e:
        conn.rollback()
        return jsonify({"error": str(e)}), 400
    finally:
        cur.close()
        conn.close()

@members_bp.route('/members/<int:member_id>', methods=['DELETE'])
def delete_member(member_id):
    """Delete member (with cascade)"""
    conn = get_connection()
    cur = conn.cursor()
    try:
        cur.execute(
            "DELETE FROM freshwash.member WHERE member_id = %s",
            (member_id,)
        )
        conn.commit()
        return jsonify({"message": "Member deleted"}), 200
    except Exception as e:
        conn.rollback()
        return jsonify({"error": str(e)}), 400
    finally:
        cur.close()
        conn.close()
