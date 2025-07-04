import os
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from werkzeug.utils import secure_filename
from server.extensions import db
from server.models import User, Startup

users_bp = Blueprint('users', __name__)

@users_bp.route('/me', methods=['PUT'])
@jwt_required()
def update_profile():
    current_user = User.query.get(get_jwt_identity())
    data = request.json
    current_user.username = data.get('username', current_user.username)
    current_user.email = data.get('email', current_user.email)
    if 'password' in data:
        current_user.set_password(data['password'])
    db.session.commit()
    return jsonify(message='Profile updated')

@users_bp.route('/profile-image', methods=['POST'])
@jwt_required()
def upload_profile_image():
    user = User.query.get(get_jwt_identity())

    if 'profile_image' not in request.files:
        return jsonify(error='No file uploaded'), 400

    file = request.files['profile_image']
    if file.filename == '':
        return jsonify(error='Empty filename'), 400

    # Secure filename and save to uploads folder
    filename = secure_filename(f"user_{user.id}_{file.filename}")
    upload_folder = os.path.join('server', 'static', 'uploads')
    os.makedirs(upload_folder, exist_ok=True)
    path = os.path.join(upload_folder, filename)
    file.save(path)

    # Update user profile image in DB
    user.profile_image = filename
    db.session.commit()

    return jsonify(message='Image uploaded', profile_image=filename)

@users_bp.route('/admin/startups', methods=['GET'])
@jwt_required()
def admin_view_startups():
    user = User.query.get(get_jwt_identity())
    if not user.is_admin:
        return jsonify(error='Admin access only'), 403
    startups = Startup.query.all()
    return jsonify([{
        'id': s.id, 'name': s.name, 'user_id': s.user_id,
        'category': s.category, 'funding_goal': s.funding_goal,
        'current_funding': s.current_funding
    } for s in startups])

@users_bp.route('/admin/startups/<int:id>', methods=['DELETE'])
@jwt_required()
def admin_delete_startup(id):
    user = User.query.get(get_jwt_identity())
    if not user.is_admin:
        return jsonify(error='Admin access only'), 403
    startup = Startup.query.get_or_404(id)
    db.session.delete(startup)
    db.session.commit()
    return jsonify(message='Startup deleted')

@users_bp.route('/admin/reset-user/<int:id>', methods=['POST'])
@jwt_required()
def reset_user(id):
    admin = User.query.get(get_jwt_identity())
    if not admin.is_admin:
        return jsonify(error='Admin access only'), 403
    user = User.query.get_or_404(id)
    user.username = f'reset_{user.id}'
    user.set_password('default123')
    db.session.commit()
    return jsonify(message='User reset')

@users_bp.route('/admin/dashboard', methods=['GET'])
@jwt_required()
def admin_dashboard():
    user = User.query.get(get_jwt_identity())
    if not user.is_admin:
        return jsonify(error='Admin access only'), 403

    startups = Startup.query.all()
    users = User.query.all()

    return jsonify({
        "startups": [
            {
                "id": s.id,
                "name": s.name,
                "category": s.category,
                "funding_goal": s.funding_goal,
                "current_funding": s.current_funding,
                "owner": s.owner.username
            } for s in startups
        ],
        "users": [
            {
                "id": u.id,
                "username": u.username,
                "email": u.email,
                "is_admin": u.is_admin,
                "profile_image": u.profile_image
            } for u in users
        ]
    })
