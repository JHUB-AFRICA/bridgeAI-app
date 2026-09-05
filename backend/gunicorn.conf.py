import multiprocessing
import os

port = os.environ.get('PORT', '5000')
bind = f"0.0.0.0:{port}"

workers = int(os.environ.get('WEB_CONCURRENCY', 2))
worker_class = 'sync'
timeout = 120
graceful_timeout = 30
max_requests = 1000
max_requests_jitter = 100

accesslog = '-'
errorlog = '-'
loglevel = 'info'
preload_app = True