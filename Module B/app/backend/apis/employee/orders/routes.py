# employee/orders/routes.py
from flask import Blueprint, jsonify, request
from db import get_connection
from ..utils import (
    _safe_float, _isoformat, _frontend_status,
    DB_STATUSES, STATUS_TRANSITIONS, FRONTEND_TO_DB
)

emp_orders_bp = Blueprint('emp_orders', __name__)

def _order_belongs_to_employee(cur, order_id: int, employee_id: int) -> bool:
    """
    Authorization helper.
    Returns True iff the order's member is assigned to employee_id.
    """
    cur.execute(
        """
        SELECT 1
        FROM freshwash.laundry_order lo
        JOIN freshwash.member m ON m.member_id = lo.member_id
        WHERE lo.order_id = %s AND m.assigned_employee_id = %s
        """,
        (order_id, employee_id),
    )
    return cur.fetchone() is not None

def _member_assigned_to_employee(cur, member_id: int, employee_id: int) -> bool:
    cur.execute(
        "SELECT 1 FROM freshwash.member WHERE member_id = %s AND assigned_employee_id = %s",
        (member_id, employee_id),
    )
    return cur.fetchone() is not None

@emp_orders_bp.route('/<int:employee_id>', methods=['GET'])
def get_assigned_orders(employee_id):
    """Fetch all orders assigned to this employee via order_assignment."""
    conn = get_connection()
    cur  = conn.cursor()
    try:
        cur.execute(
            """
            SELECT DISTINCT
                lo.order_id, lo.member_id, m.name AS member_name,
                lo.order_date, lo.pickup_time, lo.expected_delivery_time,
                lo.total_amount, lo.current_status,
                oa.assigned_role, oa.assigned_date
            FROM freshwash.laundry_order lo
            JOIN freshwash.member m ON m.member_id = lo.member_id
            LEFT JOIN freshwash.order_assignment oa ON oa.order_id = lo.order_id
            WHERE m.assigned_employee_id = %s
            ORDER BY lo.order_date DESC
            """,
            (employee_id,)
        )
        rows = cur.fetchall()
        orders = []
        for r in rows:
            db_status = r[7]
            orders.append({
                "order_id":               r[0],
                "member_id":              r[1],
                "member_name":            r[2],
                "order_date":             _isoformat(r[3]),
                "pickup_time":            _isoformat(r[4]),
                "expected_delivery_time": _isoformat(r[5]),
                "total_amount":           _safe_float(r[6]),
                "order_status":           _frontend_status(db_status),
                "db_status":              db_status,
                "assigned_role":          r[8],
                "assigned_date":          _isoformat(r[9]),
            })
        return jsonify(orders), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        cur.close()
        conn.close()

@emp_orders_bp.route('/order/<int:order_id>', methods=['GET'])
def get_order_details(order_id):
    """Get specific order details (employee scoped)."""
    employee_id = request.args.get('employee_id', type=int)
    if not employee_id:
        return jsonify({"error": "employee_id query param is required"}), 400

    conn = get_connection()
    cur = conn.cursor()
    try:
        if not _order_belongs_to_employee(cur, order_id, employee_id):
            return jsonify({"error": "Forbidden"}), 403

        cur.execute(
            """
            SELECT
                lo.order_id, lo.member_id, m.name AS member_name,
                lo.order_date, lo.pickup_time, lo.expected_delivery_time,
                lo.total_amount, lo.current_status
            FROM freshwash.laundry_order lo
            JOIN freshwash.member m ON m.member_id = lo.member_id
            WHERE lo.order_id = %s
            """,
            (order_id,),
        )
        r = cur.fetchone()
        if not r:
            return jsonify({"error": "Order not found"}), 404

        db_status = r[7]
        return jsonify({
            "order_id":               r[0],
            "member_id":              r[1],
            "member_name":            r[2],
            "order_date":             _isoformat(r[3]),
            "pickup_time":            _isoformat(r[4]),
            "expected_delivery_time": _isoformat(r[5]),
            "total_amount":           _safe_float(r[6]),
            "order_status":           _frontend_status(db_status),
            "db_status":              db_status,
        }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        cur.close()
        conn.close()

@emp_orders_bp.route('', methods=['POST'])
def create_order():
    """Create a new laundry order and immediately assign it to the employee."""
    data = request.get_json(silent=True)
    if not data:
        return jsonify({"error": "Request body is required"}), 400

    required = ('member_id', 'pickup_time', 'expected_delivery_time',
                'total_amount', 'employee_id')
    missing = [f for f in required if not data.get(f)]
    if missing:
        return jsonify({"error": f"Missing required fields: {', '.join(missing)}"}), 400

    assigned_role = data.get('assigned_role', 'Handler')
    conn = get_connection()
    cur  = conn.cursor()
    try:
        # Enforce: employees can only create/manage orders for their assigned members.
        if not _member_assigned_to_employee(cur, int(data['member_id']), int(data['employee_id'])):
            return jsonify({"error": "Forbidden: member not assigned to this employee"}), 403

        cur.execute(
            """
            INSERT INTO freshwash.laundry_order
                (member_id, pickup_time, expected_delivery_time, total_amount, current_status)
            VALUES (%s, %s, %s, %s, 'Pending')
            RETURNING order_id, order_date
            """,
            (data['member_id'], data['pickup_time'],
             data['expected_delivery_time'], data['total_amount'])
        )
        order_row = cur.fetchone()
        order_id  = order_row[0]
        order_date = order_row[1]

        cur.execute(
            """
            INSERT INTO freshwash.order_assignment
                (order_id, employee_id, assigned_role)
            VALUES (%s, %s, %s)
            """,
            (order_id, data['employee_id'], assigned_role)
        )

        cur.execute(
            """
            INSERT INTO freshwash.order_status_log (order_id, status_name)
            VALUES (%s, 'Pending')
            """,
            (order_id,)
        )
        conn.commit()
        return jsonify({
            "message":    "Order created and assigned successfully",
            "order_id":   order_id,
            "order_date": _isoformat(order_date)
        }), 201
    except Exception as e:
        conn.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        cur.close()
        conn.close()

@emp_orders_bp.route('/<int:order_id>/status', methods=['PUT'])
def update_order_status(order_id):
    """Update order lifecycle status with transition validation."""
    data = request.get_json(silent=True)
    if not data or 'order_status' not in data or 'employee_id' not in data:
        return jsonify({"error": "Request body must contain 'order_status' and 'employee_id'"}), 400

    try:
        employee_id = int(data['employee_id'])
    except Exception:
        return jsonify({"error": "employee_id must be an integer"}), 400

    incoming = data['order_status'].strip()
    if incoming in DB_STATUSES:
        new_db_status = incoming
    elif incoming.lower() in FRONTEND_TO_DB:
        new_db_status = FRONTEND_TO_DB[incoming.lower()]
    else:
        return jsonify({"error": f"Unknown status '{incoming}'"}), 400

    conn = get_connection()
    cur  = conn.cursor()
    try:
        if not _order_belongs_to_employee(cur, order_id, employee_id):
            return jsonify({"error": "Forbidden"}), 403

        cur.execute("SELECT current_status FROM freshwash.laundry_order WHERE order_id = %s", (order_id,))
        row = cur.fetchone()
        if not row:
            return jsonify({"error": f"Order {order_id} not found"}), 404

        current_db_status = row[0]
        if new_db_status == current_db_status:
            return jsonify({"message": "Order already has the requested status"}), 200

        allowed = STATUS_TRANSITIONS.get(current_db_status, [])
        if new_db_status not in allowed:
            return jsonify({"error": f"Cannot transition from '{current_db_status}' to '{new_db_status}'"}), 422

        cur.execute("UPDATE freshwash.laundry_order SET current_status = %s WHERE order_id = %s", (new_db_status, order_id))
        cur.execute("INSERT INTO freshwash.order_status_log (order_id, status_name) VALUES (%s, %s)", (order_id, new_db_status))
        conn.commit()

        return jsonify({
            "message":          "Order status updated",
            "order_id":         order_id,
            "previous_status":  _frontend_status(current_db_status),
            "new_status":       _frontend_status(new_db_status),
            "db_status":        new_db_status
        }), 200
    except Exception as e:
        conn.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        cur.close()
        conn.close()

@emp_orders_bp.route('/order/<int:order_id>', methods=['PUT'])
def update_order(order_id):
    """Update an order (employee scoped)."""
    data = request.get_json(silent=True)
    if not data or 'employee_id' not in data:
        return jsonify({"error": "Request body must contain 'employee_id'"}), 400
    try:
        employee_id = int(data['employee_id'])
    except Exception:
        return jsonify({"error": "employee_id must be an integer"}), 400

    allowed_fields = ('pickup_time', 'expected_delivery_time', 'total_amount')
    updates = {k: data.get(k) for k in allowed_fields if k in data}
    if not updates:
        return jsonify({"error": f"At least one of {', '.join(allowed_fields)} is required"}), 400

    conn = get_connection()
    cur = conn.cursor()
    try:
        if not _order_belongs_to_employee(cur, order_id, employee_id):
            return jsonify({"error": "Forbidden"}), 403

        set_parts = []
        params = []
        for k, v in updates.items():
            set_parts.append(f"{k} = %s")
            params.append(v)
        params.append(order_id)

        cur.execute(
            f"UPDATE freshwash.laundry_order SET {', '.join(set_parts)} WHERE order_id = %s",
            tuple(params),
        )
        conn.commit()
        return jsonify({"message": "Order updated", "order_id": order_id}), 200
    except Exception as e:
        conn.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        cur.close()
        conn.close()

@emp_orders_bp.route('/order/<int:order_id>', methods=['DELETE'])
def delete_order(order_id):
    """Delete an order (employee scoped)."""
    data = request.get_json(silent=True) or {}
    employee_id = data.get('employee_id')
    try:
        employee_id = int(employee_id)
    except Exception:
        return jsonify({"error": "Request body must contain integer 'employee_id'"}), 400

    conn = get_connection()
    cur = conn.cursor()
    try:
        if not _order_belongs_to_employee(cur, order_id, employee_id):
            return jsonify({"error": "Forbidden"}), 403

        cur.execute("DELETE FROM freshwash.laundry_order WHERE order_id = %s", (order_id,))
        if cur.rowcount == 0:
            return jsonify({"error": "Order not found"}), 404
        conn.commit()
        return jsonify({"message": "Order deleted", "order_id": order_id}), 200
    except Exception as e:
        conn.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        cur.close()
        conn.close()
