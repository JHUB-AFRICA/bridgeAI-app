# ================================================================
# BRIDGE-AI Kenya - Flask Extensions (JSON Version)
# ================================================================

import os
from flask_wtf import CSRFProtect
from flask_login import LoginManager, UserMixin
from flask_mail import Mail
# ❌ REMOVED: from flask_uploads import UploadSet, IMAGES, configure_uploads
from werkzeug.security import check_password_hash
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address


# ================================================================
# CSRF Protection
# ================================================================

csrf = CSRFProtect()


# ================================================================
# Rate Limiter
# ================================================================

limiter = Limiter(
    key_func=get_remote_address,
    storage_uri="memory://"
)


# ================================================================
# Login Manager
# ================================================================

login_manager = LoginManager()
login_manager.login_view = 'admin.admin_login'
login_manager.login_message = 'Please log in to access the admin panel.'
login_manager.login_message_category = 'warning'
login_manager.session_protection = 'strong'


# ================================================================
# Email
# ================================================================

mail = Mail()


# ================================================================
# ❌ REMOVED: File Uploads (flask_uploads)
# ================================================================
# The following has been removed:
# - photos = UploadSet('photos', IMAGES)
# - documents = UploadSet('documents', ('pdf', 'doc', 'docx', 'txt', 'rtf'))
# - videos = UploadSet('videos', ('mp4', 'webm', 'ogg', 'mov', 'avi'))
# - uploads = UploadSet('uploads', (...))


# ================================================================
# User Class for Login Manager
# ================================================================

class User(UserMixin):
    """
    Simple User class for Flask-Login with JSON storage.
    No database needed - uses JSON data from users.json.
    """
    def __init__(self, user_data):
        self.id = user_data.get('id')
        self.username = user_data.get('username')
        self.password_hash = user_data.get('password_hash')
        self.email = user_data.get('email')
        self.full_name = user_data.get('full_name')
        self.role = user_data.get('role', 'admin')
        # Store is_active in a private variable to avoid conflict with UserMixin
        self._is_active = user_data.get('is_active', True)
        self.last_login = user_data.get('last_login')
        self.created_at = user_data.get('created_at')
        self.updated_at = user_data.get('updated_at')
    
    def check_password(self, password):
        """Check if password matches hash."""
        return check_password_hash(self.password_hash, password)
    
    def get_id(self):
        """Return user ID as string for Flask-Login."""
        return str(self.id)
    
    @property
    def is_active(self):
        """Override is_active property from UserMixin."""
        return self._is_active
    
    @is_active.setter
    def is_active(self, value):
        """Setter for is_active property."""
        self._is_active = value
    
    @property
    def is_authenticated(self):
        return True
    
    @property
    def is_anonymous(self):
        return False


# ================================================================
# User Loader for Login Manager
# ================================================================

@login_manager.user_loader
def load_user(user_id):
    """
    Load user by ID for Flask-Login from JSON file.
    """
    try:
        # Import here to avoid circular imports
        from app.services.json_service import JSONService
        json_service = JSONService()
        
        # Get all users from JSON
        users = json_service.get_all('users.json')
        
        # Find user by ID
        for user_data in users:
            if str(user_data.get('id')) == str(user_id):
                return User(user_data)
        
        return None
    except Exception as e:
        print(f"Error loading user: {e}")
        return None


# ================================================================
# Extension Initialization Helper
# ================================================================

def init_extensions(app):
    """
    Initialize all extensions with the Flask application.
    This should be called after the app is created.
    """
    csrf.init_app(app)
    login_manager.init_app(app)
    mail.init_app(app)
    limiter.init_app(app)
    
    # ❌ REMOVED: configure_uploads(app, uploads)
    # ❌ REMOVED: configure_uploads(app, photos)
    # ❌ REMOVED: configure_uploads(app, documents)
    # ❌ REMOVED: configure_uploads(app, videos)
    
    # Create upload directories if they don't exist
    upload_dirs = [
        app.config.get('UPLOAD_FOLDER', 'app/static/images/uploads'),
        os.path.join(app.config.get('UPLOAD_FOLDER', 'app/static/images/uploads'), 'activities'),
        os.path.join(app.config.get('UPLOAD_FOLDER', 'app/static/images/uploads'), 'events'),
        os.path.join(app.config.get('UPLOAD_FOLDER', 'app/static/images/uploads'), 'team'),
        os.path.join(app.config.get('UPLOAD_FOLDER', 'app/static/images/uploads'), 'resources'),
        'app/static/images/gallery',
        'app/static/images/hero',
    ]
    
    for directory in upload_dirs:
        if not os.path.exists(directory):
            os.makedirs(directory, exist_ok=True)
    
    return app


# ================================================================
# Export all
# ================================================================

__all__ = [
    'csrf',
    'limiter',
    'login_manager',
    'mail',
    # ❌ REMOVED: 'uploads', 'photos', 'documents', 'videos'
    'User',
    'load_user',
    'init_extensions'
]