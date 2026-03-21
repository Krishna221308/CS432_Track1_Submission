from flask import Blueprint, request, jsonify
import uuid
from datetime import datetime, timedelta
from db import get_connection
from auth import login_user, signup_user, add_employee
from logging_utils import audit_log

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/signup', methods=['POST'])
@audit_log
def signup():
    data = request.json
    try:
        result = signup_user(data)
        return jsonify({"message": "User created", "data": result}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@auth_bp.route('/login', methods=['POST'])
@audit_log
def login():
    """
    Login with role-based validation.
    
    Request body:
    {
        "username": string,
        "password": string,
        "expected_role": string (optional) - "admin", "user", or "employee"
    }
    """
    data = request.json
    username = data.get('username')
    password = data.get('password')
    expected_role = data.get('expected_role')  # Optional role validation
    
    result = login_user(username, password, expected_role)
    
    if result:
        return jsonify(result), 200
    
    if expected_role:
        return jsonify({"error": f"Invalid credentials or unauthorized role for {expected_role}"}), 401
    
    return jsonify({"error": "Invalid credentials"}), 401

@auth_bp.route('/employee/add', methods=['POST'])
@audit_log
def add_employee_route():
    """
    Add a new employee (admin only).
    
    Request body:
    {
        "name": string,
        "contact_number": string,
        "role": string (e.g., "Delivery Driver", "Washer"),
        "joining_date": string (YYYY-MM-DD),
        "username": string,
        "password": string
    }
    """
    data = request.json
    try:
        result = add_employee(data)
        return jsonify({"message": "Employee added successfully", "data": result}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 400
