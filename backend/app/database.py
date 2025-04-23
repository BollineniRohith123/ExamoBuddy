import psycopg2
from psycopg2.extras import RealDictCursor
from contextlib import contextmanager
from . import config

def get_connection_string():
    """Get the database connection string."""
    return f"postgresql://{config.DB_USER}:{config.DB_PASSWORD}@{config.DB_HOST}:{config.DB_PORT}/{config.DB_NAME}"

@contextmanager
def get_db():
    """Database connection context manager."""
    conn = None
    try:
        # Connect to the PostgreSQL database
        conn = psycopg2.connect(
            host=config.DB_HOST,
            port=config.DB_PORT,
            dbname=config.DB_NAME,
            user=config.DB_USER,
            password=config.DB_PASSWORD,
            cursor_factory=RealDictCursor
        )
        # Create a cursor
        cur = conn.cursor()
        # Return the cursor
        yield cur
        # Commit the transaction
        conn.commit()
    except Exception as e:
        # Rollback in case of error
        if conn:
            conn.rollback()
        raise e
    finally:
        # Close the cursor and connection
        if conn:
            if cur:
                cur.close()
            conn.close()
