from flask import Blueprint, request, jsonify
import uuid
from datetime import datetime, timedelta
from db import get_connection

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/signup', methods=['POST'])
def signup():
    data = request.json
    conn = get_connection()
    cur = conn.cursor()
    try:
        # 1. Create Member first to get member_id
        cur.execute(
            "INSERT INTO freshwash.member (name, age, email, contact_number, address) VALUES (%s, %s, %s, %s, %s) RETURNING member_id",
            (data['name'], data['age'], data['email'], data['contact'], data.get('address', 'To be updated'))
        )
        member_id = cur.fetchone()[0]
        
        # 2. Create User with the member_id link
        cur.execute(
            "INSERT INTO freshwash.users (username, password_hash, role_id, member_id) VALUES (%s, %s, 2, %s) RETURNING user_id",
            (data['username'], data['password'], member_id)
        )
        user_id = cur.fetchone()[0]
        
        conn.commit()
        return jsonify({"message": "User created", "data": {"user_id": user_id, "member_id": member_id}}), 201
    except Exception as e:
        conn.rollback()
        return jsonify({"error": str(e)}), 400
    finally:
        cur.close()
        conn.close()

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.json
    username = data.get('username')
    password = data.get('password')
    
    conn = get_connection()
    cur = conn.cursor()
    try:
        # Join using the new member_id column
        cur.execute(
            "SELECT u.user_id, r.role_name, u.member_id, u.employee_id, u.username FROM freshwash.users u "
            "JOIN freshwash.roles r ON u.role_id = r.role_id "
            "WHERE u.username = %s AND u.password_hash = %s",
            (username, password)
        )
        user = cur.fetchone()
        if user:
            user_id, role_name, member_id, employee_id, db_username = user
            token = str(uuid.uuid4())
            expires = datetime.now() + timedelta(hours=24)
            cur.execute(
                "INSERT INTO freshwash.sessions (user_id, session_token, expires_at) VALUES (%s, %s, %s)",
                (user_id, token, expires)
            )
            conn.commit()
            
            # Map role names to lowercase 'user' or 'admin' or 'employee'
            final_role = role_name.lower().replace('regular user', 'user')
            
            return jsonify({
                "token": token,
                "role": final_role,
                "member_id": member_id,
                "employee_id": employee_id,
                "username": db_username
            }), 200
        return jsonify({"error": "Invalid credentials"}), 401
    finally:
        cur.close()
        conn.close()
