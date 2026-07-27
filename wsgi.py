#!/usr/bin/env python3
# ================================================================
# BRIDGE-AI KENYA - Production WSGI Entry Point
# ================================================================
# This is the entry point for production WSGI servers like Gunicorn.
# Usage: gunicorn wsgi:app
# ================================================================

import os
import sys

# Add the current directory to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app import create_app

# Create application instance
app = create_app()

# For debugging in production
if __name__ == '__main__':
    app.run()