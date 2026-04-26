import psycopg2
import os
from psycopg2.extras import RealDictCursor

def get_db_connection():
    try:
        conn = psycopg2.connect(
            host=os.getenv("DB_HOST", "db.cjzuoyatgfhdtvzdbpkx.supabase.co"),
            database=os.getenv("DB_NAME", "postgres"),
            user=os.getenv("DB_USER", "postgres"),
            password=os.getenv("DB_PASS", "Hungnn03022005@"),
            port=os.getenv("DB_PORT", "5432"),
            sslmode="require",
            cursor_factory=RealDictCursor,
            connect_timeout=10 
        )
        return conn
    except Exception as e:
        print(f"Database connection failed: {e}")
        raise e 