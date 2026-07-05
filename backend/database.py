"""
Shared MongoDB connection — single PyMongo client for the entire app.

Usage in any module:
    from database import db

    user = db.users.find_one({"email": email})
"""

from pymongo import MongoClient
from pymongo.errors import ConnectionFailure
from config import MONGO_URI
import sys
import os


def create_client() -> MongoClient:
    """Create and validate MongoDB connection on startup."""
    try:
        client = MongoClient(
            MONGO_URI,
            serverSelectionTimeoutMS=5000,
            connectTimeoutMS=10000,
            socketTimeoutMS=10000,
        )
        # Verify the connection works immediately
        client.admin.command("ping")
        print("[OK] MongoDB connected successfully")
        return client
    except ConnectionFailure as exc:
        print(f"[ERROR] MongoDB connection failed: {exc}")
        print("    Check your MONGO_URI in backend/.env")
        sys.exit(1)


# Single shared client + db instance
client: MongoClient = create_client()

# Use explicit DB name — works even if URI has no database name embedded
DB_NAME = os.environ.get("DB_NAME", "dashboard_db")
db = client[DB_NAME]

# Ensure indexes for performance & uniqueness
db.users.create_index("email", unique=True)
print(f"[OK] Using database: '{DB_NAME}'")
print("[OK] Indexes ensured on users.email")
