# employee/lost_items/routes.py
from flask import Blueprint, jsonify
from db import get_connection
from ..utils import _safe_float, _isoformat

emp_lost_items_bp = Blueprint('emp_lost_items', __name__)

@emp_lost_items_bp.route('/<int:employee_id>', methods=['GET'])
def get_assigned_lost_items(employee_id):
    """Return lost/damaged item reports for all orders assigned to this employee."""
    conn = get_connection()
    cur  = conn.cursor()
    try:
        cur.execute(
            """
            SELECT DISTINCT
                li.lost_id, li.order_id, li.item_description,
                li.reported_date, li.compensation_amount
            FROM freshwash.lost_item li
            JOIN freshwash.order_assignment oa ON oa.order_id = li.order_id
            WHERE oa.employee_id = %s
            ORDER BY li.reported_date DESC
            """,
            (employee_id,)
        )
        items = []
        for r in cur.fetchall():
            items.append({
                "lost_id":             r[0],
                "order_id":            r[1],
                "item_description":    r[2],
                "reported_date":       _isoformat(r[3]),
                "compensation_amount": _safe_float(r[4])
            })
        return jsonify(items), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        cur.close()
        conn.close()
