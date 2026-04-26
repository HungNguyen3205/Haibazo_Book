import psycopg2 
from psycopg2.extras import RealDictCursor
def get_db_connection():
    return psycopg2.connect(
        host="db.cjzuoyatgfhdtvzdbpkx.supabase.co",
        database="postgres",
        user="postgres",
        password="Hungnn03022005@", 
        port="5432",
        sslmode="require",
        cursor_factory=RealDictCursor
    )