from flask import Flask, send_from_directory
from flask_cors import CORS
import os

def create_app():
    static_folder = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'static'))
    app = Flask(__name__, static_folder=static_folder)
    CORS(app)

    @app.route('/', defaults={'path': ''})
    @app.route('/<path:path>')
    def serve(path):
        if path and os.path.exists(os.path.join(app.static_folder, path)):
            return send_from_directory(app.static_folder, path)
        return send_from_directory(app.static_folder, 'index.html')

    from .routes import api_bp
    app.register_blueprint(api_bp, url_prefix='/api')

    return app
