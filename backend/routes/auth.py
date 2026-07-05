from flask import Blueprint, request, jsonify
import bcrypt
import jwt
import re
from datetime import datetime, timezone, timedelta
from bson import ObjectId
from config import JWT_SECRET, JWT_ALGORITHM, JWT_EXPIRATION_HOURS
from database import db  # ← shared MongoDB connection

auth_bp = Blueprint("auth", __name__)

EMAIL_REGEX = re.compile(r"^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$")


def generate_token(user_id: str) -> str:
    payload = {
        "user_id": user_id,
        "exp": datetime.now(timezone.utc) + timedelta(hours=JWT_EXPIRATION_HOURS),
        "iat": datetime.now(timezone.utc),
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)


def serialize_user(user: dict) -> dict:
    return {
        "id": str(user["_id"]),
        "username": user["username"],
        "email": user["email"],
        "createdAt": user.get("createdAt", "").isoformat() if user.get("createdAt") else "",
    }


@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json(silent=True) or {}

    username = data.get("username", "").strip()
    email = data.get("email", "").strip().lower()
    password = data.get("password", "")
    confirm_password = data.get("confirmPassword", "")

    # Validation
    errors = {}
    if not username:
        errors["username"] = "Username is required"
    elif len(username) < 3:
        errors["username"] = "Username must be at least 3 characters"

    if not email:
        errors["email"] = "Email is required"
    elif not EMAIL_REGEX.match(email):
        errors["email"] = "Invalid email address"

    if not password:
        errors["password"] = "Password is required"
    elif len(password) < 8:
        errors["password"] = "Password must be at least 8 characters"

    if password != confirm_password:
        errors["confirmPassword"] = "Passwords do not match"

    if errors:
        return jsonify({"success": False, "errors": errors, "message": "Validation failed"}), 400

    # Check duplicate email
    if db.users.find_one({"email": email}):
        return jsonify({"success": False, "message": "An account with this email already exists"}), 409

    # Hash password
    hashed = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt())

    # Insert user
    user_doc = {
        "username": username,
        "email": email,
        "password": hashed,
        "createdAt": datetime.now(timezone.utc),
    }
    result = db.users.insert_one(user_doc)
    user_doc["_id"] = result.inserted_id

    token = generate_token(str(result.inserted_id))

    return jsonify({
        "success": True,
        "message": "Account created successfully! Welcome aboard 🎉",
        "token": token,
        "user": serialize_user(user_doc),
    }), 201


@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json(silent=True) or {}

    email = data.get("email", "").strip().lower()
    password = data.get("password", "")

    errors = {}
    if not email:
        errors["email"] = "Email is required"
    elif not EMAIL_REGEX.match(email):
        errors["email"] = "Invalid email address"
    if not password:
        errors["password"] = "Password is required"

    if errors:
        return jsonify({"success": False, "errors": errors, "message": "Validation failed"}), 400

    user = db.users.find_one({"email": email})
    if not user:
        return jsonify({"success": False, "message": "Invalid email or password"}), 401

    if not bcrypt.checkpw(password.encode("utf-8"), user["password"]):
        return jsonify({"success": False, "message": "Invalid email or password"}), 401

    token = generate_token(str(user["_id"]))

    return jsonify({
        "success": True,
        "message": "Welcome back! 👋",
        "token": token,
        "user": serialize_user(user),
    }), 200
