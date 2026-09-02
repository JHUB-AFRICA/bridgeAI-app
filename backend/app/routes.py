from flask import Blueprint, request, jsonify
from werkzeug.security import check_password_hash
from .services.json_service import JSONService

api_bp = Blueprint('api', __name__)
json_service = JSONService()

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
