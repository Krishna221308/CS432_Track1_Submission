from flask import Blueprint, jsonify
from db import get_connection

dashboard_bp = Blueprint('admin_dashboard', __name__)

@dashboard_bp.route('/dashboard', methods=['GET'])
def get_admin_dashboard():
    """Get admin dashboard statistics"""
    conn = get_connection()
    cur = conn.cursor()
    try:
        # Total orders count
        cur.execute("SELECT COUNT(*) FROM freshwash.laundry_order")
        total_orders = cur.fetchone()[0]
        
        # Total revenue (sum of all order amounts)
        cur.execute("SELECT COALESCE(SUM(total_amount), 0) FROM freshwash.laundry_order")
        total_revenue = float(cur.fetchone()[0])
        
        # Total members
        cur.execute("SELECT COUNT(*) FROM freshwash.member")
        total_members = cur.fetchone()[0]
        
        # Total employees
        cur.execute("SELECT COUNT(*) FROM freshwash.employee")
        total_employees = cur.fetchone()[0]
        
        # Pending orders count (orders in progress, not yet completed/delivered)
        cur.execute("SELECT COUNT(*) FROM freshwash.laundry_order WHERE current_status IN ('Pending', 'Processing', 'Washing', 'Ready for Delivery')")
        pending_orders = cur.fetchone()[0]
        
        # Pending payments count
        cur.execute(
            "SELECT COUNT(*) FROM freshwash.payment p "
            "LEFT JOIN freshwash.payment_status ps ON p.payment_id = ps.payment_id "
            "WHERE ps.status_name != 'Success'"
        )
        pending_payments = cur.fetchone()[0]
        
        return jsonify({
            "totalOrders": total_orders,
            "totalRevenue": total_revenue,
            "totalMembers": total_members,
            "totalEmployees": total_employees,
            "pendingOrders": pending_orders,
            "pendingPayments": pending_payments
        }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400
    finally:
        cur.close()
        conn.close()
