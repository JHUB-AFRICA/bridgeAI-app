# ================================================================
# BRIDGE-AI KENYA - Gunicorn Configuration (JSON Version)
# ================================================================
# This file configures the Gunicorn WSGI server for production.
# No database required - uses JSON file storage.
# ================================================================

import multiprocessing
import os

# ================================================================
# Server Socket
# ================================================================

bind = os.environ.get('GUNICORN_BIND', '0.0.0.0:5000')
backlog = 2048

# ================================================================
# Worker Processes
# ================================================================

# Number of worker processes
workers = int(os.environ.get('GUNICORN_WORKERS', multiprocessing.cpu_count() * 2 + 1))
worker_class = os.environ.get('GUNICORN_WORKER_CLASS', 'sync')
worker_connections = int(os.environ.get('GUNICORN_WORKER_CONNECTIONS', 1000))
max_requests = int(os.environ.get('GUNICORN_MAX_REQUESTS', 1000))
max_requests_jitter = int(os.environ.get('GUNICORN_MAX_REQUESTS_JITTER', 100))
timeout = int(os.environ.get('GUNICORN_TIMEOUT', 30))
graceful_timeout = int(os.environ.get('GUNICORN_GRACEFUL_TIMEOUT', 30))
keepalive = int(os.environ.get('GUNICORN_KEEPALIVE', 2))

# ================================================================
# Process Management
# ================================================================

daemon = os.environ.get('GUNICORN_DAEMON', 'False').lower() == 'true'
pidfile = os.environ.get('GUNICORN_PIDFILE', None)
umask = 0o022
user = os.environ.get('GUNICORN_USER', None)
group = os.environ.get('GUNICORN_GROUP', None)
tmp_upload_dir = os.environ.get('GUNICORN_TMP_UPLOAD_DIR', None)

# ================================================================
# Logging
# ================================================================

accesslog = os.environ.get('GUNICORN_ACCESS_LOG', '-')
errorlog = os.environ.get('GUNICORN_ERROR_LOG', '-')
loglevel = os.environ.get('GUNICORN_LOG_LEVEL', 'info')
access_log_format = '%(h)s %(l)s %(u)s %(t)s "%(r)s" %(s)s %(b)s "%(f)s" "%(a)s"'

# ================================================================
# Security
# ================================================================

limit_request_line = int(os.environ.get('GUNICORN_LIMIT_REQUEST_LINE', 4094))
limit_request_fields = int(os.environ.get('GUNICORN_LIMIT_REQUEST_FIELDS', 100))
limit_request_field_size = int(os.environ.get('GUNICORN_LIMIT_REQUEST_FIELD_SIZE', 8190))

# ================================================================
# SSL (Optional - uncomment for HTTPS)
# ================================================================

# keyfile = os.environ.get('GUNICORN_KEYFILE', None)
# certfile = os.environ.get('GUNICORN_CERTFILE', None)
# ssl_version = os.environ.get('GUNICORN_SSL_VERSION', None)
# cert_reqs = os.environ.get('GUNICORN_CERT_REQS', None)
# ca_certs = os.environ.get('GUNICORN_CA_CERTS', None)
# suppress_ragged_eofs = True
# do_handshake_on_connect = False

# ================================================================
# Server Mechanics ✅ FIXED
# ================================================================

preload_app = os.environ.get('GUNICORN_PRELOAD_APP', 'False').lower() == 'true'

# ✅ FIX: Set default chdir to '/app' if not provided
chdir = os.environ.get('GUNICORN_CHDIR', '/app')

# ================================================================
# Environment Variables (JSON Version - No Database!)
# ================================================================

raw_env = [
    f"FLASK_ENV={os.environ.get('FLASK_ENV', 'production')}",
    f"FLASK_APP={os.environ.get('FLASK_APP', 'wsgi.py')}",
    f"SECRET_KEY={os.environ.get('SECRET_KEY', '')}",
    f"DATA_FOLDER={os.environ.get('DATA_FOLDER', 'app/data')}",
    f"ADMIN_USERNAME={os.environ.get('ADMIN_USERNAME', 'admin')}",
    f"MAIL_SUPPRESS_SEND={os.environ.get('MAIL_SUPPRESS_SEND', 'False')}"
]

# ================================================================
# Statistics
# ================================================================

statsd_host = os.environ.get('GUNICORN_STATSD_HOST', None)
statsd_prefix = os.environ.get('GUNICORN_STATSD_PREFIX', None)

# ================================================================
# Python Path
# ================================================================

pythonpath = os.environ.get('PYTHONPATH', None)

# ================================================================
# Print configuration on startup
# ================================================================

def on_starting(server):
    """Print startup information."""
    server.log.info("=" * 60)
    server.log.info("  BRIDGE-AI Kenya - Gunicorn Server (JSON Version)")
    server.log.info("=" * 60)
    server.log.info(f"  Workers: {workers}")
    server.log.info(f"  Worker Class: {worker_class}")
    server.log.info(f"  Bind: {bind}")
    server.log.info(f"  Log Level: {loglevel}")
    server.log.info(f"  Data Folder: {os.environ.get('DATA_FOLDER', 'app/data')}")
    server.log.info(f"  Working Directory: {chdir}")
    server.log.info("=" * 60)

def worker_int(worker):
    """Handle worker interrupt."""
    worker.log.info("Worker interrupted, exiting gracefully...")

def worker_abort(worker):
    """Handle worker abort."""
    worker.log.info("Worker aborted, exiting...")