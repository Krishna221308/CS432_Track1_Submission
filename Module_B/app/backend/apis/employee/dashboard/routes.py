# employee/dashboard/routes.py
from flask import Blueprint, jsonify
from db import get_connection
from ..utils import _frontend_status

emp_dashboard_bp = Blueprint('emp_dashboard', __name__)

@emp_dashboard_bp.route('/stats/<int:employee_id>', methods=['GET'])
def get_stats(employee_id):
    """Headline counts for the employee dashboard stat cards."""
    conn = get_connection()
    cur  = conn.cursor()
    try:
        # ── Total orders assigned to this employee ────────────────────────────
        cur.execute(
            """
            SELECT COUNT(DISTINCT oa.order_id)
            FROM freshwash.order_assignment oa
            WHERE oa.employee_id = %s
            """,
            (employee_id,)
        )
        total_assigned = cur.fetchone()[0]

        # ── Breakdown by frontend bucket ──────────────────────────────────────
        cur.execute(
            """
            SELECT lo.current_status, COUNT(DISTINCT lo.order_id)
            FROM freshwash.laundry_order lo
            JOIN freshwash.order_assignment oa ON oa.order_id = lo.order_id
            WHERE oa.employee_id = %s
            GROUP BY lo.current_status
            """,
            (employee_id,)
        )
        pending = processing = completed = 0
        for db_status, count in cur.fetchall():
            bucket = _frontend_status(db_status)
            if bucket == 'pending':
                pending += count
            elif bucket == 'processing':
                processing += count
            elif bucket == 'completed':
                completed += count

        # ── Lost-item issue count ─────────────────────────────────────────────
        cur.execute(
            """
            SELECT COUNT(DISTINCT li.lost_id)
            FROM freshwash.lost_item li
            JOIN freshwash.order_assignment oa ON oa.order_id = li.order_id
            WHERE oa.employee_id = %s
            """,
            (employee_id,)
        )
        issues = cur.fetchone()[0]

        return jsonify({
            "assignedOrders":   total_assigned,
            "pendingOrders":    pending,
            "processingOrders": processing,
            "completedOrders":  completed,
            "issues":           issues
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        cur.close()
        conn.close()
