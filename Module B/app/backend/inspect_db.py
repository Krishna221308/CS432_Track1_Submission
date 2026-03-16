from db import get_connection

def inspect_schema():
    conn = get_connection()
    cur = conn.cursor()
    
    tables = ['member', 'users', 'roles']
    for table in tables:
        print(f"\n--- Columns in freshwash.{table} ---")
        try:
            cur.execute(f"""
                SELECT column_name, data_type 
                FROM information_schema.columns 
                WHERE table_schema = 'freshwash' AND table_name = '{table}'
            """)
            for col in cur.fetchall():
                print(f"  {col[0]} ({col[1]})")
        except Exception as e:
            print(f"  Error: {e}")
            
    cur.close()
    conn.close()

if __name__ == "__main__":
    inspect_schema()
