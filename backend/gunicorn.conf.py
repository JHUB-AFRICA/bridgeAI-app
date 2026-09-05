import multiprocessing
import os

# Bind to port from environment or default
port = os.environ.get('PORT', '5000')
bind = f"0.0.0.0:{port}"

# Worker configuration
workers = int(os.environ.get('WEB_CONCURRENCY', 2))
worker_class = 'sync'
timeout = 120
graceful_timeout = 30
max_requests = 1000
max_requests_jitter = 100

# Logging
accesslog = '-'
errorlog = '-'
loglevel = 'info'

# Preload application for better performance
preload_app = True
