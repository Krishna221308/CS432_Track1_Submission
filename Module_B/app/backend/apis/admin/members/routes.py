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
            """
            SELECT m.member_id, m.name, m.age, m.email, m.contact_number, m.address, m.created_at, 
                   m.assigned_employee_id, e.employee_name
            FROM freshwash.member m
            LEFT JOIN freshwash.employee e ON m.assigned_employee_id = e.employee_id
            ORDER BY m.member_id ASC
            """
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
                "created_at": r[6].isoformat() if r[6] else None,
                "assigned_employee_id": r[7],
                "assigned_employee_name": r[8]
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
            """
            SELECT m.member_id, m.name, m.age, m.email, m.contact_number, m.address, m.created_at,
                   m.assigned_employee_id, e.employee_name
            FROM freshwash.member m
            LEFT JOIN freshwash.employee e ON m.assigned_employee_id = e.employee_id
            WHERE m.member_id = %s
            """,
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
                "created_at": row[6].isoformat() if row[6] else None,
                "assigned_employee_id": row[7],
                "assigned_employee_name": row[8]
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
        assigned_employee_id = data.get('assigned_employee_id')
        if assigned_employee_id == '':
            assigned_employee_id = None

        if assigned_employee_id is not None:
            try:
                assigned_employee_id = int(assigned_employee_id)
            except Exception:
                return jsonify({"error": "assigned_employee_id must be an integer or empty"}), 400

            cur.execute("SELECT employee_id FROM freshwash.employee WHERE employee_id = %s", (assigned_employee_id,))
            if not cur.fetchone():
                return jsonify({"error": "Assigned employee not found"}), 404
            
        cur.execute(
            "UPDATE freshwash.member SET name = %s, age = %s, email = %s, contact_number = %s, address = %s, assigned_employee_id = %s "
            "WHERE member_id = %s",
            (data['name'], data['age'], data['email'], data['contact'], data['address'], assigned_employee_id, member_id)
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
