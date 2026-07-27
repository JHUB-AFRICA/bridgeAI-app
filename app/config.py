# ================================================================
# BRIDGE-AI Kenya - Configuration (JSON Version)
# ================================================================
# This file contains all configuration classes for the application.
# Supports development, production, and testing environments.
# No database configuration needed - uses JSON storage.
# ================================================================

import os
from datetime import timedelta
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()


class Config:
    """Base configuration class."""
    
    # ============================================================
    # Application Settings
    # ============================================================
    
    SECRET_KEY = os.environ.get('SECRET_KEY', 'dev-secret-key-change-in-production')
    FLASK_APP = os.environ.get('FLASK_APP', 'run.py')
    FLASK_ENV = os.environ.get('FLASK_ENV', 'development')
    
    # ============================================================
    # JSON Data Storage - No Database Needed!
    # ============================================================
    
    # Path to JSON data files (relative to app root)
    DATA_FOLDER = os.environ.get('DATA_FOLDER', 'app/data')
    
    # ============================================================
    # File Upload Settings
    # ============================================================
    
    MAX_CONTENT_LENGTH = int(os.environ.get('MAX_CONTENT_LENGTH', 16 * 1024 * 1024))  # 16MB
    UPLOAD_FOLDER = os.environ.get('UPLOAD_FOLDER', 'app/static/images/uploads')
    ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'svg', 'webp', 'pdf', 'doc', 'docx', 'mp4', 'webm'}
    
    # ============================================================
    # Flask-Uploads Configuration
    # ============================================================
    
    # Destination folders for different upload sets
    UPLOADED_UPLOADS_DEST = UPLOAD_FOLDER
    UPLOADED_PHOTOS_DEST = os.path.join(UPLOAD_FOLDER, 'photos')
    UPLOADED_DOCUMENTS_DEST = os.path.join(UPLOAD_FOLDER, 'documents')
    UPLOADED_VIDEOS_DEST = os.path.join(UPLOAD_FOLDER, 'videos')
    
    # URL paths for uploaded files
    UPLOADED_UPLOADS_URL = '/static/images/uploads/'
    UPLOADED_PHOTOS_URL = '/static/images/uploads/photos/'
    UPLOADED_DOCUMENTS_URL = '/static/images/uploads/documents/'
    UPLOADED_VIDEOS_URL = '/static/images/uploads/videos/'
    
    # ============================================================
    # Session & Security - FIXED FOR MOBILE
    # ============================================================
    
    # Session cookie settings
    SESSION_COOKIE_SECURE = os.environ.get('SESSION_COOKIE_SECURE', 'False').lower() == 'true'
    SESSION_COOKIE_HTTPONLY = True
    SESSION_COOKIE_SAMESITE = 'Lax'  # ✅ Allows cookies on mobile
    SESSION_COOKIE_DOMAIN = None  # ✅ None = any domain (localhost, IP, hostname)
    
    # Remember me cookie settings
    REMEMBER_COOKIE_SECURE = os.environ.get('REMEMBER_COOKIE_SECURE', 'False').lower() == 'true'
    REMEMBER_COOKIE_DOMAIN = None  # ✅ None = any domain
    REMEMBER_COOKIE_DURATION = timedelta(days=30)
    
    # ✅ Session timeout - 15 minutes of inactivity (security enhancement)
    PERMANENT_SESSION_LIFETIME = timedelta(minutes=15)
    
    # ============================================================
    # CSRF Protection
    # ============================================================
    
    WTF_CSRF_ENABLED = os.environ.get('CSRF_ENABLED', 'True').lower() == 'true'
    WTF_CSRF_SECRET_KEY = os.environ.get('WTF_CSRF_SECRET_KEY', SECRET_KEY)
    
    # ============================================================
    # Rate Limiting - NEW
    # ============================================================
    
    RATELIMIT_DEFAULT = "200 per day;50 per hour"
    RATELIMIT_STORAGE_URL = "memory://"
    RATELIMIT_STRATEGY = "fixed-window"
    
    # ============================================================
    # Email Settings
    # ============================================================
    
    MAIL_SERVER = os.environ.get('MAIL_SERVER', 'smtp.gmail.com')
    MAIL_PORT = int(os.environ.get('MAIL_PORT', 587))
    MAIL_USE_TLS = os.environ.get('MAIL_USE_TLS', 'True').lower() == 'true'
    MAIL_USE_SSL = os.environ.get('MAIL_USE_SSL', 'False').lower() == 'true'
    MAIL_USERNAME = os.environ.get('MAIL_USERNAME', '')
    MAIL_PASSWORD = os.environ.get('MAIL_PASSWORD', '')
    MAIL_DEFAULT_SENDER = os.environ.get('MAIL_DEFAULT_SENDER', 'noreply@bridge-ai-kenya.com')
    MAIL_RECIPIENT = os.environ.get('MAIL_RECIPIENT', 'info@jkuat.ac.ke')
    
    # ============================================================
    # Logging
    # ============================================================
    
    LOG_LEVEL = os.environ.get('LOG_LEVEL', 'INFO')
    LOG_FILE = os.environ.get('LOG_FILE', 'logs/app.log')
    
    # ============================================================
    # Admin Settings
    # ============================================================
    
    ADMIN_USERNAME = os.environ.get('ADMIN_USERNAME', 'admin')
    ADMIN_PASSWORD = os.environ.get('ADMIN_PASSWORD', 'changeme123')
    ADMIN_EMAIL = os.environ.get('ADMIN_EMAIL', 'admin@jkuat.ac.ke')
    
    # ============================================================
    # Analytics (Optional)
    # ============================================================
    
    ANALYTICS_ID = os.environ.get('ANALYTICS_ID', '')
    
    # ============================================================
    # Pagination
    # ============================================================
    
    ITEMS_PER_PAGE = 12
    ADMIN_ITEMS_PER_PAGE = 25
    
    # ============================================================
    # EU Funding Settings
    # ============================================================
    
    EU_FUNDING_STATEMENT = (
        "This project has received funding from the European Union's Horizon Europe "
        "research and innovation programme under grant agreement No. 101299050."
    )
    EU_DISCLAIMER = (
        "Funded by the European Union. Views and opinions expressed are however those "
        "of the author(s) only and do not necessarily reflect those of the European "
        "Union or the European Health and Digital Executive Agency. Neither the "
        "European Union nor the granting authority can be held responsible for them."
    )
    
    # ============================================================
    # Project Facts
    # ============================================================
    
    PROJECT_ACRONYM = "BRIDGE-AI"
    PROJECT_FULL_NAME = "Building ResIlient Development with GEnerative AI in Education & Agriculture"
    GRANT_AGREEMENT = "No. 101299050"
    PROGRAMME = "Horizon Europe Research and Innovation Action"
    DURATION = "36 months"
    COUNTRIES = ["Kenya", "Tunisia", "Nigeria"]
    COORDINATOR = "FUNDACIO EURECAT (EURECAT), Spain"
    KENYA_SITE = "Mushroom Demonstration Farm, JKUAT Smart Farm Zone, Juja, Kenya"
    
    # ============================================================
    # Partner List (for reference)
    # ============================================================
    
    PARTNERS = [
        {"short_name": "EURECAT", "name": "FUNDACIO EURECAT", "country": "Spain"},
        {"short_name": "UPM", "name": "Universidad Politecnica de Madrid", "country": "Spain"},
        {"short_name": "JKUAT", "name": "Jomo Kenyatta University of Agriculture and Technology", "country": "Kenya"},
        {"short_name": "US", "name": "University of Sousse", "country": "Tunisia"},
        {"short_name": "MOOME", "name": "STE LIFEYE SARL", "country": "Tunisia"},
        {"short_name": "AGROINFOTECH", "name": "AgroInfoTech Labs Limited", "country": "Nigeria"},
        {"short_name": "ACV", "name": "Austria Card", "country": "Austria"},
        {"short_name": "SMW", "name": "Seamless Middleware Technologies SL", "country": "Spain"},
    ]


class DevelopmentConfig(Config):
    """Development configuration."""
    
    FLASK_ENV = 'development'
    DEBUG = True
    SESSION_COOKIE_SECURE = False
    REMEMBER_COOKIE_SECURE = False
    LOG_LEVEL = 'DEBUG'
    
    # Email is disabled in development by default
    MAIL_SUPPRESS_SEND = True
    
    # Development-specific settings
    TEMPLATES_AUTO_RELOAD = True


class ProductionConfig(Config):
    """Production configuration."""
    
    FLASK_ENV = 'production'
    DEBUG = False
    TESTING = False
    SESSION_COOKIE_SECURE = True
    REMEMBER_COOKIE_SECURE = True
    LOG_LEVEL = 'INFO'
    
    # Production email settings
    MAIL_SUPPRESS_SEND = False
    
    # Production-specific settings
    TEMPLATES_AUTO_RELOAD = False


class TestingConfig(Config):
    """Testing configuration."""
    
    FLASK_ENV = 'testing'
    DEBUG = True
    TESTING = True
    SESSION_COOKIE_SECURE = False
    REMEMBER_COOKIE_SECURE = False
    LOG_LEVEL = 'ERROR'
    
    # Disable CSRF for testing
    WTF_CSRF_ENABLED = False
    
    # Suppress email
    MAIL_SUPPRESS_SEND = True


# ================================================================
# Configuration Mapping
# ================================================================

config = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'testing': TestingConfig,
    'default': DevelopmentConfig,
}


# ✅ Fixed - returns INSTANCE
def get_config():
    env = os.environ.get('FLASK_ENV', 'development')
    return config.get(env, DevelopmentConfig)()  # ADD ()