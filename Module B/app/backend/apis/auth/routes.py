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
        cur.execute(
            "INSERT INTO freshwash.users (username, password_hash, role_id) VALUES (%s, %s, 2) RETURNING user_id",
            (data['username'], data['password'])
        )
        user_id = cur.fetchone()[0]
        
        cur.execute(
            "INSERT INTO freshwash.member (name, age, email, contact_number, address) VALUES (%s, %s, %s, %s, %s) RETURNING member_id",
            (data['name'], data['age'], data['email'], data['contact'], data['address'])
        )
        member_id = cur.fetchone()[0]
        
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
        cur.execute(
            "SELECT u.user_id, r.role_name, m.member_id FROM freshwash.users u "
            "JOIN freshwash.roles r ON u.role_id = r.role_id "
            "LEFT JOIN freshwash.member m ON m.email = (SELECT email FROM freshwash.member WHERE name = u.username OR email = u.username LIMIT 1) "
            "WHERE u.username = %s AND u.password_hash = %s",
            (username, password)
        )
        user = cur.fetchone()
        if user:
            user_id, role_name, member_id = user
            token = str(uuid.uuid4())
            expires = datetime.now() + timedelta(hours=24)
            cur.execute(
                "INSERT INTO freshwash.sessions (user_id, session_token, expires_at) VALUES (%s, %s, %s)",
                (user_id, token, expires)
            )
            conn.commit()
            return jsonify({
                "token": token,
                "role": role_name.lower().replace('regular user', 'user'),
                "member_id": member_id,
                "username": username
            }), 200
        return jsonify({"error": "Invalid credentials"}), 401
    finally:
        cur.close()
        conn.close()
