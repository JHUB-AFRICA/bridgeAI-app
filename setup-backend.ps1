$folders = @(
    "backend",
    "backend\app",
    "backend\app\services",
    "backend\app\data"
)

foreach ($folder in $folders) {
    New-Item -ItemType Directory -Force -Path $folder | Out-Null
    Write-Host "Created: $folder" -ForegroundColor Gray
}

$sourceData = "C:\bridge_ai_kenya\app\data"
$destData = "C:\bridge-ai-angular\backend\app\data"

if (Test-Path $sourceData) {
    Get-ChildItem -Path $sourceData -Filter "*.json" | ForEach-Object {
        Copy-Item -Path $_.FullName -Destination (Join-Path $destData $_.Name) -Force
        Write-Host "Copied: $($_.Name)" -ForegroundColor Gray
    }
} else {
    $jsonFiles = @("activities.json","challenges.json","community_events.json","community_submissions.json","events.json","faqs.json","gallery.json","hackathons.json","partners.json","replication_lessons.json","replication_resources.json","replication_templates.json","repositories.json","resources.json","settings.json","sme_submissions.json","submissions.json","success_stories.json","team.json","training-materials.json","users.json")
    foreach ($file in $jsonFiles) {
        $filePath = Join-Path $destData $file
        if (-not (Test-Path $filePath)) {
            "[]" | Out-File -FilePath $filePath -Encoding utf8
            Write-Host "Created: $file" -ForegroundColor Gray
        }
    }
}

"Flask==2.3.3`nFlask-CORS==4.0.1`npython-dotenv==1.0.0" | Out-File -FilePath "backend\requirements.txt" -Encoding utf8
Write-Host "Created: backend\requirements.txt" -ForegroundColor Gray

"FLASK_APP=run.py`nFLASK_ENV=development`nFLASK_DEBUG=1`nPORT=5000" | Out-File -FilePath "backend\.env" -Encoding utf8
Write-Host "Created: backend\.env" -ForegroundColor Gray

@'
from flask import Flask
from flask_cors import CORS

def create_app():
    app = Flask(__name__)
    CORS(app)
    from .routes import api_bp
    app.register_blueprint(api_bp, url_prefix='/api')
    return app
'@ | Out-File -FilePath "backend\app\__init__.py" -Encoding utf8
Write-Host "Created: backend\app\__init__.py" -ForegroundColor Gray

@'
import json
import os

class JSONService:
    def __init__(self, data_folder='backend/app/data'):
        self.data_folder = data_folder
        os.makedirs(data_folder, exist_ok=True)

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
'@ | Out-File -FilePath "backend\app\services\json_service.py" -Encoding utf8
Write-Host "Created: backend\app\services\json_service.py" -ForegroundColor Gray

"# Services package" | Out-File -FilePath "backend\app\services\__init__.py" -Encoding utf8
Write-Host "Created: backend\app\services\__init__.py" -ForegroundColor Gray

@'
from flask import Blueprint, request, jsonify
from .services.json_service import JSONService

api_bp = Blueprint('api', __name__)
json_service = JSONService()

@api_bp.route('/admin/login', methods=['POST'])
def admin_login():
    data = request.get_json()
    username = data.get('username', '')
    password = data.get('password', '')
    users = json_service.get_all('users.json')
    for user in users:
        if user.get('username') == username and user.get('password') == password:
            return jsonify({
                'success': True,
                'user': {'id': user.get('id'), 'username': user.get('username'), 'role': user.get('role', 'admin')},
                'message': 'Login successful'
            })
    return jsonify({'success': False, 'message': 'Invalid credentials'}), 401

@api_bp.route('/activities', methods=['GET'])
def get_activities():
    return jsonify(json_service.get_all('activities.json'))

@api_bp.route('/activities/<int:id>', methods=['GET'])
def get_activity(id):
    activity = json_service.get_by_id('activities.json', id)
    return jsonify(activity) if activity else (jsonify({'error': 'Not found'}), 404)

@api_bp.route('/activities', methods=['POST'])
def create_activity():
    data = request.get_json()
    if not data.get('title'):
        return jsonify({'error': 'Title is required'}), 400
    return jsonify(json_service.create('activities.json', data)), 201

@api_bp.route('/activities/<int:id>', methods=['PUT'])
def update_activity(id):
    result = json_service.update('activities.json', id, request.get_json())
    return jsonify(result) if result else (jsonify({'error': 'Not found'}), 404)

@api_bp.route('/activities/<int:id>', methods=['DELETE'])
def delete_activity(id):
    return jsonify({'success': True}) if json_service.delete('activities.json', id) else (jsonify({'error': 'Not found'}), 404)

@api_bp.route('/events', methods=['GET'])
def get_events():
    return jsonify(json_service.get_all('events.json'))

@api_bp.route('/events/<int:id>', methods=['GET'])
def get_event(id):
    event = json_service.get_by_id('events.json', id)
    return jsonify(event) if event else (jsonify({'error': 'Not found'}), 404)

@api_bp.route('/resources', methods=['GET'])
def get_resources():
    return jsonify(json_service.get_all('resources.json'))

@api_bp.route('/partners', methods=['GET'])
def get_partners():
    return jsonify(json_service.get_all('partners.json'))

@api_bp.route('/team', methods=['GET'])
def get_team():
    return jsonify(json_service.get_all('team.json'))

@api_bp.route('/gallery', methods=['GET'])
def get_gallery():
    return jsonify(json_service.get_all('gallery.json'))

@api_bp.route('/faqs', methods=['GET'])
def get_faqs():
    return jsonify(json_service.get_all('faqs.json'))

@api_bp.route('/submissions', methods=['GET'])
def get_submissions():
    return jsonify(json_service.get_all('submissions.json'))

@api_bp.route('/training-materials', methods=['GET'])
def get_training_materials():
    return jsonify(json_service.get_all('training-materials.json'))

@api_bp.route('/challenges', methods=['GET'])
def get_challenges():
    return jsonify(json_service.get_all('challenges.json'))

@api_bp.route('/hackathons', methods=['GET'])
def get_hackathons():
    return jsonify(json_service.get_all('hackathons.json'))

@api_bp.route('/success-stories', methods=['GET'])
def get_success_stories():
    return jsonify(json_service.get_all('success_stories.json'))

@api_bp.route('/repositories', methods=['GET'])
def get_repositories():
    return jsonify(json_service.get_all('repositories.json'))

@api_bp.route('/community-events', methods=['GET'])
def get_community_events():
    return jsonify(json_service.get_all('community_events.json'))

@api_bp.route('/replication-resources', methods=['GET'])
def get_replication_resources():
    return jsonify(json_service.get_all('replication_resources.json'))

@api_bp.route('/replication-templates', methods=['GET'])
def get_replication_templates():
    return jsonify(json_service.get_all('replication_templates.json'))

@api_bp.route('/replication-lessons', methods=['GET'])
def get_replication_lessons():
    return jsonify(json_service.get_all('replication_lessons.json'))

@api_bp.route('/sme-submissions', methods=['GET'])
def get_sme_submissions():
    return jsonify(json_service.get_all('sme_submissions.json'))

@api_bp.route('/community-submissions', methods=['GET'])
def get_community_submissions():
    return jsonify(json_service.get_all('community_submissions.json'))

@api_bp.route('/settings', methods=['GET'])
def get_settings():
    return jsonify(json_service.get_all('settings.json'))
'@ | Out-File -FilePath "backend\app\routes.py" -Encoding utf8
Write-Host "Created: backend\app\routes.py" -ForegroundColor Gray

@'
from app import create_app
app = create_app()
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
'@ | Out-File -FilePath "backend\run.py" -Encoding utf8
Write-Host "Created: backend\run.py" -ForegroundColor Gray

$usersFile = "backend\app\data\users.json"
if (-not (Test-Path $usersFile)) {
    @'
[
  {"id": 1, "username": "admin", "password": "admin123", "role": "admin"}
]
'@ | Out-File -FilePath $usersFile -Encoding utf8
    Write-Host "Created: backend\app\data\users.json" -ForegroundColor Gray
}

"export const environment = { production: false, apiUrl: 'http://localhost:5000/api' };" | Out-File -FilePath "src\environments\environment.ts" -Encoding utf8 -Force
Write-Host "Updated: src\environments\environment.ts" -ForegroundColor Gray

"export const environment = { production: true, apiUrl: '/api' };" | Out-File -FilePath "src\environments\environment.prod.ts" -Encoding utf8 -Force
Write-Host "Updated: src\environments\environment.prod.ts" -ForegroundColor Gray

Write-Host ""
Write-Host "Backend setup complete." -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "  cd C:\bridge-ai-angular\backend" -ForegroundColor Cyan
Write-Host "  pip install -r requirements.txt" -ForegroundColor Cyan
Write-Host "  python run.py" -ForegroundColor Cyan
Write-Host ""
Write-Host "Then in another terminal:" -ForegroundColor Yellow
Write-Host "  cd C:\bridge-ai-angular" -ForegroundColor Cyan
Write-Host "  ng serve" -ForegroundColor Cyan
Write-Host ""
Write-Host "Login: admin / admin123" -ForegroundColor Cyan