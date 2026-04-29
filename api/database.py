import psycopg2
import os
from psycopg2.extras import RealDictCursor

def get_db_connection():
    host = os.getenv("DB_HOST", "aws-1-ap-southeast-2.pooler.supabase.com")
    database = os.getenv("DB_NAME", "postgres")
    user = os.getenv("DB_USER", "postgres.cjzuoyatgfhdtvzdbpkx")
    password = os.getenv("DB_PASS", "nguyennamhung1234")
    port = os.getenv("DB_PORT", "6543")

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