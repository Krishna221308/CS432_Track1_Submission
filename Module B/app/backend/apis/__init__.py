from flask import Blueprint
from .auth.routes import auth_bp
from .user.stats.routes import stats_bp
from .user.orders.routes import orders_bp
from .user.payments.routes import payments_bp
from .user.interactions.routes import interactions_bp
from .user.profile.routes import profile_bp

def init_apis(app):
    api_bp = Blueprint('api', __name__, url_prefix='/api')
    
    api_bp.register_blueprint(auth_bp, url_prefix='/auth')
    api_bp.register_blueprint(stats_bp, url_prefix='/user')
    api_bp.register_blueprint(orders_bp, url_prefix='/user')
    api_bp.register_blueprint(payments_bp, url_prefix='/user')
    api_bp.register_blueprint(interactions_bp, url_prefix='/user')
    api_bp.register_blueprint(profile_bp, url_prefix='/user')
    
    app.register_blueprint(api_bp)
