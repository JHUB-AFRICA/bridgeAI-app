from flask import Blueprint, request, jsonify
from werkzeug.security import check_password_hash
from .services.json_service import JSONService
from importlib import import_module
import os
import re
import cloudinary
import cloudinary.uploader
from dotenv import load_dotenv


def _get_cloudinary_service():
    load_dotenv(os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), '.env'))
    cloudinary.config(
        cloud_name=os.getenv('CLOUDINARY_CLOUD_NAME'),
        api_key=os.getenv('CLOUDINARY_API_KEY'),
        api_secret=os.getenv('CLOUDINARY_API_SECRET'),
        secure=True,
    )

    class CloudinaryService:
        def upload_image(self, file, folder):
            try:
                result = cloudinary.uploader.upload(file, folder=f'bridge-ai/{folder}', resource_type='image')
                return {
                    'success': True,
                    'url': result.get('secure_url'),
                    'public_id': result.get('public_id'),
                    'format': result.get('format'),
                    'width': result.get('width'),
                    'height': result.get('height'),
                }
            except Exception as error:
                return {'success': False, 'error': str(error)}

        def delete_image(self, public_id, resource_type='image'):
            try:
                result = cloudinary.uploader.destroy(public_id, resource_type=resource_type)
                return {'success': result.get('result') == 'ok', 'result': result.get('result')}
            except Exception as error:
                return {'success': False, 'error': str(error)}

    return CloudinaryService()

api_bp = Blueprint('api', __name__)
json_service = JSONService()
cloudinary_service = _get_cloudinary_service()


def _slugify(value):
    slug = re.sub(r'[^a-z0-9]+', '-', (value or '').lower()).strip('-')
    return slug or 'activity'


def _activity_slug(title, activities, current_id=None):
    base_slug = _slugify(title)
    slug = base_slug
    suffix = 2
    while any(item.get('slug') == slug and item.get('id') != current_id for item in activities):
        slug = f'{base_slug}-{suffix}'
        suffix += 1
    return slug

# ============================================================
# Admin Login
# ============================================================
@api_bp.route('/admin/login', methods=['POST'])
def admin_login():
    data = request.get_json(silent=True) or {}
    username = data.get('username', '')
    password = data.get('password', '')
    users = json_service.get_all('users.json')
    for user in users:
        password_hash = user.get('password_hash')
        password_matches = (
            check_password_hash(password_hash, password)
            if password_hash
            else user.get('password') == password
        )
        if user.get('username') == username and user.get('is_active', True) and password_matches:
            return jsonify({
                'success': True,
                'user': {
                    'id': user.get('id'),
                    'username': user.get('username'),
                    'display_name': user.get('display_name') or user.get('full_name'),
                    'role': user.get('role', 'admin'),
                    'is_active': user.get('is_active', True)
                },
                'message': 'Login successful'
            })
    return jsonify({'success': False, 'message': 'Invalid credentials'}), 401

# ============================================================
# Cloudinary Upload Routes
# ============================================================
@api_bp.route('/upload/<string:module>', methods=['POST'])
def upload_file(module):
    if cloudinary_service is None:
        return jsonify({'error': 'Cloudinary service is unavailable'}), 503

    allowed_modules = ['activities', 'events', 'gallery', 'team', 'resources', 'stories', 'partners']
    if module not in allowed_modules:
        return jsonify({'error': 'Invalid module'}), 400

    if 'file' not in request.files:
        return jsonify({'error': 'No file provided'}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400

    result = cloudinary_service.upload_image(file, folder=module)

    if result['success']:
        return jsonify({
            'success': True,
            'url': result['url'],
            'public_id': result['public_id'],
            'format': result['format'],
            'width': result['width'],
            'height': result['height']
        })
    else:
        return jsonify({
            'success': False,
            'error': result['error']
        }), 500

@api_bp.route('/upload/multiple/<string:module>', methods=['POST'])
def upload_multiple_files(module):
    if cloudinary_service is None:
        return jsonify({'error': 'Cloudinary service is unavailable'}), 503

    allowed_modules = ['activities', 'events', 'gallery', 'team', 'resources', 'stories', 'partners']
    if module not in allowed_modules:
        return jsonify({'error': 'Invalid module'}), 400

    if 'files' not in request.files:
        return jsonify({'error': 'No files provided'}), 400

    files = request.files.getlist('files')
    if not files:
        return jsonify({'error': 'No files selected'}), 400

    uploaded = []
    failed = []

    for file in files:
        result = cloudinary_service.upload_image(file, folder=module)
        if result['success']:
            uploaded.append({
                'url': result['url'],
                'public_id': result['public_id'],
                'filename': file.filename
            })
        else:
            failed.append({
                'filename': file.filename,
                'error': result['error']
            })

    return jsonify({
        'success': True,
        'uploaded': uploaded,
        'failed': failed,
        'total': len(files),
        'uploaded_count': len(uploaded),
        'failed_count': len(failed)
    })

@api_bp.route('/upload/delete', methods=['DELETE'])
def delete_file():
    if cloudinary_service is None:
        return jsonify({'error': 'Cloudinary service is unavailable'}), 503

    data = request.get_json()
    public_id = data.get('public_id')
    resource_type = data.get('resource_type', 'image')

    if not public_id:
        return jsonify({'error': 'public_id is required'}), 400
    if resource_type not in ['image', 'raw', 'video']:
        return jsonify({'error': 'Invalid resource type'}), 400

    result = cloudinary_service.delete_image(public_id, resource_type)
    return jsonify(result)

# ============================================================
# Activities
# ============================================================
@api_bp.route('/activities', methods=['GET'])
def get_activities():
    return jsonify(json_service.get_all('activities.json'))

@api_bp.route('/activities/<int:id>', methods=['GET'])
def get_activity(id):
    activity = json_service.get_by_id('activities.json', id)
    return jsonify(activity) if activity else (jsonify({'error': 'Not found'}), 404)

@api_bp.route('/activities/<string:slug>', methods=['GET'])
def get_activity_by_slug(slug):
    activities = json_service.get_all('activities.json')
    activity = next((item for item in activities if item.get('slug') == slug), None)
    return jsonify(activity) if activity else (jsonify({'error': 'Not found'}), 404)

@api_bp.route('/activities', methods=['POST'])
def create_activity():
    data = request.get_json() or {}
    if not data.get('title'):
        return jsonify({'error': 'Title is required'}), 400
    activities = json_service.get_all('activities.json')
    data['slug'] = _activity_slug(data.get('slug') or data.get('title'), activities)
    return jsonify(json_service.create('activities.json', data)), 201

@api_bp.route('/activities/<int:id>', methods=['PUT'])
def update_activity(id):
    data = request.get_json() or {}
    activities = json_service.get_all('activities.json')
    data['slug'] = _activity_slug(data.get('slug') or data.get('title'), activities, current_id=id)
    result = json_service.update('activities.json', id, data)
    return jsonify(result) if result else (jsonify({'error': 'Not found'}), 404)

@api_bp.route('/activities/<int:id>', methods=['DELETE'])
def delete_activity(id):
    return jsonify({'success': True}) if json_service.delete('activities.json', id) else (jsonify({'error': 'Not found'}), 404)

# ============================================================
# Events
# ============================================================
@api_bp.route('/events', methods=['GET'])
def get_events():
    return jsonify(json_service.get_all('events.json'))

@api_bp.route('/events/<int:id>', methods=['GET'])
def get_event(id):
    event = json_service.get_by_id('events.json', id)
    return jsonify(event) if event else (jsonify({'error': 'Not found'}), 404)

# ============================================================
# Resources
# ============================================================
@api_bp.route('/resources', methods=['GET'])
def get_resources():
    return jsonify(json_service.get_all('resources.json'))

# ============================================================
# Partners
# ============================================================
@api_bp.route('/partners', methods=['GET'])
def get_partners():
    return jsonify(json_service.get_all('partners.json'))

# ============================================================
# Team
# ============================================================
@api_bp.route('/team', methods=['GET'])
def get_team():
    return jsonify(json_service.get_all('team.json'))

# ============================================================
# Gallery
# ============================================================
@api_bp.route('/gallery', methods=['GET'])
def get_gallery():
    return jsonify(json_service.get_all('gallery.json'))

# ============================================================
# FAQs
# ============================================================
@api_bp.route('/faqs', methods=['GET'])
def get_faqs():
    return jsonify(json_service.get_all('faqs.json'))

# ============================================================
# Submissions
# ============================================================
@api_bp.route('/submissions', methods=['GET'])
def get_submissions():
    return jsonify(json_service.get_all('submissions.json'))

# ============================================================
# Training Materials
# ============================================================
@api_bp.route('/training-materials', methods=['GET'])
def get_training_materials():
    return jsonify(json_service.get_all('training-materials.json'))

# ============================================================
# Challenges
# ============================================================
@api_bp.route('/challenges', methods=['GET'])
def get_challenges():
    return jsonify(json_service.get_all('challenges.json'))

# ============================================================
# Hackathons
# ============================================================
@api_bp.route('/hackathons', methods=['GET'])
def get_hackathons():
    return jsonify(json_service.get_all('hackathons.json'))

# ============================================================
# Success Stories
# ============================================================
@api_bp.route('/success-stories', methods=['GET'])
def get_success_stories():
    return jsonify(json_service.get_all('success_stories.json'))

# ============================================================
# Repositories
# ============================================================
@api_bp.route('/repositories', methods=['GET'])
def get_repositories():
    return jsonify(json_service.get_all('repositories.json'))

# ============================================================
# Community Events
# ============================================================
@api_bp.route('/community-events', methods=['GET'])
def get_community_events():
    return jsonify(json_service.get_all('community_events.json'))

# ============================================================
# Replication Resources
# ============================================================
@api_bp.route('/replication-resources', methods=['GET'])
def get_replication_resources():
    return jsonify(json_service.get_all('replication_resources.json'))

# ============================================================
# Replication Templates
# ============================================================
@api_bp.route('/replication-templates', methods=['GET'])
def get_replication_templates():
    return jsonify(json_service.get_all('replication_templates.json'))

# ============================================================
# Replication Lessons
# ============================================================
@api_bp.route('/replication-lessons', methods=['GET'])
def get_replication_lessons():
    return jsonify(json_service.get_all('replication_lessons.json'))

# ============================================================
# SME Submissions
# ============================================================
@api_bp.route('/sme-submissions', methods=['GET'])
def get_sme_submissions():
    return jsonify(json_service.get_all('sme_submissions.json'))

# ============================================================
# Community Submissions
# ============================================================
@api_bp.route('/community-submissions', methods=['GET'])
def get_community_submissions():
    return jsonify(json_service.get_all('community_submissions.json'))

# ============================================================
# Settings
# ============================================================
@api_bp.route('/settings', methods=['GET'])
def get_settings():
    return jsonify(json_service.get_all('settings.json'))