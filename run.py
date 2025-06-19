from server import create_app
import logging

logging.basicConfig(level=logging.DEBUG)

app = create_app()

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)
