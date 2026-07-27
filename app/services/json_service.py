# ================================================================
# BRIDGE-AI Kenya - JSON Service
# ================================================================
# This service handles all CRUD operations on JSON files.
# No database required - uses JSON file storage.
# ================================================================

import os
import json
from datetime import datetime


class JSONService:
    """Service for reading/writing JSON data files."""
    
    def __init__(self, data_path=None):
        """
        Initialize the JSON service.
        
        Args:
            data_path: Path to the data folder. If None, uses default 'app/data'.
        """
        if data_path is None:
            # Try to get from environment or use default
            self.data_path = os.environ.get('DATA_FOLDER', 'app/data')
        else:
            self.data_path = data_path
        
        # Ensure data_path is a string
        self.data_path = str(self.data_path)
        
        # Create data directory if it doesn't exist
        if not os.path.exists(self.data_path):
            os.makedirs(self.data_path, exist_ok=True)
        
        print(f"📁 JSON Service initialized with data path: {self.data_path}")
    
    def _get_filepath(self, filename):
        """Get full file path for a JSON file."""
        return os.path.join(self.data_path, filename)
    
    def _read_file(self, filename):
        """Read JSON file and return data."""
        filepath = self._get_filepath(filename)
        if not os.path.exists(filepath):
            return [] if filename != 'settings.json' else {}
        try:
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read().strip()
                if not content:
                    return [] if filename != 'settings.json' else {}
                data = json.loads(content)
                
                # For settings.json, extract the settings dict
                if filename == 'settings.json':
                    if isinstance(data, dict) and 'settings' in data:
                        return data['settings']
                    return data if isinstance(data, dict) else {}
                
                # ✅ FIX: Convert object with numeric keys to list
                if isinstance(data, dict):
                    # Check if keys are numeric (like "1", "2", etc.)
                    keys = list(data.keys())
                    if keys and all(k.isdigit() for k in keys):
                        # Convert to list sorted by key
                        items = [data[k] for k in sorted(keys, key=lambda x: int(x))]
                        return items
                    # If it's a single object with an 'id' field, wrap in list
                    if 'id' in data:
                        return [data]
                
                return data if isinstance(data, list) else []
        except (json.JSONDecodeError, ValueError) as e:
            print(f"⚠️ Error reading {filename}: {e}")
            return [] if filename != 'settings.json' else {}
    
    def _write_file(self, filename, data):
        """Write data to JSON file."""
        filepath = self._get_filepath(filename)
        
        # ✅ FIX: Always write non-settings files as lists
        if filename != 'settings.json':
            if not isinstance(data, list):
                # If data is a dict with numeric keys, convert to list
                if isinstance(data, dict):
                    # Check if keys are numeric
                    keys = list(data.keys())
                    if keys and all(k.isdigit() for k in keys):
                        data = [data[k] for k in sorted(keys, key=lambda x: int(x))]
                    else:
                        data = [data]
                else:
                    data = []
        
        # For settings.json, wrap in 'settings' key
        if filename == 'settings.json':
            if not isinstance(data, dict):
                data = {}
            write_data = {'settings': data}
        else:
            write_data = data
        
        try:
            with open(filepath, 'w', encoding='utf-8') as f:
                json.dump(write_data, f, indent=2, ensure_ascii=False)
            return True
        except Exception as e:
            print(f"❌ Error writing to {filename}: {e}")
            return False
    
    def get_all(self, filename):
        """Get all records from a JSON file."""
        if filename == 'settings.json':
            return self._read_file(filename)
        return self._read_file(filename)
    
    def get_by_id(self, filename, id):
        """Get a record by ID."""
        data = self._read_file(filename)
        if isinstance(data, list):
            for item in data:
                if item.get('id') == id:
                    return item
        return None
    
    def create(self, filename, data):
        """Create a new record."""
        items = self._read_file(filename)
        
        # If not a list, convert to list or create new list
        if not isinstance(items, list):
            items = []
        
        # Generate new ID
        if items:
            max_id = max([item.get('id', 0) for item in items if isinstance(item, dict)])
            data['id'] = max_id + 1
        else:
            data['id'] = 1
        
        # Add timestamps
        if 'created_at' not in data:
            data['created_at'] = datetime.now().isoformat()
        if 'updated_at' not in data:
            data['updated_at'] = datetime.now().isoformat()
        
        items.append(data)
        self._write_file(filename, items)
        return data
    
    def update(self, filename, id, data):
        """Update an existing record."""
        items = self._read_file(filename)
        
        if not isinstance(items, list):
            return None
        
        for i, item in enumerate(items):
            if item.get('id') == id:
                # Preserve ID and timestamps
                data['id'] = id
                if 'created_at' not in data and 'created_at' in item:
                    data['created_at'] = item['created_at']
                data['updated_at'] = datetime.now().isoformat()
                
                # Merge with existing data
                merged = {**item, **data}
                items[i] = merged
                self._write_file(filename, items)
                return merged
        
        return None
    
    def delete(self, filename, id):
        """Delete a record."""
        items = self._read_file(filename)
        
        if not isinstance(items, list):
            return False
        
        for i, item in enumerate(items):
            if item.get('id') == id:
                del items[i]
                self._write_file(filename, items)
                return True
        
        return False
    
    def filter(self, filename, **filters):
        """Filter records by field values."""
        items = self._read_file(filename)
        
        if not isinstance(items, list):
            return []
        
        for key, value in filters.items():
            items = [item for item in items if item.get(key) == value]
        
        return items
    
    def search(self, filename, query, fields):
        """Search records by text in specified fields."""
        items = self._read_file(filename)
        
        if not isinstance(items, list):
            return []
        
        results = []
        for item in items:
            for field in fields:
                if query.lower() in str(item.get(field, '')).lower():
                    results.append(item)
                    break
        
        return results
    
    def get_settings(self):
        """Get site settings."""
        settings = self._read_file('settings.json')
        if not settings:
            return {}
        return settings
    
    def update_settings(self, data):
        """Update site settings."""
        current = self.get_settings()
        current.update(data)
        self._write_file('settings.json', current)
        return current
    
    def clear_all(self, filename):
        """Delete all records from a file."""
        if filename == 'settings.json':
            self._write_file(filename, {})
            return True
        # For all other files, write an empty list
        self._write_file(filename, [])
        return True