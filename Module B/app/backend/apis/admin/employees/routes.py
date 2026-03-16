from flask import Blueprint, jsonify, request
from db import get_connection

employees_bp = Blueprint('admin_employees', __name__)

@employees_bp.route('/employees', methods=['GET'])
def get_all_employees():
    """Get all employees"""
    conn = get_connection()
    cur = conn.cursor()
    try:
        cur.execute(
            "SELECT employee_id, employee_name, role, contact_number, joining_date "
            "FROM freshwash.employee "
            "ORDER BY joining_date DESC"
        )
        rows = cur.fetchall()
        employees = []
        for r in rows:
            employees.append({
                "employee_id": r[0],
                "name": r[1],
                "role": r[2],
                "contact": r[3],
                "joining_date": r[4].isoformat() if r[4] else None
            })
        return jsonify(employees), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400
    finally:
        cur.close()
        conn.close()

@employees_bp.route('/employees/<int:employee_id>', methods=['GET'])
def get_employee_details(employee_id):
    """Get specific employee details"""
    conn = get_connection()
    cur = conn.cursor()
    try:
        cur.execute(
            "SELECT employee_id, employee_name, role, contact_number, joining_date "
            "FROM freshwash.employee "
            "WHERE employee_id = %s",
            (employee_id,)
        )
        row = cur.fetchone()
        if row:
            return jsonify({
                "employee_id": row[0],
                "name": row[1],
                "role": row[2],
                "contact": row[3],
                "joining_date": row[4].isoformat() if row[4] else None
            }), 200
        return jsonify({"error": "Employee not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 400
    finally:
        cur.close()
        conn.close()

@employees_bp.route('/employees', methods=['POST'])
def create_employee():
    """Create new employee"""
    data = request.json
    conn = get_connection()
    cur = conn.cursor()
    try:
        cur.execute(
            "INSERT INTO freshwash.employee (employee_name, role, contact_number, joining_date) "
            "VALUES (%s, %s, %s, %s) RETURNING employee_id",
            (data['name'], data['role'], data['contact'], data['joining_date'])
        )
        employee_id = cur.fetchone()[0]
        conn.commit()
        return jsonify({"message": "Employee created", "employee_id": employee_id}), 201
    except Exception as e:
        conn.rollback()
        return jsonify({"error": str(e)}), 400
    finally:
        cur.close()
        conn.close()

@employees_bp.route('/employees/<int:employee_id>', methods=['PUT'])
def update_employee(employee_id):
    """Update employee details"""
    data = request.json
    conn = get_connection()
    cur = conn.cursor()
    try:
        cur.execute(
            "UPDATE freshwash.employee SET employee_name = %s, role = %s, contact_number = %s "
            "WHERE employee_id = %s",
            (data['name'], data['role'], data['contact'], employee_id)
        )
        conn.commit()
        return jsonify({"message": "Employee updated"}), 200
    except Exception as e:
        conn.rollback()
        return jsonify({"error": str(e)}), 400
    finally:
        cur.close()
        conn.close()

@employees_bp.route('/employees/<int:employee_id>', methods=['DELETE'])
def delete_employee(employee_id):
    """Delete employee"""
    conn = get_connection()
    cur = conn.cursor()
    try:
        cur.execute(
            "DELETE FROM freshwash.employee WHERE employee_id = %s",
            (employee_id,)
        )
        conn.commit()
        return jsonify({"message": "Employee deleted"}), 200
    except Exception as e:
        conn.rollback()
        return jsonify({"error": str(e)}), 400
    finally:
        cur.close()
        conn.close()
