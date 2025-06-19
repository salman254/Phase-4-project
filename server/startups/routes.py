from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from server.extensions import db
from server.models import Startup

startups_bp = Blueprint('startups', __name__)

@startups_bp.route('/', methods=['POST'])
@jwt_required()
def create_startup():
    data = request.json
    user_id = get_jwt_identity()
    startup = Startup(
        name=data['name'],
        category=data['category'],
        funding_goal=data['funding_goal'],
        user_id=user_id
    )
    db.session.add(startup)
    db.session.commit()
    return jsonify(message='Startup created', id=startup.id), 201

@startups_bp.route('/', methods=['GET'])
def list_startups():
    startups = Startup.query.all()
    return jsonify([{
        'id': s.id,
        'name': s.name,
        'category': s.category,
        'funding_goal': s.funding_goal,
        'current_funding': s.current_funding,
        'owner': s.owner.username
    } for s in startups])

@startups_bp.route('/mine', methods=['GET'])
@jwt_required()
def user_startups():
    user_id = get_jwt_identity()
    startups = Startup.query.filter_by(user_id=user_id).all()
    return jsonify([{
        'id': s.id,
        'name': s.name,
        'category': s.category,
        'funding_goal': s.funding_goal,
        'current_funding': s.current_funding
    } for s in startups])

@startups_bp.route('/<int:id>', methods=['PUT'])
@jwt_required()
def update_startup(id):
    user_id = get_jwt_identity()
    startup = Startup.query.get_or_404(id)
    if startup.user_id != user_id:
        return jsonify(error='Unauthorized'), 403
    data = request.json
    startup.name = data.get('name', startup.name)
    startup.category = data.get('category', startup.category)
    startup.funding_goal = data.get('funding_goal', startup.funding_goal)
    db.session.commit()
    return jsonify(message='Startup updated')

@startups_bp.route('/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_startup(id):
    user_id = get_jwt_identity()
    startup = Startup.query.get_or_404(id)
    if startup.user_id != user_id:
        return jsonify(error='Unauthorized'), 403
    db.session.delete(startup)
    db.session.commit()
    return jsonify(message='Startup deleted')