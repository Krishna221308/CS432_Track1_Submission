import functools
import json
import os
from datetime import datetime
from flask import request, jsonify
from db import get_connection

LOG_FILE = os.path.join(os.path.dirname(__file__), '..', '..', 'logs', 'audit.log')

def get_user_from_session(token):
    """Verifies session token and returns user information."""
    if not token:
        return None
    
    conn = get_connection()
    cur = conn.cursor()
    try:
        cur.execute(
            """
            SELECT u.username, u.user_id, r.role_name 
            FROM freshwash.sessions s
            JOIN freshwash.users u ON s.user_id = u.user_id
            JOIN freshwash.roles r ON u.role_id = r.role_id
            WHERE s.session_token = %s AND s.expires_at > CURRENT_TIMESTAMP AND s.is_active = TRUE
            """,
            (token,)
        )
        return cur.fetchone()
    except Exception as e:
        print(f"Session verification error: {e}")
        return None
    finally:
        cur.close()
        conn.close()

def audit_log(f):
    """Decorator to log API requests to a file for auditing."""
    @functools.wraps(f)
    def decorated_function(*args, **kwargs):
        # Only log write operations or critical paths
        is_write_op = request.method in ['POST', 'PUT', 'DELETE', 'PATCH']
        
        # Get session token from header
        token = request.headers.get('Authorization')
        if token and token.startswith('Bearer '):
            token = token.split(' ')[1]
        
        user_info = get_user_from_session(token)
        username = user_info[0] if user_info else "Anonymous/Guest"
        
        # Execute the actual function
        response = f(*args, **kwargs)
        
        # Get status code from response
        status_code = 200
        if isinstance(response, tuple):
            if len(response) > 1:
                status_code = response[1]
        elif hasattr(response, 'status_code'):
            status_code = response.status_code

        # Log entry details
        log_entry = {
            "timestamp": datetime.now().isoformat(),
            "user": username,
            "method": request.method,
            "path": request.path,
            "status": status_code,
            "ip": request.remote_addr,
            "payload": request.json if request.is_json and is_write_op else None
        }
        
        # Append to audit.log
        try:
            with open(LOG_FILE, 'a') as lf:
                lf.write(json.dumps(log_entry) + '\n')
        except Exception as e:
            print(f"Failed to write to audit log: {e}")
            
        return response
    return decorated_function
