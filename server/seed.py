from server.app import create_app
from server.extensions import db
from server.models import User, Startup, Investment

app = create_app()
with app.app_context():
    db.drop_all()
    db.create_all()
    # Add sample users/startups/investments here
