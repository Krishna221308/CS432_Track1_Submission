import psycopg2

def get_connection():
    conn = psycopg2.connect(
        host="localhost",
        database="freshwashdb",
        user="postgres",
        password="mypassword"
    )
    return conn

def ensure_schema():
    """
    Best-effort, idempotent schema patching for dev/demo environments.
    Ensures features added in code exist in the DB (without requiring a full reload).
    """
    conn = get_connection()
    cur = conn.cursor()
    try:
        # Ensure member.assigned_employee_id exists
        cur.execute(
            """
            SELECT 1
            FROM information_schema.columns
            WHERE table_schema = 'freshwash'
              AND table_name = 'member'
              AND column_name = 'assigned_employee_id'
            """
        )
        has_col = cur.fetchone() is not None
        if not has_col:
            cur.execute("ALTER TABLE freshwash.member ADD COLUMN assigned_employee_id INT")

        # Ensure FK exists (safe even if column just added)
        cur.execute(
            """
            SELECT 1
            FROM information_schema.table_constraints
            WHERE constraint_schema = 'freshwash'
              AND table_name = 'member'
              AND constraint_name = 'fk_member_assigned_employee'
            """
        )
        has_fk = cur.fetchone() is not None
        if not has_fk:
            cur.execute(
                """
                ALTER TABLE freshwash.member
                ADD CONSTRAINT fk_member_assigned_employee
                FOREIGN KEY (assigned_employee_id)
                REFERENCES freshwash.employee (employee_id)
                ON DELETE SET NULL
                """
            )

        # Ensure index exists
        cur.execute(
            """
            SELECT 1
            FROM pg_indexes
            WHERE schemaname = 'freshwash'
              AND tablename = 'member'
              AND indexname = 'idx_member_assigned_employee_id'
            """
        )
        has_idx = cur.fetchone() is not None
        if not has_idx:
            cur.execute("CREATE INDEX idx_member_assigned_employee_id ON freshwash.member (assigned_employee_id)")

        conn.commit()
    except Exception:
        # Don't block app start in class projects; the API will surface DB errors if any.
        conn.rollback()
    finally:
        cur.close()
        conn.close()