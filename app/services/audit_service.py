# app/services/audit_service.py

import json
from datetime import datetime
import os
from flask import request, current_app


class AuditService:
    def __init__(self, log_file='logs/audit.log'):
        self.log_file = log_file
        # Create logs directory if it doesn't exist
        log_dir = os.path.dirname(log_file)
        if log_dir and not os.path.exists(log_dir):
            try:
                os.makedirs(log_dir, exist_ok=True)
            except OSError:
                pass
    
    def log_action(self, user, action, details=None):
        """Log admin action."""
        if details is None:
            details = {}
            
        log_entry = {
            'timestamp': datetime.now().isoformat(),
            'user': user or 'Unknown',
            'action': action,
            'details': details,
            'ip': request.remote_addr if request else 'Unknown',
            'user_agent': request.headers.get('User-Agent', 'Unknown') if request else 'Unknown'
        }
        
        try:
            with open(self.log_file, 'a', encoding='utf-8') as f:
                f.write(json.dumps(log_entry) + '\n')
            return True
        except Exception as e:
            print(f"Error logging audit: {e}")
            return False


# Create singleton instance
audit = AuditService()