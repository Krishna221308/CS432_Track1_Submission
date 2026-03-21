from db import get_connection

conn = get_connection()
cur = conn.cursor()

cur.execute("show columns FROM freshwash.member")

result = cur.fetchone()

print("Member count:", result)

cur.close()
conn.close()