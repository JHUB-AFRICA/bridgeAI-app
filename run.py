#!/usr/bin/env python3
# ================================================================
# BRIDGE-AI KENYA - Development Server Runner
# ================================================================
# This script runs the Flask development server with debug mode.
# For production, use gunicorn or the production Docker setup.
# ================================================================

import os
import sys
from app import create_app

# Add the current directory to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

# Create application instance
app = create_app()

if __name__ == '__main__':
    # Get host and port from environment or use defaults
    host = os.environ.get('FLASK_HOST', '0.0.0.0')
    port = int(os.environ.get('FLASK_PORT', 5000))
    debug = os.environ.get('FLASK_DEBUG', 'True').lower() == 'true'
    
    print("=" * 60)
    print("  BRIDGE-AI Kenya - Development Server")
    print("=" * 60)
    print(f"  Environment: {os.environ.get('FLASK_ENV', 'development')}")
    print(f"  Host: {host}")
    print(f"  Port: {port}")
    print(f"  Debug: {debug}")
    print("=" * 60)
    print(f"  Access at: http://{host}:{port}")
    print("  Press CTRL+C to stop")
    print("=" * 60)
    
    app.run(
        host=host,
        port=port,
        debug=debug
    )