from .dashboard.routes import dashboard_bp
from .orders.routes import orders_bp
from .payments.routes import payments_bp
from .feedbacks.routes import feedbacks_bp
from .members.routes import members_bp
from .employees.routes import employees_bp
from .lost_items.routes import lost_items_bp
from .services.routes import services_bp
from .pricing.routes import pricing_bp

def register_admin_apis(admin_bp):
    """Register all admin API blueprints"""
    admin_bp.register_blueprint(dashboard_bp)
    admin_bp.register_blueprint(orders_bp)
    admin_bp.register_blueprint(payments_bp)
    admin_bp.register_blueprint(feedbacks_bp)
    admin_bp.register_blueprint(members_bp)
    admin_bp.register_blueprint(employees_bp)
    admin_bp.register_blueprint(lost_items_bp)
    admin_bp.register_blueprint(services_bp)
    admin_bp.register_blueprint(pricing_bp)
