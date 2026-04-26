import psycopg2
import os
from psycopg2.extras import RealDictCursor

def get_db_connection():
    host = os.getenv("DB_HOST", "db.cjzuoyatgfhdtvzdbpkx.supabase.co")
    database = os.getenv("DB_NAME", "postgres")
    user = os.getenv("DB_USER", "postgres")
    password = os.getenv("DB_PASS", "Hungnn03022005@")
    port = os.getenv("DB_PORT", "5432")

    try:
        conn = psycopg2.connect(
            host=host,
            database=database,
            user=user,
            password=password,
            port=port,
            sslmode="require", 
            cursor_factory=RealDictCursor,
            connect_timeout=5
        )
        return conn
    except Exception as e:
        print(f"Database error: {e}")
        raise e