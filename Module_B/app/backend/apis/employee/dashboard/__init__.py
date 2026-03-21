# employee/dashboard/__init__.py
# ─────────────────────────────────────────────────────────────────────────────
# Exports the employee dashboard blueprint so the parent package can register
# it with Flask. The blueprint itself is defined in routes.py.
# ─────────────────────────────────────────────────────────────────────────────

from .routes import emp_dashboard_bp