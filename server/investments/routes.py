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

    if not isinstance(amount, (int, float)) or amount <= 0:
        return jsonify(error='Invalid amount'), 400

    investment = Investment(user_id=user_id, startup_id=startup_id, amount=amount)
    startup.current_funding += amount

    db.session.add(investment)
    db.session.commit()

    return jsonify(
        message='Investment successful',
        investment_id=investment.id,
        new_funding=startup.current_funding
    )

@investments_bp.route('/my-investments', methods=['GET'])
@jwt_required()
def my_investments():
    user_id = get_jwt_identity()
    investments = Investment.query.filter_by(user_id=user_id).all()

    return jsonify([{
        'id': inv.id,
        'startup_name': inv.startup.name,  
        'amount': inv.amount,
        'date_invested': inv.date_invested.isoformat()
    } for inv in investments])

@investments_bp.route('/<int:investment_id>', methods=['PUT'])
@jwt_required()
def edit_investment(investment_id):
    user_id = get_jwt_identity()
    investment = Investment.query.get_or_404(investment_id)

    if investment.user_id != user_id:
        return jsonify(error='Unauthorized'), 403

    new_amount = request.json.get('amount')

    if not isinstance(new_amount, (int, float)) or new_amount <= 0:
        return jsonify(error='Invalid amount'), 400

    # Update funding
    diff = new_amount - investment.amount
    investment.startup.current_funding += diff
    investment.amount = new_amount

    db.session.commit()

    return jsonify(
        message='Investment updated',
        updated_amount=investment.amount,
        new_total_funding=investment.startup.current_funding
    )

@investments_bp.route('/delete/<int:investment_id>', methods=['DELETE'])
@jwt_required()
def delete_investment(investment_id):
    user_id = get_jwt_identity()
    investment = Investment.query.get_or_404(investment_id)

    if investment.user_id != user_id:
        return jsonify(error='Unauthorized'), 403

    investment.startup.current_funding -= investment.amount
    db.session.delete(investment)
    db.session.commit()
    return jsonify(message='Investment deleted')
