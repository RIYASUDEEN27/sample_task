from flask import Blueprint, request, jsonify, g
import re
from bson import ObjectId
from middleware.auth_middleware import token_required
from database import db  # ← shared MongoDB connection

user_bp = Blueprint("user", __name__)

EMAIL_REGEX = re.compile(r"^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$")


def serialize_user(user: dict) -> dict:
    return {
        "id": str(user["_id"]),
        "username": user["username"],
        "email": user["email"],
        "createdAt": user.get("createdAt", "").isoformat() if user.get("createdAt") else "",
    }


@user_bp.route("/profile", methods=["GET"])
@token_required
def get_profile():
    user = g.current_user
    return jsonify({
        "success": True,
        "user": serialize_user(user),
    }), 200


@user_bp.route("/profile", methods=["PUT"])
@token_required
def update_profile():
    data = request.get_json(silent=True) or {}
    user_id = g.current_user_id

    username = data.get("username", "").strip()
    email = data.get("email", "").strip().lower()

    errors = {}
    if not username:
        errors["username"] = "Username is required"
    elif len(username) < 3:
        errors["username"] = "Username must be at least 3 characters"

    if not email:
        errors["email"] = "Email is required"
    elif not EMAIL_REGEX.match(email):
        errors["email"] = "Invalid email address"

    if errors:
        return jsonify({"success": False, "errors": errors, "message": "Validation failed"}), 400

    # Check if email taken by another user
    existing = db.users.find_one({"email": email, "_id": {"$ne": ObjectId(user_id)}})
    if existing:
        return jsonify({"success": False, "message": "This email is already in use by another account"}), 409

    db.users.update_one(
        {"_id": ObjectId(user_id)},
        {"$set": {"username": username, "email": email}},
    )

    updated_user = db.users.find_one({"_id": ObjectId(user_id)})
    return jsonify({
        "success": True,
        "message": "Profile updated successfully ✅",
        "user": serialize_user(updated_user),
    }), 200
