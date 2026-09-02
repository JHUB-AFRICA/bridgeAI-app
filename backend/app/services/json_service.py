import json
import os

class JSONService:
    def __init__(self, data_folder=None):
        self.data_folder = data_folder or os.path.join(
            os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
            'data'
        )
        os.makedirs(self.data_folder, exist_ok=True)

    def _get_file_path(self, filename):
        return os.path.join(self.data_folder, filename)

    def _read_json(self, filename):
        file_path = self._get_file_path(filename)
        if os.path.exists(file_path):
            with open(file_path, 'r', encoding='utf-8') as f:
                return json.load(f)
        return []

    def _write_json(self, filename, data):
        file_path = self._get_file_path(filename)
        with open(file_path, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)

    def get_all(self, filename):
        return self._read_json(filename)

    def get_by_id(self, filename, id):
        items = self._read_json(filename)
        for item in items:
            if item.get('id') == id:
                return item
        return None

    def create(self, filename, data):
        items = self._read_json(filename)
        max_id = max([item.get('id', 0) for item in items]) if items else 0
        data['id'] = max_id + 1
        items.append(data)
        self._write_json(filename, items)
        return data

    def update(self, filename, id, data):
        items = self._read_json(filename)
        for i, item in enumerate(items):
            if item.get('id') == id:
                data['id'] = id
                items[i] = data
                self._write_json(filename, items)
                return data
        return None

    def delete(self, filename, id):
        items = self._read_json(filename)
        for i, item in enumerate(items):
            if item.get('id') == id:
                del items[i]
                self._write_json(filename, items)
                return True
        return False
