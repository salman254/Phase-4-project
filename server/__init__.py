from flask import Flask, send_from_directory
from flask_cors import CORS
from server.config import Config
from server.extensions import db, migrate, bcrypt, jwt
from server.auth.routes import auth_bp
from server.users.routes import users_bp
from server.startups.routes import startups_bp
from server.investments.routes import investments_bp
import os

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Ensure upload directory exists
    os.makedirs(app.config["UPLOAD_FOLDER"], exist_ok=True)

    # Attach CORS
    CORS(
        app,
        resources={r"/*": {"origins": "http://localhost:3000"}},
        supports_credentials=True,
        allow_headers=["Content-Type", "Authorization"],
        methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"]
    )

    db.init_app(app)
    migrate.init_app(app, db)
    bcrypt.init_app(app)
    jwt.init_app(app)

    app.register_blueprint(auth_bp, url_prefix='/auth')
    app.register_blueprint(users_bp, url_prefix='/users')
    app.register_blueprint(startups_bp, url_prefix='/startups')
    app.register_blueprint(investments_bp, url_prefix='/investments')

    # Serve profile pictures
    @app.route('/uploads/<filename>')
    def uploaded_file(filename):
        return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

    return app
