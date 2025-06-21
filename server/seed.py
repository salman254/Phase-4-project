from server import create_app
from server.extensions import db
from server.models import User

app = create_app()

with app.app_context():
    db.drop_all()
    db.create_all()

    # Create default admin
    admin = User(username='admin', email='admin@example.com', is_admin=True)
    admin.set_password('adminpass')

    db.session.add(admin)
    db.session.commit()

    print("✅ Database seeded with default admin")
