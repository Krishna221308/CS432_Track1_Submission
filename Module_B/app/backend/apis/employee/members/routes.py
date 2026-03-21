# employee/members/routes.py
from flask import Blueprint, jsonify
from db import get_connection

emp_members_bp = Blueprint('emp_members', __name__)

@emp_members_bp.route('/<int:employee_id>', methods=['GET'])
def get_assigned_members(employee_id):
    """Return members directly assigned to this employee (account handler)."""
    conn = get_connection()
    cur  = conn.cursor()
    try:
        cur.execute(
            """
            SELECT m.member_id, m.name AS member_name
            FROM freshwash.member m
            WHERE m.assigned_employee_id = %s
            ORDER BY m.name
            """,
            (employee_id,)
        )
        members = [{"member_id": r[0], "member_name": r[1]} for r in cur.fetchall()]
        return jsonify(members), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        cur.close()
        conn.close()
