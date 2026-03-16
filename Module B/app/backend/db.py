import psycopg2

def get_connection():
    conn = psycopg2.connect(
        host="localhost",
        database="freshwash_db",
        user="postgres",
        password="mypassword"
    )
    return conn