import psycopg2

def get_connection():
    conn = psycopg2.connect(
        host="localhost",
        database="freshwashdb",
        user="postgres",
        password="mypassword"
    )
    return conn