from flask import Flask, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import os

load_dotenv()

import database  # noqa: F401 — validates MongoDB connection at startup
from routes.auth import auth_bp
from routes.user import user_bp

app = Flask(__name__)

# CORS — explicitly list allowed origins (required when supports_credentials=True)
ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://localhost:3000",
    "https://sample-task-frontend.onrender.com",
]

CORS(app,
     resources={r"/api/*": {"origins": ALLOWED_ORIGINS}},
     supports_credentials=True,
     allow_headers=["Content-Type", "Authorization"],
     methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"])

# Register blueprints
app.register_blueprint(auth_bp, url_prefix="/api")
app.register_blueprint(user_bp, url_prefix="/api")


@app.route("/", methods=["GET"])
def health_check():
    return jsonify({"success": True, "message": "Dashboard API is running 🚀"}), 200


@app.route("/api/health", methods=["GET"])
def api_health():
    return jsonify({"success": True, "message": "API healthy", "version": "1.0.0"}), 200


@app.errorhandler(404)
def not_found(e):
    return jsonify({"success": False, "message": "Route not found"}), 404


@app.errorhandler(500)
def server_error(e):
    return jsonify({"success": False, "message": "Internal server error"}), 500


if __name__ == "__main__":
    port = int(os.getenv("PORT", 5000))
    debug = os.getenv("FLASK_ENV", "production") == "development"
    print(f"[OK] Starting server on port {port}")
    app.run(host="0.0.0.0", port=port, debug=debug)
