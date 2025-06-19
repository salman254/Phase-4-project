from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from ..extensions import db
from ..models import Investment, Startup, User

investments_bp = Blueprint('investments', __name__)

@investments_bp.route('/invest/<int:startup_id>', methods=['POST'])
@jwt_required()
def invest(startup_id):
    user_id = get_jwt_identity()
    startup = Startup.query.get_or_404(startup_id)
    amount = request.json.get('amount')
    if amount <= 0:
        return jsonify(error='Invalid amount'), 400

    investment = Investment(user_id=user_id, startup_id=startup_id, amount=amount)
    startup.current_funding += amount
    db.session.add(investment)
    db.session.commit()
    return jsonify(message='Investment successful', new_funding=startup.current_funding)

@investments_bp.route('/my-investments', methods=['GET'])
@jwt_required()
def my_investments():
    user_id = get_jwt_identity()
    investments = Investment.query.filter_by(user_id=user_id).all()
    return jsonify([{
        'startup': inv.startup.name,
        'amount': inv.amount,
        'date_invested': inv.date_invested.isoformat()
    } for inv in investments])
