# employee/members/routes.py
from flask import Blueprint, jsonify
from db import get_connection

emp_members_bp = Blueprint('emp_members', __name__)

@emp_members_bp.route('/<int:employee_id>', methods=['GET'])
def get_assigned_members(employee_id):
    """Return distinct members linked to this employee's assigned orders."""
    conn = get_connection()
    cur  = conn.cursor()
    try:
        cur.execute(
            """
            SELECT DISTINCT m.member_id, m.name AS member_name
            FROM freshwash.member m
            JOIN freshwash.laundry_order    lo ON lo.member_id  = m.member_id
            JOIN freshwash.order_assignment oa ON oa.order_id   = lo.order_id
            WHERE oa.employee_id = %s
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
