from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from server.models import User
from server.extensions import db
import os
from werkzeug.utils import secure_filename

auth_bp = Blueprint('auth', __name__)

UPLOAD_FOLDER = os.path.join('server', 'static', 'uploads')
DEFAULT_AVATAR = 'static/uploads/default-avatar.png'  # relative to Flask app

@auth_bp.route('/register', methods=['POST', 'OPTIONS'])
def register():
    if request.method == 'OPTIONS':
        return '', 200

    # Handle both JSON and form data
    if request.content_type.startswith('multipart/form-data'):
        username = request.form.get('username')
        email = request.form.get('email')
        password = request.form.get('password')
        file = request.files.get('profile_image')
    else:
        data = request.get_json()
        username = data.get('username')
        email = data.get('email')
        password = data.get('password')
        file = None

    if not all([username, email, password]):
        return jsonify(error='Missing required fields'), 400

    if User.query.filter((User.username == username) | (User.email == email)).first():
        return jsonify(error='Username or email already taken'), 400

    filename = None
    if file:
        os.makedirs(UPLOAD_FOLDER, exist_ok=True)
        ext = os.path.splitext(secure_filename(file.filename))[-1]
        filename = f"user_{username}{ext}"
        path = os.path.join(UPLOAD_FOLDER, filename)
        file.save(path)
        image_path = f"static/uploads/{filename}"
    else:
        image_path = DEFAULT_AVATAR

    user = User(username=username, email=email, profile_image=image_path)
    user.set_password(password)
    db.session.add(user)
    db.session.commit()
    return jsonify(message='User registered'), 201

@auth_bp.route('/login', methods=['POST', 'OPTIONS'])
def login():
    if request.method == 'OPTIONS':
        return '', 200

    data = request.json
    user = User.query.filter_by(email=data['email']).first()
    if user and user.check_password(data['password']):
        token = create_access_token(identity=user.id)
        return jsonify(access_token=token)
    return jsonify(error='Invalid credentials'), 401

@auth_bp.route('/me', methods=['GET'])
@jwt_required()
def get_profile():
    user = User.query.get(get_jwt_identity())
    return jsonify(
        username=user.username,
        email=user.email,
        is_admin=user.is_admin,
        profile_image=user.profile_image
    )
