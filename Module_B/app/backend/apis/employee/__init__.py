# apis/employee/__init__.py
# ─────────────────────────────────────────────────────────────────────────────
# Registers all Employee sub-module blueprints with the parent employee_bp.
# Follow the same pattern as apis/admin/__init__.py
# ─────────────────────────────────────────────────────────────────────────────

from .dashboard.routes import emp_dashboard_bp
from .orders.routes import emp_orders_bp
from .payments.routes import emp_payments_bp
from .feedbacks.routes import emp_feedbacks_bp
from .lost_items.routes import emp_lost_items_bp
from .members.routes import emp_members_bp

def register_employee_apis(employee_bp):
    """Register all employee API blueprints."""
    employee_bp.register_blueprint(emp_dashboard_bp, url_prefix='/dashboard')
    employee_bp.register_blueprint(emp_orders_bp,    url_prefix='/orders')
    employee_bp.register_blueprint(emp_payments_bp,  url_prefix='/payments')
    employee_bp.register_blueprint(emp_feedbacks_bp, url_prefix='/feedbacks')
    employee_bp.register_blueprint(emp_lost_items_bp,url_prefix='/lost-items')
    employee_bp.register_blueprint(emp_members_bp,   url_prefix='/members')
