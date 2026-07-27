# ================================================================
# BRIDGE-AI Kenya - Routes (JSON Version)
# ================================================================

import os
import json
import bleach  # ✅ NEW - For HTML sanitization
from datetime import datetime
from flask import (
    Blueprint, render_template, request, redirect, url_for, 
    flash, session, jsonify, current_app, abort
)
from flask_login import login_user, logout_user, login_required, current_user
from werkzeug.utils import secure_filename
from werkzeug.security import generate_password_hash, check_password_hash

from app.extensions import login_manager
from app.extensions import User
from app.extensions import limiter  # ✅ NEW - Rate limiting
from app.services.json_service import JSONService
from app.services.audit_service import audit  # ✅ NEW - Audit logging

# Initialize JSON service
json_service = JSONService()


# ================================================================
# Helper Functions
# ================================================================

def slugify(text):
    if not text:
        return ''
    import re
    text = text.lower()
    text = re.sub(r'[^a-z0-9]+', '-', text)
    text = text.strip('-')
    return text


def sanitize_html(text):
    """Sanitize HTML content to prevent XSS."""
    if not text:
        return ''
    # Bleach allows safe HTML tags and attributes
    allowed_tags = [
        'p', 'br', 'strong', 'b', 'em', 'i', 'u', 'ul', 'ol', 'li',
        'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'a', 'img', 'blockquote',
        'code', 'pre', 'span', 'div'
    ]
    allowed_attrs = {
        'a': ['href', 'title', 'target'],
        'img': ['src', 'alt', 'title'],
        '*': ['class', 'id']
    }
    return bleach.clean(text, tags=allowed_tags, attributes=allowed_attrs, strip=True)


def get_upload_path(filename, subfolder=''):
    upload_folder = current_app.config.get('UPLOAD_FOLDER', 'app/static/images/uploads')
    if subfolder:
        path = os.path.join(upload_folder, subfolder)
    else:
        path = upload_folder
    os.makedirs(path, exist_ok=True)
    return os.path.join(path, secure_filename(filename))


def safe_json_parse(value):
    if not value:
        return None
    if isinstance(value, list):
        return value
    if isinstance(value, str):
        try:
            parsed = json.loads(value)
            if isinstance(parsed, list):
                return parsed
            return [parsed]
        except:
            if ',' in value:
                return [item.strip() for item in value.split(',') if item.strip()]
            return [value] if value.strip() else None
    return None


def clean_dict(data):
    if not data:
        return data
    cleaned = {}
    for key, value in data.items():
        if value is not None and value != '':
            cleaned[key] = value
    return cleaned

# ================================================================
# Helper Functions - Add this after clean_dict()
# ================================================================

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'webp', 'svg'}

def allowed_file(filename):
    """Check if file extension is allowed."""
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def save_uploaded_file(file, subfolder='activities'):
    """
    Save uploaded file and return the saved filename.
    File is saved to: app/static/uploads/{subfolder}/
    """
    if not file or not file.filename:
        return None
    
    if not allowed_file(file.filename):
        return None
    
    # Create upload folder if it doesn't exist
    upload_folder = os.path.join(current_app.root_path, 'static', 'uploads', subfolder)
    os.makedirs(upload_folder, exist_ok=True)
    
    # Generate unique filename
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    original_name = secure_filename(file.filename)
    filename = f"{timestamp}_{original_name}"
    
    # Save file
    file_path = os.path.join(upload_folder, filename)
    file.save(file_path)
    
    return filename



# ================================================================
# Helper Function - Delete File
# ================================================================

def delete_uploaded_file(file_path):
    """
    Delete a file from the uploads folder.
    Returns True if deleted or file doesn't exist, False on error.
    """
    if not file_path:
        return True
    
    # Build full path
    full_path = os.path.join(current_app.root_path, 'static', file_path)
    
    if os.path.exists(full_path):
        try:
            os.remove(full_path)
            print(f"✅ Deleted file: {full_path}")
            return True
        except Exception as e:
            print(f"❌ Could not delete file: {e}")
            return False
    return True


# ================================================================
# Helper Function - Save Resource File (with validation)
# ================================================================

# ================================================================
# Helper Function - Save Resource File (with validation)
# ================================================================

def save_resource_file(file):
    """
    Save a resource file to the uploads/resources folder.
    Returns the saved file path or None.
    """
    if not file or not file.filename:
        print("❌ No file or filename")
        return None
    
    # ✅ Directly check resource extensions (skip allowed_file)
    allowed_resource_extensions = {
        'pdf', 'docx', 'doc', 'ppt', 'pptx', 
        'xls', 'xlsx',
        'mp4', 'mov', 'avi', 'webm',
        'zip', 'rar', '7z',
        'png', 'jpg', 'jpeg', 'gif', 'webp', 'svg',
        'txt', 'md', 'csv', 'json', 'xml'
    }
    ext = file.filename.rsplit('.', 1)[1].lower() if '.' in file.filename else ''
    
    print(f"📄 File upload: {file.filename} (extension: {ext})")
    
    if ext not in allowed_resource_extensions:
        print(f"❌ File extension not allowed: {ext}")
        return None
    
    # Create upload folder if it doesn't exist
    upload_folder = os.path.join(current_app.root_path, 'static', 'uploads', 'resources')
    os.makedirs(upload_folder, exist_ok=True)
    
    # Generate unique filename
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    original_name = secure_filename(file.filename)
    filename = f"{timestamp}_{original_name}"
    
    # Save file
    file_path = os.path.join(upload_folder, filename)
    try:
        file.save(file_path)
        print(f"✅ File saved: {file_path}")
        return f"uploads/resources/{filename}"
    except Exception as e:
        print(f"❌ Could not save file: {e}")
        return None

# ================================================================
# Helper Function - Save Partner Logo
# ================================================================

def save_partner_logo(file):
    """
    Save a partner logo to the images/partners folder.
    Returns the saved file path or None.
    """
    if not file or not file.filename:
        return None
    
    # Check if file is allowed
    if not allowed_file(file.filename):
        return None
    
    # Create upload folder if it doesn't exist
    upload_folder = os.path.join(current_app.root_path, 'static', 'images', 'partners')
    os.makedirs(upload_folder, exist_ok=True)
    
    # Generate unique filename
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    original_name = secure_filename(file.filename)
    filename = f"{timestamp}_{original_name}"
    
    # Save file
    file_path = os.path.join(upload_folder, filename)
    file.save(file_path)
    
    return f"images/partners/{filename}"


# ================================================================
# Helper Function - Delete Partner Logo
# ================================================================

def delete_partner_logo(file_path):
    """
    Delete a partner logo from the filesystem.
    Returns True if deleted or file doesn't exist, False on error.
    """
    if not file_path:
        return True
    
    full_path = os.path.join(current_app.root_path, 'static', file_path)
    
    if os.path.exists(full_path):
        try:
            os.remove(full_path)
            print(f" Deleted partner logo: {full_path}")
            return True
        except Exception as e:
            print(f" Could not delete partner logo: {e}")
            return False
    return True


# ================================================================
# Helper Function - Save Story Image
# ================================================================

def save_story_image(file):
    """
    Save a story image to the uploads/stories folder.
    Returns the saved file path or None.
    """
    if not file or not file.filename:
        return None
    
    # Check if file is allowed
    if not allowed_file(file.filename):
        return None
    
    # Create upload folder if it doesn't exist
    upload_folder = os.path.join(current_app.root_path, 'static', 'uploads', 'stories')
    os.makedirs(upload_folder, exist_ok=True)
    
    # Generate unique filename
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    original_name = secure_filename(file.filename)
    filename = f"{timestamp}_{original_name}"
    
    # Save file
    file_path = os.path.join(upload_folder, filename)
    file.save(file_path)
    
    return f"uploads/stories/{filename}"




# ================================================================
# Helper Function - Save Replication File
# ================================================================

def save_replication_file(file):
    """
    Save a replication file to the uploads/replication folder.
    Returns the saved file path or None.
    """
    if not file or not file.filename:
        return None
    
    # Check if file is allowed (documents, PDFs, presentations, images)
    allowed_extensions = {
        'pdf', 'docx', 'doc', 'ppt', 'pptx', 'xls', 'xlsx',
        'zip', 'rar', '7z',
        'png', 'jpg', 'jpeg', 'gif', 'webp', 'svg'
    }
    ext = file.filename.rsplit('.', 1)[1].lower() if '.' in file.filename else ''
    if ext not in allowed_extensions:
        return None
    
    # Create upload folder if it doesn't exist
    upload_folder = os.path.join(current_app.root_path, 'static', 'uploads', 'replication')
    os.makedirs(upload_folder, exist_ok=True)
    
    # Generate unique filename
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    original_name = secure_filename(file.filename)
    filename = f"{timestamp}_{original_name}"
    
    # Save file
    file_path = os.path.join(upload_folder, filename)
    file.save(file_path)
    
    return f"uploads/replication/{filename}"



# ================================================================
# Public Blueprint
# ================================================================

public_bp = Blueprint('public', __name__)


@public_bp.route('/')
def index():
    activities = json_service.get_all('activities.json')
    events = json_service.get_all('events.json')
    settings = json_service.get_settings()
    
    published_activities = [a for a in activities if a.get('evidence_status') == 'published']
    latest_activities = sorted(published_activities, key=lambda x: x.get('date', ''), reverse=True)[:3]
    upcoming_events = [e for e in events if e.get('status') == 'upcoming'][:3]
    
    return render_template(
        'index.html',
        activities=latest_activities,
        events=upcoming_events,
        settings=settings
    )


@public_bp.route('/about/')
def about():
    return render_template('about.html')


@public_bp.route('/jkuat-role/')
def jkuat_role():
    team = json_service.get_all('team.json')
    visible_team = [t for t in team if t.get('is_visible') and t.get('consent_status') == 'approved']
    sorted_team = sorted(visible_team, key=lambda x: x.get('display_order', 0))
    return render_template('jkuat_role.html', team_members=sorted_team)


@public_bp.route('/smart-mushrooms/')
def smart_mushrooms():
    faqs = json_service.get_all('faqs.json')
    published_faqs = [f for f in faqs if f.get('is_published')]
    sorted_faqs = sorted(published_faqs, key=lambda x: x.get('display_order', 0))
    
    # ✅ Get activities for hero and pilot images
    activities = json_service.get_all('activities.json')
    published_activities = [a for a in activities if a.get('evidence_status') == 'published']
    sorted_activities = sorted(published_activities, key=lambda x: x.get('date', ''), reverse=True)
    
    # ✅ Get albums for gallery
    albums = json_service.get_all('gallery.json')
    published_albums = [a for a in albums if a.get('is_published')]
    sorted_albums = sorted(published_albums, key=lambda x: x.get('date', ''), reverse=True)
    
    return render_template(
        'smart_mushrooms.html',
        faqs=sorted_faqs,
        activities=sorted_activities,
        albums=sorted_albums
    )


@public_bp.route('/activities/')
def activities():
    all_activities = json_service.get_all('activities.json')
    published = [a for a in all_activities if a.get('evidence_status') == 'published']
    
    # Get filter parameters
    wp_filter = request.args.get('wp', '')
    audience_filter = request.args.get('audience', '')
    type_filter = request.args.get('type', '')
    year_filter = request.args.get('year', '')
    
    # Apply filters
    if wp_filter:
        published = [a for a in published if a.get('wp_tag') == wp_filter]
    if audience_filter:
        published = [a for a in published if audience_filter.lower() in a.get('audience', '').lower()]
    if type_filter:
        published = [a for a in published if a.get('activity_type') == type_filter]
    if year_filter:
        published = [a for a in published if year_filter in a.get('date', '')]
    
    # Sort by date (newest first)
    published = sorted(published, key=lambda x: x.get('date', ''), reverse=True)
    
    # Generate filter options from the filtered data
    wp_options = list(set([a.get('wp_tag') for a in published if a.get('wp_tag')]))
    audience_options = list(set([a.get('audience') for a in published if a.get('audience')]))
    type_options = list(set([a.get('activity_type') for a in published if a.get('activity_type')]))
    year_options = list(set([a.get('date', '')[:4] for a in published if a.get('date')]))
    
    # Sort options alphabetically
    wp_options.sort()
    audience_options.sort()
    type_options.sort()
    year_options.sort(reverse=True)
    
    # Calculate activity type counts for the hero section
    activity_type_counts = {}
    for activity in published:
        activity_type = activity.get('activity_type')
        if activity_type:
            activity_type_counts[activity_type] = activity_type_counts.get(activity_type, 0) + 1
    
    # Sort by count (highest first)
    activity_type_counts = dict(sorted(activity_type_counts.items(), key=lambda x: x[1], reverse=True))
    
    return render_template(
        'activities.html',
        activities=published,
        wp_options=wp_options,
        audience_options=audience_options,
        type_options=type_options,
        year_options=year_options,
        current_wp=wp_filter,
        current_audience=audience_filter,
        current_type=type_filter,
        current_year=year_filter,
        activity_type_counts=activity_type_counts
    )


# ================================================================
# Public Routes - Filtered Activities (AJAX)
# ================================================================

@public_bp.route('/api/activities/filtered/')
def api_filtered_activities():
    """Return filtered activities as JSON for AJAX requests."""
    all_activities = json_service.get_all('activities.json')
    published = [a for a in all_activities if a.get('evidence_status') == 'published']
    
    # Get filter parameters
    wp_filter = request.args.get('wp', '')
    audience_filter = request.args.get('audience', '')
    type_filter = request.args.get('type', '')
    year_filter = request.args.get('year', '')
    
    # Apply filters
    if wp_filter:
        published = [a for a in published if a.get('wp_tag') == wp_filter]
    if audience_filter:
        published = [a for a in published if audience_filter.lower() in a.get('audience', '').lower()]
    if type_filter:
        published = [a for a in published if a.get('activity_type') == type_filter]
    if year_filter:
        published = [a for a in published if year_filter in a.get('date', '')]
    
    # Sort by date (newest first)
    published = sorted(published, key=lambda x: x.get('date', ''), reverse=True)
    
    return jsonify(published)




@public_bp.route('/activities/<slug>/')
def activity_detail(slug):
    activities = json_service.get_all('activities.json')
    activity = None
    for a in activities:
        if a.get('slug') == slug and a.get('evidence_status') == 'published':
            activity = a
            break
    if not activity:
        abort(404)
    return render_template('activity_detail.html', activity=activity)


@public_bp.route('/training-and-wp5/')
def training_wp5():
    events = json_service.get_all('events.json')
    sorted_events = sorted(events, key=lambda x: x.get('date', ''))
    return render_template('training_wp5.html', events=sorted_events)


# ================================================================
# Public Routes - Training Events (List & Detail)
# ================================================================

@public_bp.route('/training-and-wp5/events/')
def training_events():
    """List all training events."""
    import os
    events = json_service.get_all('events.json')
    sorted_events = sorted(events, key=lambda x: x.get('date', ''))
    
    # Get hero image from events uploads folder
    hero_image = None
    uploads_folder = os.path.join(current_app.root_path, 'static', 'uploads', 'events')
    if os.path.exists(uploads_folder):
        images = [f for f in os.listdir(uploads_folder) if f.lower().endswith(('.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg'))]
        if images:
            hero_image = images[0]  # Pick the first image
    
    return render_template('training_events.html', events=sorted_events, hero_image=hero_image)


@public_bp.route('/training-and-wp5/events/<slug>/')
def event_detail(slug):
    """Dynamic event detail page for training events."""
    events = json_service.get_all('events.json')
    event = None
    for e in events:
        if e.get('slug') == slug:
            event = e
            break
    if not event:
        abort(404)
    return render_template('event_detail.html', event=event)
# ================================================================
# Public Routes - Training Materials
# ================================================================

@public_bp.route('/training-and-wp5/training-materials/')
def training_materials():
    """Training materials page with modules, videos, guides, and repositories."""
    materials = json_service.get_all('training-materials.json')
    
    # Sort modules by id
    sorted_materials = sorted(materials, key=lambda x: x.get('id', 0))
    
    # Get unique levels for filter
    levels = list(set([m.get('level', '') for m in sorted_materials if m.get('level')]))
    levels.sort()
    
    # Get unique tags for filter
    all_tags = []
    for m in sorted_materials:
        if m.get('tags'):
            all_tags.extend(m.get('tags', []))
    tags = list(set(all_tags))
    tags.sort()
    
    return render_template(
        'training_materials.html',
        materials=sorted_materials,
        levels=levels,
        tags=tags
    )



# ================================================================
# Public Routes - Training Materials Detail
# ================================================================

@public_bp.route('/training-and-wp5/training-materials/<slug>/')
def material_detail(slug):
    materials = json_service.get_all('training-materials.json')
    material = None
    for m in materials:
        if m.get('slug') == slug:
            material = m
            break
    
    if not material:
        abort(404)
    
    # Get file extension and icon class
    if material.get('file_path'):
        ext = material['file_path'].split('.')[-1].lower()
        material['file_extension'] = ext.upper()
        # Map extension to icon class
        icon_map = {
            'pdf': 'pdf', 'docx': 'docx', 'doc': 'docx',
            'ppt': 'pptx', 'pptx': 'pptx',
            'mp4': 'mp4', 'mov': 'mp4', 'avi': 'mp4',
            'zip': 'zip', 'rar': 'zip',
            'png': 'image', 'jpg': 'image', 'jpeg': 'image',
            'gif': 'image', 'webp': 'image', 'svg': 'image'
        }
        material['file_icon_class'] = icon_map.get(ext, 'other')
    else:
        material['file_extension'] = 'FILE'
        material['file_icon_class'] = 'other'
    
    # Get related materials (same tags)
    related_materials = []
    if material.get('tags'):
        material_tags = material['tags']
        for m in materials:
            if m.get('id') != material.get('id') and m.get('is_public') != False:
                m_tags = m.get('tags', [])
                if any(tag in m_tags for tag in material_tags):
                    # Add file info to related
                    if m.get('file_path'):
                        ext = m['file_path'].split('.')[-1].lower()
                        m['file_extension'] = ext.upper()
                        icon_map = {
                            'pdf': 'pdf', 'docx': 'docx', 'doc': 'docx',
                            'ppt': 'pptx', 'pptx': 'pptx',
                            'mp4': 'mp4', 'mov': 'mp4', 'avi': 'mp4',
                            'zip': 'zip', 'rar': 'zip',
                            'png': 'image', 'jpg': 'image', 'jpeg': 'image',
                            'gif': 'image', 'webp': 'image', 'svg': 'image'
                        }
                        m['file_icon_class'] = icon_map.get(ext, 'other')
                    else:
                        m['file_extension'] = 'FILE'
                        m['file_icon_class'] = 'other'
                    related_materials.append(m)
        
        # Limit to 3 related materials
        related_materials = related_materials[:3]
    
    return render_template('material_detail.html', material=material, related_materials=related_materials)


# ================================================================
# Public Routes - SME Mentoring
# ================================================================

@public_bp.route('/training-and-wp5/sme-mentoring/', methods=['GET', 'POST'])
def sme_mentoring():
    """SME Mentoring page with challenges, hackathons, success stories, and interest form."""
    
    # ============================================================
    # HANDLE POST REQUEST - Form Submission
    # ============================================================
    if request.method == 'POST':
        # Get form data
        name = request.form.get('name', '').strip()
        email = request.form.get('email', '').strip()
        organisation = request.form.get('organisation', '').strip()
        industry = request.form.get('industry', '').strip()
        interest = request.form.get('interest', '').strip()
        message = request.form.get('message', '').strip()
        
        # Check if AJAX request
        is_ajax = request.headers.get('X-Requested-With') == 'XMLHttpRequest'
        
        # Validate required fields
        if not name or not email or not organisation or not industry or not interest:
            if is_ajax:
                return jsonify({'success': False, 'message': 'Please fill in all required fields.'})
            flash('Please fill in all required fields.', 'error')
            return redirect(url_for('public.sme_mentoring'))
        
        # Sanitize inputs
        name = sanitize_html(name)
        email = sanitize_html(email)
        organisation = sanitize_html(organisation)
        industry = sanitize_html(industry)
        interest = sanitize_html(interest)
        if message:
            message = sanitize_html(message)
        
        # Create submission data
        submission = {
            'name': name,
            'email': email,
            'organisation': organisation,
            'industry': industry,
            'interest': interest,
            'message': message,
            'is_read': False,
            'submitted_at': datetime.now().isoformat()
        }
        
        # Save to JSON
        result = json_service.create('sme_submissions.json', submission)
        
        if result:
            if is_ajax:
                return jsonify({
                    'success': True,
                    'message': 'Your application has been submitted successfully! We will contact you soon.'
                })
            flash('Your application has been submitted successfully! We will contact you soon.', 'success')
        else:
            if is_ajax:
                return jsonify({
                    'success': False,
                    'message': 'There was an error submitting your application. Please try again.'
                })
            flash('There was an error submitting your application. Please try again.', 'error')
        
        # Only redirect for non-AJAX requests
        if not is_ajax:
            return redirect(url_for('public.sme_mentoring'))
        
        # Fallback for AJAX (should never reach here)
        return jsonify({'success': True, 'message': 'Submission received'})
    
    # ============================================================
    # HANDLE GET REQUEST - Display Page
    # ============================================================
    challenges = json_service.get_all('challenges.json')
    hackathons = json_service.get_all('hackathons.json')
    stories = json_service.get_all('success_stories.json')
    
    # Filter open challenges
    open_challenges = [c for c in challenges if c.get('status') == 'open']
    
    return render_template(
        'sme_mentoring.html',
        challenges=open_challenges,
        hackathons=hackathons,
        stories=stories
    )



# ================================================================
# Public Routes - Community of Practice
# ================================================================

@public_bp.route('/training-and-wp5/community-of-practice/')
def community_of_practice():
    """Community of Practice page with repositories, events, and join form."""
    from flask_wtf.csrf import generate_csrf
    repositories = json_service.get_all('repositories.json')
    events = json_service.get_all('community_events.json')
    return render_template(
        'community_of_practice.html',
        repositories=repositories,
        events=events,
        csrf_token=generate_csrf()  # ✅ Generates a fresh CSRF token
    )


# ================================================================
# Public Routes - Replication Toolkit
# ================================================================

@public_bp.route('/training-and-wp5/replication-toolkit/')
def replication_toolkit():
    """Replication Toolkit page with resources, templates, and lessons."""
    resources = json_service.get_all('replication_resources.json')
    templates = json_service.get_all('replication_templates.json')
    lessons = json_service.get_all('replication_lessons.json')
    return render_template(
        'replication_toolkit.html',
        resources=resources,
        templates=templates,
        lessons=lessons
    )




@public_bp.route('/resources/')
def resources():
    all_resources = json_service.get_all('resources.json')
    public_resources = [r for r in all_resources if r.get('is_public')]
    sorted_resources = sorted(public_resources, key=lambda x: x.get('created_at', ''), reverse=True)
    return render_template('resources.html', resources=sorted_resources)


@public_bp.route('/resources/<slug>/')
def resource_detail(slug):
    resources = json_service.get_all('resources.json')
    resource = None
    for r in resources:
        if r.get('slug') == slug and r.get('is_public'):
            resource = r
            break
    if not resource:
        abort(404)
    resource['download_count'] = resource.get('download_count', 0) + 1
    json_service.update('resources.json', resource['id'], resource)
    return render_template('resource_detail.html', resource=resource)


@public_bp.route('/partners/')
def partners():
    """Display all published partners (both consortium and local)."""
    all_partners = json_service.get_all('partners.json')
    # ✅ Show ALL published partners (both consortium and local)
    published_partners = [p for p in all_partners if p.get('is_published', True)]
    sorted_partners = sorted(published_partners, key=lambda x: x.get('display_order', 0))
    return render_template('partners.html', partners=sorted_partners)


@public_bp.route('/gallery/')
def gallery():
    all_albums = json_service.get_all('gallery.json')
    published_albums = [a for a in all_albums if a.get('is_published')]
    sorted_albums = sorted(published_albums, key=lambda x: x.get('date', ''), reverse=True)
    return render_template('gallery.html', albums=sorted_albums)

@public_bp.route('/gallery/data/')
def gallery_data():
    all_albums = json_service.get_all('gallery.json')
    published_albums = [a for a in all_albums if a.get('is_published')]
    sorted_albums = sorted(published_albums, key=lambda x: x.get('date', ''), reverse=True)
    return jsonify(sorted_albums)

@public_bp.route('/gallery/<slug>/')
def gallery_album(slug):
    all_albums = json_service.get_all('gallery.json')
    album = None
    for a in all_albums:
        if a.get('slug') == slug and a.get('is_published'):
            album = a
            break
    if not album:
        abort(404)
    images = album.get('images', [])
    approved_images = [i for i in images if i.get('is_approved')]
    sorted_images = sorted(approved_images, key=lambda x: x.get('display_order', 0))
    return render_template('gallery_album.html', album=album, images=sorted_images)


@public_bp.route('/contact/', methods=['GET', 'POST'])
def contact():
    """Contact page with dynamic forms for different inquiry types."""
    from app.forms import ContactForm, TrainingInterestForm, MediaRequestForm
    
    # ================================================================
    # HANDLE POST REQUEST
    # ================================================================
    if request.method == 'POST':
        form_type = request.form.get('form_type', 'contact')
        
        # ────────────────────────────────────────────────────────────
        # 1. GENERAL ENQUIRY
        # ────────────────────────────────────────────────────────────
        if form_type == 'contact':
            form = ContactForm()
            
            # ============================================================
            # ✅ DEBUG - General Enquiry
            # ============================================================
            print("=" * 60)
            print("GENERAL ENQUIRY FORM SUBMISSION DEBUG")
            print("=" * 60)
            print("Form data received:")
            for key, value in request.form.items():
                print(f"  {key}: {repr(value)}")
            print("-" * 60)
            print("Form validation result:", form.validate_on_submit())
            print("Form errors:", form.errors)
            print("=" * 60)
            
            if form.validate_on_submit():
                name = request.form.get('name', '').strip()
                email = request.form.get('email', '').strip()
                organisation = request.form.get('organisation', '').strip()
                audience = request.form.get('audience', 'general')
                message = request.form.get('message', '').strip()
                
                submission = {
                    'form_type': 'contact',
                    'data': {
                        'name': name,
                        'email': email,
                        'organisation': organisation,
                        'audience': audience,
                        'message': message
                    },
                    'ip_address': request.remote_addr,
                    'user_agent': request.headers.get('User-Agent', ''),
                    'is_read': False,
                    'is_responded': False,
                    'submitted_at': datetime.now().isoformat()
                }
                json_service.create('submissions.json', submission)
                flash('Your message has been sent successfully. We will respond shortly.', 'success')
                return redirect(url_for('public.contact'))
            else:
                flash('Please fill in all required fields correctly.', 'error')
                return render_template('contact.html', contact_form=form, training_form=TrainingInterestForm(), media_form=MediaRequestForm())
        
        # ────────────────────────────────────────────────────────────
        # 2. TRAINING INTEREST
        # ────────────────────────────────────────────────────────────
        elif form_type == 'training':
            form = TrainingInterestForm()
            
            # ============================================================
            # ✅ DEBUG - Training Interest
            # ============================================================
            print("=" * 60)
            print("TRAINING INTEREST FORM SUBMISSION DEBUG")
            print("=" * 60)
            print("Form data received:")
            for key, value in request.form.items():
                print(f"  {key}: {repr(value)}")
            print("-" * 60)
            print("Form validation result:", form.validate_on_submit())
            print("Form errors:", form.errors)
            print("=" * 60)
            
            if form.validate_on_submit():
                name = request.form.get('name', '').strip()
                email = request.form.get('email', '').strip()
                phone = request.form.get('phone', '').strip()
                county = request.form.get('county', '').strip()
                audience = request.form.get('audience', '').strip()
                training_interest = request.form.get('training_interest', '').strip()
                message = request.form.get('message', '').strip()
                
                submission = {
                    'form_type': 'training',
                    'data': {
                        'name': name,
                        'email': email,
                        'phone': phone,
                        'county': county,
                        'audience': audience,
                        'training_interest': training_interest,
                        'message': message
                    },
                    'ip_address': request.remote_addr,
                    'user_agent': request.headers.get('User-Agent', ''),
                    'is_read': False,
                    'is_responded': False,
                    'submitted_at': datetime.now().isoformat()
                }
                json_service.create('submissions.json', submission)
                flash('Your training interest has been registered. We will contact you about upcoming opportunities.', 'success')
                return redirect(url_for('public.contact'))
            else:
                flash('Please fill in all required fields correctly.', 'error')
                return render_template('contact.html', contact_form=ContactForm(), training_form=form, media_form=MediaRequestForm())
        
        # ────────────────────────────────────────────────────────────
        # 3. MEDIA REQUEST
        # ────────────────────────────────────────────────────────────
        elif form_type == 'media':
            form = MediaRequestForm()
            
            # ============================================================
            # ✅ DEBUG - Media Request
            # ============================================================
            print("=" * 60)
            print("MEDIA REQUEST FORM SUBMISSION DEBUG")
            print("=" * 60)
            print("Form data received:")
            for key, value in request.form.items():
                print(f"  {key}: {repr(value)}")
            print("-" * 60)
            print("Form validation result:", form.validate_on_submit())
            print("Form errors:", form.errors)
            print("=" * 60)
            
            if form.validate_on_submit():
                name = request.form.get('name', '').strip()
                email = request.form.get('email', '').strip()
                outlet = request.form.get('outlet', '').strip()
                request_type = request.form.get('request_type', '').strip()
                deadline = request.form.get('deadline', '').strip()
                audience = request.form.get('audience', 'media')
                message = request.form.get('message', '').strip()
                
                submission = {
                    'form_type': 'media',
                    'data': {
                        'name': name,
                        'email': email,
                        'outlet': outlet,
                        'request_type': request_type,
                        'deadline': deadline,
                        'audience': audience,
                        'message': message
                    },
                    'ip_address': request.remote_addr,
                    'user_agent': request.headers.get('User-Agent', ''),
                    'is_read': False,
                    'is_responded': False,
                    'submitted_at': datetime.now().isoformat()
                }
                json_service.create('submissions.json', submission)
                flash('Your media request has been submitted. Our team will contact you shortly.', 'success')
                return redirect(url_for('public.contact'))
            else:
                flash('Please fill in all required fields correctly.', 'error')
                return render_template('contact.html', contact_form=ContactForm(), training_form=TrainingInterestForm(), media_form=form)
        
        # ────────────────────────────────────────────────────────────
        # 4. SME AND PARTNERS
        # ────────────────────────────────────────────────────────────
        elif form_type == 'sme':
            
            # ============================================================
            # ✅ DEBUG - SME Form
            # ============================================================
            print("=" * 60)
            print("SME FORM SUBMISSION DEBUG")
            print("=" * 60)
            print("Form data received:")
            for key, value in request.form.items():
                print(f"  {key}: {repr(value)}")
            print("=" * 60)
            
            name = request.form.get('name', '').strip()
            email = request.form.get('email', '').strip()
            organisation = request.form.get('organisation', '').strip()
            industry = request.form.get('industry', '').strip()
            interest = request.form.get('interest', '').strip()
            audience = request.form.get('audience', 'sme')
            message = request.form.get('message', '').strip()
            
            # Validate required fields
            if not name or not email or not organisation or not message:
                flash('Please fill in all required fields.', 'error')
            else:
                submission = {
                    'form_type': 'sme',
                    'data': {
                        'name': name,
                        'email': email,
                        'organisation': organisation,
                        'industry': industry,
                        'interest': interest,
                        'audience': audience,
                        'message': message
                    },
                    'ip_address': request.remote_addr,
                    'user_agent': request.headers.get('User-Agent', ''),
                    'is_read': False,
                    'is_responded': False,
                    'submitted_at': datetime.now().isoformat()
                }
                json_service.create('submissions.json', submission)
                flash('Your application has been submitted successfully! We will contact you soon.', 'success')
                return redirect(url_for('public.contact'))
            
            return render_template('contact.html', contact_form=ContactForm(), training_form=TrainingInterestForm(), media_form=MediaRequestForm())
        
        # ────────────────────────────────────────────────────────────
        # 5. UNKNOWN FORM TYPE - Fallback
        # ────────────────────────────────────────────────────────────
        else:
            flash('Invalid form submission. Please try again.', 'error')
            return redirect(url_for('public.contact'))
    
    # ================================================================
    # HANDLE GET REQUEST - Display Page
    # ================================================================
    contact_form = ContactForm()
    training_form = TrainingInterestForm()
    media_form = MediaRequestForm()
    
    return render_template(
        'contact.html',
        contact_form=contact_form,
        training_form=training_form,
        media_form=media_form
    )
@public_bp.route('/privacy-and-ethics/')
def privacy_ethics():
    return render_template('privacy_ethics.html')


# ================================================================
# Admin Blueprint
# ================================================================

admin_bp = Blueprint('admin', __name__, url_prefix='/admin')


@admin_bp.route('/login/', methods=['GET', 'POST'])
@limiter.limit("5 per minute")  # ✅ Rate limiting - 5 login attempts per minute
def admin_login():
    if current_user.is_authenticated:
        next_page = request.args.get('next')
        if next_page:
            return redirect(next_page)
        return redirect(url_for('admin.admin_dashboard'))
    
    if request.method == 'POST':
        username = request.form.get('username', '').strip()
        password = request.form.get('password', '')
        remember = request.form.get('remember', False)
        
        users = json_service.get_all('users.json')
        user = None
        for u in users:
            if u.get('username') == username:
                user = u
                break
        
        if user and check_password_hash(user.get('password_hash', ''), password):
            user_obj = User(user)
            login_user(user_obj, remember=True)
            session.permanent = True
            
            user['last_login'] = datetime.now().isoformat()
            json_service.update('users.json', user['id'], user)
            
            # ✅ Audit log
            audit.log_action(
                user=username,
                action='LOGIN_SUCCESS',
                details={'ip': request.remote_addr}
            )
            
            flash('Welcome back!', 'success')
            
            next_page = request.args.get('next')
            if next_page:
                return redirect(next_page)
            return redirect(url_for('admin.admin_dashboard'))
        else:
            # ✅ Audit log for failed login
            audit.log_action(
                user=username,
                action='LOGIN_FAILED',
                details={'ip': request.remote_addr}
            )
            flash('Invalid username or password.', 'danger')
    
    return render_template('admin/login.html')


@admin_bp.route('/logout/', methods=['GET', 'POST'])  # ✅ Added POST
@login_required
def admin_logout():
    # ✅ Audit log
    audit.log_action(
        user=current_user.username,
        action='LOGOUT',
        details={'ip': request.remote_addr}
    )
    logout_user()
    flash('You have been logged out.', 'info')
    return redirect(url_for('admin.admin_login'))


@admin_bp.route('/')
@login_required
def admin_dashboard():
    stats = {
        'activities': len(json_service.get_all('activities.json')),
        'published_activities': len([a for a in json_service.get_all('activities.json') if a.get('evidence_status') == 'published']),
        'events': len(json_service.get_all('events.json')),
        'upcoming_events': len([e for e in json_service.get_all('events.json') if e.get('status') == 'upcoming']),
        'resources': len(json_service.get_all('resources.json')),
        'partners': len(json_service.get_all('partners.json')),
        'team': len(json_service.get_all('team.json')),
        'albums': len(json_service.get_all('gallery.json')),
        'gallery_images': sum([len(a.get('images', [])) for a in json_service.get_all('gallery.json')]),
        'faqs': len(json_service.get_all('faqs.json')),
        'submissions': len(json_service.get_all('submissions.json')),
        'unread_submissions': len([s for s in json_service.get_all('submissions.json') if not s.get('is_read')]),
        
        'training_materials': len(json_service.get_all('training-materials.json')),
        'challenges': len(json_service.get_all('challenges.json')),
        'hackathons': len(json_service.get_all('hackathons.json')),
        'stories': len(json_service.get_all('success_stories.json')),
        'sme_submissions': len(json_service.get_all('sme_submissions.json')),
        'repositories': len(json_service.get_all('repositories.json')),
        'community_events': len(json_service.get_all('community_events.json')),
        'community_submissions': len(json_service.get_all('community_submissions.json')),
        'replication_resources': len(json_service.get_all('replication_resources.json')),
        'replication_templates': len(json_service.get_all('replication_templates.json')),
        'replication_lessons': len(json_service.get_all('replication_lessons.json')),



    }
    return render_template('admin/dashboard.html', stats=stats)


@admin_bp.route('/activities/')
@login_required
def admin_activities():
    return render_template('admin/activities.html')


@admin_bp.route('/events/')
@login_required
def admin_events():
    return render_template('admin/events.html')


@admin_bp.route('/resources/')
@login_required
def admin_resources():
    return render_template('admin/resources.html')


@admin_bp.route('/partners/')
@login_required
def admin_partners():
    return render_template('admin/partners.html')


@admin_bp.route('/team/')
@login_required
def admin_team():
    return render_template('admin/team.html')


@admin_bp.route('/gallery/')
@login_required
def admin_gallery():
    return render_template('admin/gallery.html')


@admin_bp.route('/faqs/')
@login_required
def admin_faqs():
    return render_template('admin/faqs.html')


@admin_bp.route('/training-materials/')
@login_required
def admin_training_materials():
    return render_template('admin/training_materials.html')



@admin_bp.route('/sme/')
@login_required
def admin_sme():
    """Admin page for SME management: challenges, hackathons, stories, submissions."""
    return render_template('admin/sme.html')



@admin_bp.route('/community/')
@login_required
def admin_community():
    """Admin page for Community management: repositories, events, submissions."""
    return render_template('admin/community.html')



@admin_bp.route('/replication/')
@login_required
def admin_replication():
    """Admin page for Replication Toolkit management."""
    return render_template('admin/replication.html')




@admin_bp.route('/submissions/')
@login_required
def admin_submissions():
    return render_template('admin/submissions.html')


@admin_bp.route('/test-session/')
@login_required
def admin_test_session():
    return jsonify({
        'is_authenticated': current_user.is_authenticated,
        'user_id': current_user.get_id() if current_user.is_authenticated else None,
        'username': current_user.username if current_user.is_authenticated else None,
        'session_keys': list(session.keys()),
        'session_data': {k: str(v) for k, v in session.items()},
        'session_permanent': session.permanent
    })


# ================================================================
# API Blueprint
# ================================================================

api_bp = Blueprint('api', __name__, url_prefix='/api')


def api_login_required():
    if not current_user.is_authenticated:
        return jsonify({'error': 'Unauthorized'}), 401
    return None


# ================================================================
# API - Hero Images
# ================================================================

@api_bp.route('/hero-images/', methods=['GET'])
def api_get_hero_images():
    hero_folder = os.path.join(current_app.root_path, 'static', 'images', 'hero')
    images = []
    if os.path.exists(hero_folder):
        for file in os.listdir(hero_folder):
            if file.lower().endswith(('.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg')):
                images.append(file)
    images.sort()
    return jsonify({'images': images})




# ================================================================
# API - Activity Images (for hero slideshow)
# ================================================================

@api_bp.route('/activities/images/', methods=['GET'])
def api_get_activity_images():
    """
    Get list of images from the activities uploads folder.
    Used for the hero slideshow background.
    """
    try:
        upload_folder = os.path.join(current_app.root_path, 'static', 'uploads', 'activities')
        images = []
        
        if os.path.exists(upload_folder):
            for file in os.listdir(upload_folder):
                # Check if file is an image
                if file.lower().endswith(('.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg')):
                    images.append(file)
            
            # Sort by creation time (newest first)
            if images:
                images.sort(
                    key=lambda x: os.path.getmtime(os.path.join(upload_folder, x)),
                    reverse=True
                )
        
        # Limit to 10 images maximum for performance
        return jsonify({'images': images[:10]})
    except Exception as e:
        print(f"❌ Error getting activity images: {e}")
        return jsonify({'images': []})

# ================================================================
# API - Activities (FormData + Image Upload Support)
# ================================================================

@api_bp.route('/activities/', methods=['GET'])
# ✅ REMOVED auth check - Public pages need this!
def api_get_activities():
    try:
        activities = json_service.get_all('activities.json')
        return jsonify(activities)
    except Exception as e:
        print(f"❌ Error getting activities: {e}")
        return jsonify([])




@api_bp.route('/activities/', methods=['POST'])
@limiter.limit("30 per minute")
@login_required
def api_create_activity():
    try:
        # ============================================================
        # CHECK IF REQUEST IS FORM DATA (with image) OR JSON
        # ============================================================
        is_form_data = request.content_type and 'multipart/form-data' in request.content_type
        
        if is_form_data:
            # ============================================================
            # ✅ HANDLE FORM DATA WITH IMAGE UPLOAD
            # ============================================================
            
            # Get fields from request.form
            title = request.form.get('title', '').strip()
            body = request.form.get('body', '').strip()
            slug = request.form.get('slug', '').strip()
            summary = request.form.get('summary', '').strip()
            date = request.form.get('date', '').strip()
            location = request.form.get('location', '').strip()
            wp_tag = request.form.get('wp_tag', '').strip()
            activity_type = request.form.get('activity_type', '').strip()
            audience = request.form.get('audience', '').strip()
            author = request.form.get('author', '').strip()
            evidence_status = request.form.get('evidence_status', 'draft').strip()
            
            # Validate required fields
            if not title:
                return jsonify({'success': False, 'error': 'Title is required'}), 400
            if not body:
                return jsonify({'success': False, 'error': 'Body is required'}), 400
            
            # Sanitize inputs
            title = sanitize_html(title)
            body = sanitize_html(body)
            if summary:
                summary = sanitize_html(summary)
            if location:
                location = sanitize_html(location)
            if author:
                author = sanitize_html(author)
            
            # Auto-generate slug if not provided
            if not slug:
                slug = slugify(title)
                if not slug:
                    slug = f"activity-{int(datetime.now().timestamp())}"
            
            # Set date if not provided
            if not date:
                date = datetime.now().strftime('%Y-%m-%d')
            
            # ============================================================
            # ✅ HANDLE FEATURED IMAGE UPLOAD (Single)
            # ============================================================
            featured_image = None
            if 'featured_image' in request.files:
                file = request.files['featured_image']
                if file and file.filename:
                    filename = save_uploaded_file(file, 'activities')
                    if filename:
                        featured_image = f"uploads/activities/{filename}"
            
            # ============================================================
            # ✅ HANDLE MULTIPLE GALLERY IMAGES UPLOAD
            # ============================================================
            gallery_images = []
            if 'gallery_images' in request.files:
                files = request.files.getlist('gallery_images')
                for idx, file in enumerate(files):
                    if file and file.filename:
                        filename = save_uploaded_file(file, 'activities')
                        if filename:
                            caption_key = f'gallery_caption_{idx}'
                            caption = request.form.get(caption_key, '').strip()
                            gallery_images.append({
                                'id': idx + 1,
                                'image_path': f"uploads/activities/{filename}",
                                'caption': sanitize_html(caption) if caption else '',
                                'display_order': idx
                            })
            
            # Build activity data
            activity_data = {
                'title': title,
                'slug': slug,
                'body': body,
                'date': date,
                'created_at': datetime.now().isoformat(),
                'updated_at': datetime.now().isoformat(),
                'evidence_status': evidence_status
            }
            
            # Add optional fields if they have values
            if summary:
                activity_data['summary'] = summary
            if location:
                activity_data['location'] = location
            if wp_tag:
                activity_data['wp_tag'] = wp_tag
            if activity_type:
                activity_data['activity_type'] = activity_type
            if audience:
                activity_data['audience'] = audience
            if author:
                activity_data['author'] = author
            if featured_image:
                activity_data['featured_image'] = featured_image
            if gallery_images:
                activity_data['gallery_images'] = gallery_images
            
            print(f"FormData - Activity data to save: {activity_data}")
            print(f"Gallery images count: {len(gallery_images)}")
            
            # Save to JSON
            result = json_service.create('activities.json', activity_data)
            
            # Audit log
            audit.log_action(
                user=current_user.username,
                action='CREATE_ACTIVITY',
                details={'title': title, 'wp_tag': wp_tag, 'has_image': bool(featured_image), 'gallery_count': len(gallery_images)}
            )
            
            if result:
                return jsonify({
                    'success': True,
                    'data': result,
                    'message': 'Activity created successfully'
                })
            else:
                return jsonify({
                    'success': False,
                    'error': 'Failed to save activity to JSON'
                }), 500
        
        else:
            # ============================================================
            # ✅ HANDLE JSON (No image upload - for other admin pages)
            # ============================================================
            data = request.get_json()
            if not data:
                return jsonify({'success': False, 'error': 'No data provided'}), 400
            
            # Sanitize input
            title = data.get('title', '').strip()
            title = sanitize_html(title)
            if not title:
                return jsonify({'success': False, 'error': 'Title is required'}), 400
            
            body = data.get('body', '').strip()
            body = sanitize_html(body)
            if not body:
                return jsonify({'success': False, 'error': 'Body is required'}), 400
            
            slug = data.get('slug', '').strip()
            if not slug:
                slug = slugify(title)
                if not slug:
                    slug = f"activity-{int(datetime.now().timestamp())}"
            
            date = data.get('date', '')
            if not date:
                date = datetime.now().isoformat()
            
            # Sanitize optional fields
            summary = data.get('summary', '').strip()
            summary = sanitize_html(summary) if summary else ''
            location = data.get('location', '').strip()
            location = sanitize_html(location) if location else ''
            author = data.get('author', '').strip()
            author = sanitize_html(author) if author else ''
            
            gallery = safe_json_parse(data.get('gallery'))
            related_resources = safe_json_parse(data.get('related_resources'))
            evidence_status = data.get('evidence_status', 'draft')
            
            activity_data = {
                'title': title,
                'slug': slug,
                'body': body,
                'date': date,
                'created_at': datetime.now().isoformat(),
                'updated_at': datetime.now().isoformat(),
                'evidence_status': evidence_status
            }
            
            if summary:
                activity_data['summary'] = summary
            if location:
                activity_data['location'] = location
            if data.get('wp_tag'):
                activity_data['wp_tag'] = data['wp_tag']
            if data.get('activity_type'):
                activity_data['activity_type'] = data['activity_type']
            if data.get('audience'):
                activity_data['audience'] = data['audience']
            if author:
                activity_data['author'] = author
            if data.get('featured_image'):
                activity_data['featured_image'] = data['featured_image'].strip()
            if gallery:
                activity_data['gallery'] = gallery
            if related_resources:
                activity_data['related_resources'] = related_resources
            
            print(f"JSON - Activity data to save: {activity_data}")
            
            result = json_service.create('activities.json', activity_data)
            
            audit.log_action(
                user=current_user.username,
                action='CREATE_ACTIVITY',
                details={'title': title, 'wp_tag': data.get('wp_tag')}
            )
            
            if result:
                return jsonify({
                    'success': True,
                    'data': result,
                    'message': 'Activity created successfully'
                })
            else:
                return jsonify({
                    'success': False,
                    'error': 'Failed to save activity to JSON'
                }), 500
        
    except Exception as e:
        audit.log_action(
            user=current_user.username if current_user.is_authenticated else 'Unknown',
            action='CREATE_ACTIVITY_ERROR',
            details={'error': str(e)}
        )
        print(f"Error creating activity: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({
            'success': False,
            'error': str(e)
        }), 400
    

@api_bp.route('/activities/<int:id>', methods=['GET'])
@login_required
def api_get_activity(id):
    activity = json_service.get_by_id('activities.json', id)
    if not activity:
        return jsonify({'error': 'Not found'}), 404
    return jsonify(activity)



@api_bp.route('/activities/<int:id>', methods=['PUT'])
@limiter.limit("30 per minute")
@login_required
def api_update_activity(id):
    try:
        # Get existing activity first
        existing = json_service.get_by_id('activities.json', id)
        if not existing:
            return jsonify({'error': 'Not found'}), 404
        
        # ============================================================
        # CHECK IF REQUEST IS FORM DATA (with image) OR JSON
        # ============================================================
        is_form_data = request.content_type and 'multipart/form-data' in request.content_type
        
        if is_form_data:
            # ============================================================
            # ✅ HANDLE FORM DATA WITH IMAGE UPLOAD
            # ============================================================
            
            # Get fields from request.form
            title = request.form.get('title', '').strip()
            body = request.form.get('body', '').strip()
            slug = request.form.get('slug', '').strip()
            summary = request.form.get('summary', '').strip()
            date = request.form.get('date', '').strip()
            location = request.form.get('location', '').strip()
            wp_tag = request.form.get('wp_tag', '').strip()
            activity_type = request.form.get('activity_type', '').strip()
            audience = request.form.get('audience', '').strip()
            author = request.form.get('author', '').strip()
            evidence_status = request.form.get('evidence_status', 'draft').strip()
            
            # Validate required fields
            if not title:
                return jsonify({'success': False, 'error': 'Title is required'}), 400
            
            # Sanitize inputs
            title = sanitize_html(title)
            if body:
                body = sanitize_html(body)
            if summary:
                summary = sanitize_html(summary)
            if location:
                location = sanitize_html(location)
            if author:
                author = sanitize_html(author)
            
            # Auto-generate slug if not provided
            if not slug:
                slug = slugify(title)
                if not slug:
                    slug = f"activity-{int(datetime.now().timestamp())}"
            
            # Set date if not provided
            if not date:
                date = datetime.now().strftime('%Y-%m-%d')
            
            # ============================================================
            # ✅ HANDLE FEATURED IMAGE UPLOAD (replaces old image)
            # ============================================================
            featured_image = existing.get('featured_image')  # Keep existing by default
            
            if 'featured_image' in request.files:
                file = request.files['featured_image']
                if file and file.filename:
                    # Delete old image if exists
                    if existing.get('featured_image'):
                        old_path = os.path.join(
                            current_app.root_path, 
                            'static', 
                            existing['featured_image']
                        )
                        if os.path.exists(old_path):
                            try:
                                os.remove(old_path)
                                print(f"Deleted old featured image: {old_path}")
                            except Exception as e:
                                print(f"Could not delete old image: {e}")
                    
                    # Save new image
                    filename = save_uploaded_file(file, 'activities')
                    if filename:
                        featured_image = f"uploads/activities/{filename}"
            
            # ============================================================
            # ✅ HANDLE MULTIPLE GALLERY IMAGES UPLOAD (APPEND NEW)
            # ============================================================
            existing_gallery = existing.get('gallery_images', [])
            new_gallery_images = []
            
            if 'gallery_images' in request.files:
                files = request.files.getlist('gallery_images')
                # Get the next available ID
                next_id = max([img.get('id', 0) for img in existing_gallery]) + 1 if existing_gallery else 1
                
                for idx, file in enumerate(files):
                    if file and file.filename:
                        filename = save_uploaded_file(file, 'activities')
                        if filename:
                            caption_key = f'gallery_caption_{idx}'
                            caption = request.form.get(caption_key, '').strip()
                            new_gallery_images.append({
                                'id': next_id + idx,
                                'image_path': f"uploads/activities/{filename}",
                                'caption': sanitize_html(caption) if caption else '',
                                'display_order': len(existing_gallery) + idx
                            })
            
            # Combine existing + new
            all_gallery_images = existing_gallery + new_gallery_images
            
            # ============================================================
            # ✅ HANDLE REMOVED GALLERY IMAGES
            # ============================================================
            # Get list of image IDs to keep from form
            keep_ids = request.form.get('keep_gallery_ids', '')
            if keep_ids:
                keep_ids_list = [int(x.strip()) for x in keep_ids.split(',') if x.strip()]
                # Filter to keep only those IDs
                all_gallery_images = [img for img in all_gallery_images if img.get('id') in keep_ids_list]
            else:
                # If no keep_ids provided, keep all (or handle as needed)
                pass
            
            # Build updated data
            updated_data = {
                'title': title,
                'body': body,
                'slug': slug,
                'date': date,
                'updated_at': datetime.now().isoformat(),
                'evidence_status': evidence_status
            }
            
            # Add optional fields if they have values
            if summary:
                updated_data['summary'] = summary
            if location:
                updated_data['location'] = location
            if wp_tag:
                updated_data['wp_tag'] = wp_tag
            if activity_type:
                updated_data['activity_type'] = activity_type
            if audience:
                updated_data['audience'] = audience
            if author:
                updated_data['author'] = author
            if featured_image:
                updated_data['featured_image'] = featured_image
            if all_gallery_images:
                updated_data['gallery_images'] = all_gallery_images
            
            # Keep created_at from existing
            updated_data['created_at'] = existing.get('created_at', datetime.now().isoformat())
            
            print(f"FormData - Updated activity data: {updated_data}")
            print(f"Gallery images count: {len(all_gallery_images)}")
            
            result = json_service.update('activities.json', id, updated_data)
            
            audit.log_action(
                user=current_user.username,
                action='UPDATE_ACTIVITY',
                details={'id': id, 'title': title, 'has_image': bool(featured_image), 'gallery_count': len(all_gallery_images)}
            )
            
            if not result:
                return jsonify({'error': 'Not found'}), 404
            
            return jsonify({'success': True, 'data': result, 'message': 'Activity updated successfully'})
        
        else:
            # ============================================================
            # ✅ HANDLE JSON (No image upload)
            # ============================================================
            data = request.get_json()
            if not data:
                return jsonify({'success': False, 'error': 'No data provided'}), 400
            
            # Sanitize input
            title = data.get('title', '').strip()
            title = sanitize_html(title)
            if not title:
                return jsonify({'success': False, 'error': 'Title is required'}), 400
            
            body = data.get('body', '').strip()
            body = sanitize_html(body) if body else existing.get('body', '')
            
            slug = data.get('slug', '').strip() or slugify(title)
            date = data.get('date', datetime.now().isoformat())
            evidence_status = data.get('evidence_status', 'draft')
            
            updated_data = {
                'title': title,
                'body': body,
                'slug': slug,
                'date': date,
                'updated_at': datetime.now().isoformat(),
                'evidence_status': evidence_status
            }
            
            # Sanitize optional fields
            if data.get('summary'):
                updated_data['summary'] = sanitize_html(data['summary'].strip())
            if data.get('location'):
                updated_data['location'] = sanitize_html(data['location'].strip())
            if data.get('wp_tag'):
                updated_data['wp_tag'] = data['wp_tag']
            if data.get('activity_type'):
                updated_data['activity_type'] = data['activity_type']
            if data.get('audience'):
                updated_data['audience'] = data['audience']
            if data.get('author'):
                updated_data['author'] = sanitize_html(data['author'].strip())
            if data.get('featured_image'):
                updated_data['featured_image'] = data['featured_image'].strip()
            if data.get('gallery_images'):
                # Handle gallery_images as JSON array
                gallery = data.get('gallery_images')
                if isinstance(gallery, list):
                    updated_data['gallery_images'] = gallery
            if data.get('related_resources'):
                related = safe_json_parse(data['related_resources'])
                if related:
                    updated_data['related_resources'] = related
            
            # Keep created_at from existing
            updated_data['created_at'] = existing.get('created_at', datetime.now().isoformat())
            
            result = json_service.update('activities.json', id, updated_data)
            
            audit.log_action(
                user=current_user.username,
                action='UPDATE_ACTIVITY',
                details={'id': id, 'title': title}
            )
            
            if not result:
                return jsonify({'error': 'Not found'}), 404
            
            return jsonify({'success': True, 'data': result, 'message': 'Activity updated successfully'})
        
    except Exception as e:
        audit.log_action(
            user=current_user.username if current_user.is_authenticated else 'Unknown',
            action='UPDATE_ACTIVITY_ERROR',
            details={'id': id, 'error': str(e)}
        )
        print(f"Error updating activity: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({'success': False, 'error': str(e)}), 400


@api_bp.route('/activities/<int:id>', methods=['DELETE'])
@limiter.limit("10 per minute")
@login_required
def api_delete_activity(id):
    try:
        # Get activity for logging and image cleanup
        activity = json_service.get_by_id('activities.json', id)
        if activity:
            # Delete featured image if exists
            if activity.get('featured_image'):
                image_path = os.path.join(
                    current_app.root_path, 
                    'static', 
                    activity['featured_image']
                )
                if os.path.exists(image_path):
                    try:
                        os.remove(image_path)
                        print(f"Deleted featured image: {image_path}")
                    except Exception as e:
                        print(f"Could not delete featured image: {e}")
            
            # ============================================================
            # ✅ DELETE ALL GALLERY IMAGES
            # ============================================================
            gallery_images = activity.get('gallery_images', [])
            for img in gallery_images:
                img_path = img.get('image_path', '')
                if img_path:
                    full_path = os.path.join(
                        current_app.root_path, 
                        'static', 
                        img_path
                    )
                    if os.path.exists(full_path):
                        try:
                            os.remove(full_path)
                            print(f"Deleted gallery image: {full_path}")
                        except Exception as e:
                            print(f"Could not delete gallery image: {e}")
            
            audit.log_action(
                user=current_user.username,
                action='DELETE_ACTIVITY',
                details={
                    'id': id, 
                    'title': activity.get('title'),
                    'gallery_count': len(gallery_images)
                }
            )
        
        result = json_service.delete('activities.json', id)
        if not result:
            return jsonify({'error': 'Not found'}), 404
        return jsonify({'success': True, 'message': 'Activity deleted successfully'})
    except Exception as e:
        audit.log_action(
            user=current_user.username if current_user.is_authenticated else 'Unknown',
            action='DELETE_ACTIVITY_ERROR',
            details={'id': id, 'error': str(e)}
        )
        return jsonify({'success': False, 'error': str(e)}), 400
# ================================================================
# API - Events
# ================================================================

@api_bp.route('/events/', methods=['GET'])
@limiter.exempt 
def api_get_events():
    events = json_service.get_all('events.json')
    return jsonify(events)


@api_bp.route('/events/', methods=['POST'])
@limiter.limit("30 per minute")
@login_required
def api_create_event():
    """
    Create a new event with optional image upload.
    Supports both FormData (with image) and JSON.
    """
    try:
        # ============================================================
        # CHECK IF REQUEST IS FORM DATA (with image) OR JSON
        # ============================================================
        is_form_data = request.content_type and 'multipart/form-data' in request.content_type
        
        if is_form_data:
            # ============================================================
            # ✅ HANDLE FORM DATA WITH IMAGE UPLOAD
            # ============================================================
            
            # Get fields from request.form
            title = request.form.get('title', '').strip()
            slug = request.form.get('slug', '').strip()
            date = request.form.get('date', '').strip()
            time = request.form.get('time', '').strip()
            location = request.form.get('location', '').strip()
            venue = request.form.get('venue', '').strip()
            agenda = request.form.get('agenda', '').strip()
            audience = request.form.get('audience', '').strip()
            capacity = request.form.get('capacity', '').strip()
            speakers = request.form.get('speakers', '').strip()
            registration_link = request.form.get('registration_link', '').strip()
            status = request.form.get('status', 'upcoming').strip()
            description = request.form.get('description', '').strip()
            post_event_report = request.form.get('post_event_report', '').strip()
            
            # Validate required fields
            if not title:
                return jsonify({'success': False, 'error': 'Title is required'}), 400
            
            # Sanitize inputs
            title = sanitize_html(title)
            if agenda:
                agenda = sanitize_html(agenda)
            if description:
                description = sanitize_html(description)
            if location:
                location = sanitize_html(location)
            if venue:
                venue = sanitize_html(venue)
            if speakers:
                speakers = sanitize_html(speakers)
            if post_event_report:
                post_event_report = sanitize_html(post_event_report)
            
            # Auto-generate slug if not provided
            if not slug:
                slug = slugify(title)
                if not slug:
                    slug = f"event-{int(datetime.now().timestamp())}"
            
            # ============================================================
            # ✅ HANDLE FEATURED IMAGE UPLOAD
            # ============================================================
            featured_image = None
            if 'featured_image' in request.files:
                file = request.files['featured_image']
                if file and file.filename:
                    filename = save_uploaded_file(file, 'events')
                    if filename:
                        featured_image = f"uploads/events/{filename}"
            
            # ============================================================
            # ✅ HANDLE GALLERY IMAGES UPLOAD
            # ============================================================
            gallery_images = []
            if 'gallery_images' in request.files:
                files = request.files.getlist('gallery_images')
                for idx, file in enumerate(files):
                    if file and file.filename:
                        filename = save_uploaded_file(file, 'events')
                        if filename:
                            caption_key = f'gallery_caption_{idx}'
                            caption = request.form.get(caption_key, '').strip()
                            gallery_images.append({
                                'id': idx + 1,
                                'image_path': f"uploads/events/{filename}",
                                'caption': sanitize_html(caption) if caption else '',
                                'display_order': idx
                            })
            
            # Build event data
            event_data = {
                'title': title,
                'slug': slug,
                'created_at': datetime.now().isoformat(),
                'updated_at': datetime.now().isoformat(),
                'status': status
            }
            
            # Add optional fields if they have values
            if date:
                event_data['date'] = date
            if time:
                event_data['time'] = time
            if location:
                event_data['location'] = location
            if venue:
                event_data['venue'] = venue
            if agenda:
                event_data['agenda'] = agenda
            if audience:
                event_data['audience'] = audience
            if capacity:
                event_data['capacity'] = capacity
            if speakers:
                event_data['speakers'] = speakers
            if registration_link:
                event_data['registration_link'] = registration_link
            if description:
                event_data['description'] = description
            if post_event_report:
                event_data['post_event_report'] = post_event_report
            if featured_image:
                event_data['featured_image'] = featured_image
            if gallery_images:
                event_data['gallery_images'] = gallery_images
            
            print(f"FormData - Event data to save: {event_data}")
            
            # Save to JSON
            result = json_service.create('events.json', event_data)
            
            audit.log_action(
                user=current_user.username,
                action='CREATE_EVENT',
                details={'title': title, 'has_image': bool(featured_image)}
            )
            
            if result:
                return jsonify({
                    'success': True,
                    'data': result,
                    'message': 'Event created successfully'
                })
            else:
                return jsonify({
                    'success': False,
                    'error': 'Failed to save event to JSON'
                }), 500
        
        else:
            # ============================================================
            # ✅ HANDLE JSON (No file upload - compatibility)
            # ============================================================
            data = request.get_json()
            if not data:
                return jsonify({'success': False, 'error': 'No data provided'}), 400
            
            if not data.get('title'):
                return jsonify({'success': False, 'error': 'Title is required'}), 400
            
            title = sanitize_html(data.get('title', '').strip())
            data['title'] = title
            
            if not data.get('slug'):
                data['slug'] = slugify(title)
            data['created_at'] = datetime.now().isoformat()
            data['updated_at'] = datetime.now().isoformat()
            
            result = json_service.create('events.json', data)
            
            audit.log_action(
                user=current_user.username,
                action='CREATE_EVENT',
                details={'title': title}
            )
            
            if result:
                return jsonify({'success': True, 'data': result, 'message': 'Event created successfully'})
            else:
                return jsonify({'success': False, 'error': 'Failed to save event'}), 500
        
    except Exception as e:
        audit.log_action(
            user=current_user.username if current_user.is_authenticated else 'Unknown',
            action='CREATE_EVENT_ERROR',
            details={'error': str(e)}
        )
        return jsonify({'success': False, 'error': str(e)}), 400




@api_bp.route('/events/<int:id>', methods=['GET'])
@login_required
def api_get_event(id):
    event = json_service.get_by_id('events.json', id)
    if not event:
        return jsonify({'error': 'Not found'}), 404
    return jsonify(event)


@api_bp.route('/events/<int:id>', methods=['PUT'])
@limiter.limit("30 per minute")
@login_required
def api_update_event(id):
    """
    Update an event with optional image upload.
    Supports both FormData (with image) and JSON.
    """
    try:
        # Get existing event
        existing = json_service.get_by_id('events.json', id)
        if not existing:
            return jsonify({'error': 'Event not found'}), 404
        
        # ============================================================
        # CHECK IF REQUEST IS FORM DATA (with image) OR JSON
        # ============================================================
        is_form_data = request.content_type and 'multipart/form-data' in request.content_type
        
        if is_form_data:
            # ============================================================
            # ✅ HANDLE FORM DATA WITH IMAGE UPLOAD
            # ============================================================
            
            # Get fields from request.form
            title = request.form.get('title', '').strip()
            slug = request.form.get('slug', '').strip()
            date = request.form.get('date', '').strip()
            time = request.form.get('time', '').strip()
            location = request.form.get('location', '').strip()
            venue = request.form.get('venue', '').strip()
            agenda = request.form.get('agenda', '').strip()
            audience = request.form.get('audience', '').strip()
            capacity = request.form.get('capacity', '').strip()
            speakers = request.form.get('speakers', '').strip()
            registration_link = request.form.get('registration_link', '').strip()
            status = request.form.get('status', 'upcoming').strip()
            description = request.form.get('description', '').strip()
            post_event_report = request.form.get('post_event_report', '').strip()
            
            # Validate required fields
            if not title:
                return jsonify({'success': False, 'error': 'Title is required'}), 400
            
            # Sanitize inputs
            title = sanitize_html(title)
            if agenda:
                agenda = sanitize_html(agenda)
            if description:
                description = sanitize_html(description)
            if location:
                location = sanitize_html(location)
            if venue:
                venue = sanitize_html(venue)
            if speakers:
                speakers = sanitize_html(speakers)
            if post_event_report:
                post_event_report = sanitize_html(post_event_report)
            
            # Auto-generate slug if not provided
            if not slug:
                slug = slugify(title)
                if not slug:
                    slug = f"event-{int(datetime.now().timestamp())}"
            
            # ============================================================
            # ✅ HANDLE FEATURED IMAGE UPLOAD (replaces old image)
            # ============================================================
            featured_image = existing.get('featured_image')
            
            if 'featured_image' in request.files:
                file = request.files['featured_image']
                if file and file.filename:
                    # Delete old image if exists
                    if existing.get('featured_image'):
                        delete_uploaded_file(existing['featured_image'])
                    
                    # Save new image
                    filename = save_uploaded_file(file, 'events')
                    if filename:
                        featured_image = f"uploads/events/{filename}"
            
            # ============================================================
            # ✅ HANDLE GALLERY IMAGES UPLOAD (append new)
            # ============================================================
            existing_gallery = existing.get('gallery_images', [])
            new_gallery_images = []
            
            if 'gallery_images' in request.files:
                files = request.files.getlist('gallery_images')
                next_id = max([img.get('id', 0) for img in existing_gallery]) + 1 if existing_gallery else 1
                
                for idx, file in enumerate(files):
                    if file and file.filename:
                        filename = save_uploaded_file(file, 'events')
                        if filename:
                            caption_key = f'gallery_caption_{idx}'
                            caption = request.form.get(caption_key, '').strip()
                            new_gallery_images.append({
                                'id': next_id + idx,
                                'image_path': f"uploads/events/{filename}",
                                'caption': sanitize_html(caption) if caption else '',
                                'display_order': len(existing_gallery) + idx
                            })
            
            # Combine existing + new
            all_gallery_images = existing_gallery + new_gallery_images
            
            # ============================================================
            # ✅ HANDLE REMOVED GALLERY IMAGES
            # ============================================================
            keep_ids = request.form.get('keep_gallery_ids', '')
            if keep_ids:
                keep_ids_list = [int(x.strip()) for x in keep_ids.split(',') if x.strip()]
                all_gallery_images = [img for img in all_gallery_images if img.get('id') in keep_ids_list]
                # Delete removed image files
                for img in existing_gallery:
                    if img.get('id') not in keep_ids_list:
                        delete_uploaded_file(img.get('image_path'))
            
            # Build updated data
            updated_data = {
                'title': title,
                'slug': slug,
                'updated_at': datetime.now().isoformat(),
                'status': status
            }
            
            # Add optional fields if they have values
            if date:
                updated_data['date'] = date
            if time:
                updated_data['time'] = time
            if location:
                updated_data['location'] = location
            if venue:
                updated_data['venue'] = venue
            if agenda:
                updated_data['agenda'] = agenda
            if audience:
                updated_data['audience'] = audience
            if capacity:
                updated_data['capacity'] = capacity
            if speakers:
                updated_data['speakers'] = speakers
            if registration_link:
                updated_data['registration_link'] = registration_link
            if description:
                updated_data['description'] = description
            if post_event_report:
                updated_data['post_event_report'] = post_event_report
            if featured_image:
                updated_data['featured_image'] = featured_image
            if all_gallery_images:
                updated_data['gallery_images'] = all_gallery_images
            
            # Keep created_at from existing
            updated_data['created_at'] = existing.get('created_at', datetime.now().isoformat())
            
            print(f"FormData - Updated event data: {updated_data}")
            
            result = json_service.update('events.json', id, updated_data)
            
            audit.log_action(
                user=current_user.username,
                action='UPDATE_EVENT',
                details={'id': id, 'title': title}
            )
            
            if not result:
                return jsonify({'error': 'Not found'}), 404
            
            return jsonify({'success': True, 'data': result, 'message': 'Event updated successfully'})
        
        else:
            # ============================================================
            # ✅ HANDLE JSON (No file upload)
            # ============================================================
            data = request.get_json()
            if not data:
                return jsonify({'success': False, 'error': 'No data provided'}), 400
            
            if data.get('title'):
                data['title'] = sanitize_html(data['title'].strip())
            data['updated_at'] = datetime.now().isoformat()
            
            result = json_service.update('events.json', id, data)
            
            if not result:
                return jsonify({'error': 'Not found'}), 404
            
            audit.log_action(
                user=current_user.username,
                action='UPDATE_EVENT',
                details={'id': id, 'title': data.get('title')}
            )
            
            return jsonify({'success': True, 'data': result, 'message': 'Event updated successfully'})
        
    except Exception as e:
        audit.log_action(
            user=current_user.username if current_user.is_authenticated else 'Unknown',
            action='UPDATE_EVENT_ERROR',
            details={'id': id, 'error': str(e)}
        )
        return jsonify({'success': False, 'error': str(e)}), 400
    



@api_bp.route('/events/<int:id>', methods=['DELETE'])
@limiter.limit("10 per minute")
@login_required
def api_delete_event(id):
    """Delete an event and remove associated images from disk."""
    try:
        event = json_service.get_by_id('events.json', id)
        
        if event:
            # Delete featured image if exists
            if event.get('featured_image'):
                delete_uploaded_file(event['featured_image'])
            
            # Delete gallery images if exists
            gallery_images = event.get('gallery_images', [])
            for img in gallery_images:
                if img.get('image_path'):
                    delete_uploaded_file(img['image_path'])
            
            audit.log_action(
                user=current_user.username,
                action='DELETE_EVENT',
                details={'id': id, 'title': event.get('title'), 'gallery_count': len(gallery_images)}
            )
        
        result = json_service.delete('events.json', id)
        if not result:
            return jsonify({'error': 'Not found'}), 404
        
        return jsonify({'success': True, 'message': 'Event deleted successfully'})
    except Exception as e:
        audit.log_action(
            user=current_user.username if current_user.is_authenticated else 'Unknown',
            action='DELETE_EVENT_ERROR',
            details={'id': id, 'error': str(e)}
        )
        return jsonify({'success': False, 'error': str(e)}), 400
    




# ================================================================
# API - Resources
# ================================================================

@api_bp.route('/resources/', methods=['GET'])
# ✅ REMOVED @login_required - Public access needed for resources hub
def api_get_resources():
    resources = json_service.get_all('resources.json')
    return jsonify(resources)


@api_bp.route('/resources/', methods=['POST'])
@limiter.limit("30 per minute")
@login_required
def api_create_resource():
    """
    Create a new resource with optional file upload.
    Supports both FormData (with file) and JSON.
    """
    try:
        # ============================================================
        # CHECK IF REQUEST IS FORM DATA (with file) OR JSON
        # ============================================================
        is_form_data = request.content_type and 'multipart/form-data' in request.content_type
        
        if is_form_data:
            # ============================================================
            # ✅ HANDLE FORM DATA WITH FILE UPLOAD
            # ============================================================
            
            # Get fields from request.form
            title = request.form.get('title', '').strip()
            description = request.form.get('description', '').strip()
            slug = request.form.get('slug', '').strip()
            resource_type = request.form.get('resource_type', '').strip()
            wp_tag = request.form.get('wp_tag', '').strip()
            audience = request.form.get('audience', '').strip()
            external_url = request.form.get('external_url', '').strip()
            language = request.form.get('language', 'English').strip()
            license = request.form.get('license', '').strip()
            is_public = request.form.get('is_public', 'true').lower() == 'true'
            
            # Validate required fields
            if not title:
                return jsonify({'success': False, 'error': 'Title is required'}), 400
            if not description:
                return jsonify({'success': False, 'error': 'Description is required'}), 400
            if not resource_type:
                return jsonify({'success': False, 'error': 'Resource type is required'}), 400
            if not wp_tag:
                return jsonify({'success': False, 'error': 'Work Package is required'}), 400
            
            # Sanitize
            title = sanitize_html(title)
            description = sanitize_html(description)
            if license:
                license = sanitize_html(license)
            
            # Auto-generate slug if not provided
            if not slug:
                slug = slugify(title)
                if not slug:
                    slug = f"resource-{int(datetime.now().timestamp())}"
            
            # ============================================================
            # ✅ HANDLE FILE UPLOAD
            # ============================================================
            file_path = None
            if 'file' in request.files:
                file = request.files['file']
                if file and file.filename:
                    file_path = save_resource_file(file)
                    if not file_path:
                        return jsonify({'success': False, 'error': 'Invalid file type. Allowed: PDF, DOCX, PPT, MP4, ZIP, PNG, JPG, GIF, WEBP, SVG'}), 400
            
            # Validate: either file_path or external_url must be provided
            if not file_path and not external_url:
                return jsonify({'success': False, 'error': 'Either a file upload or an external URL is required'}), 400
            
            # Build resource data
            resource_data = {
                'title': title,
                'slug': slug,
                'description': description,
                'resource_type': resource_type,
                'wp_tag': wp_tag,
                'audience': audience,
                'language': language,
                'is_public': is_public,
                'download_count': 0,
                'created_at': datetime.now().isoformat(),
                'updated_at': datetime.now().isoformat()
            }
            
            if file_path:
                resource_data['file_path'] = file_path
            if external_url:
                resource_data['external_url'] = external_url
            if license:
                resource_data['license'] = license
            
            # Save to JSON
            result = json_service.create('resources.json', resource_data)
            
            audit.log_action(
                user=current_user.username,
                action='CREATE_RESOURCE',
                details={'title': title, 'resource_type': resource_type, 'has_file': bool(file_path)}
            )
            
            if result:
                return jsonify({
                    'success': True,
                    'data': result,
                    'message': 'Resource created successfully'
                })
            else:
                return jsonify({
                    'success': False,
                    'error': 'Failed to save resource to JSON'
                }), 500
        
        else:
            # ============================================================
            # ✅ HANDLE JSON (No file upload - for compatibility)
            # ============================================================
            data = request.get_json()
            if not data:
                return jsonify({'success': False, 'error': 'No data provided'}), 400
            
            if not data.get('title'):
                return jsonify({'success': False, 'error': 'Title is required'}), 400
            
            title = sanitize_html(data.get('title', '').strip())
            data['title'] = title
            
            if not data.get('slug'):
                data['slug'] = slugify(title)
            data['created_at'] = datetime.now().isoformat()
            data['updated_at'] = datetime.now().isoformat()
            
            result = json_service.create('resources.json', data)
            
            audit.log_action(
                user=current_user.username,
                action='CREATE_RESOURCE',
                details={'title': title}
            )
            
            if result:
                return jsonify({'success': True, 'data': result, 'message': 'Resource created successfully'})
            else:
                return jsonify({'success': False, 'error': 'Failed to save resource'}), 500
        
    except Exception as e:
        audit.log_action(
            user=current_user.username if current_user.is_authenticated else 'Unknown',
            action='CREATE_RESOURCE_ERROR',
            details={'error': str(e)}
        )
        return jsonify({'success': False, 'error': str(e)}), 400
    




@api_bp.route('/resources/<int:id>', methods=['GET'])
@login_required
def api_get_resource(id):
    resource = json_service.get_by_id('resources.json', id)
    if not resource:
        return jsonify({'error': 'Not found'}), 404
    return jsonify(resource)


@api_bp.route('/resources/<int:id>', methods=['PUT'])
@limiter.limit("30 per minute")
@login_required
def api_update_resource(id):
    """
    Update a resource with optional file upload/replacement.
    Supports both FormData (with file) and JSON.
    """
    try:
        # Get existing resource
        existing = json_service.get_by_id('resources.json', id)
        if not existing:
            return jsonify({'error': 'Resource not found'}), 404
        
        # ============================================================
        # CHECK IF REQUEST IS FORM DATA (with file) OR JSON
        # ============================================================
        is_form_data = request.content_type and 'multipart/form-data' in request.content_type
        
        if is_form_data:
            # ============================================================
            # ✅ HANDLE FORM DATA WITH FILE UPLOAD
            # ============================================================
            
            # Get fields from request.form
            title = request.form.get('title', '').strip()
            description = request.form.get('description', '').strip()
            slug = request.form.get('slug', '').strip()
            resource_type = request.form.get('resource_type', '').strip()
            wp_tag = request.form.get('wp_tag', '').strip()
            audience = request.form.get('audience', '').strip()
            external_url = request.form.get('external_url', '').strip()
            language = request.form.get('language', 'English').strip()
            license = request.form.get('license', '').strip()
            is_public = request.form.get('is_public', 'true').lower() == 'true'
            
            # Validate required fields
            if not title:
                return jsonify({'success': False, 'error': 'Title is required'}), 400
            if not description:
                return jsonify({'success': False, 'error': 'Description is required'}), 400
            
            # Sanitize
            title = sanitize_html(title)
            description = sanitize_html(description)
            if license:
                license = sanitize_html(license)
            
            # Auto-generate slug if not provided
            if not slug:
                slug = slugify(title)
                if not slug:
                    slug = f"resource-{int(datetime.now().timestamp())}"
            
            # ============================================================
            # ✅ HANDLE FILE REPLACEMENT
            # ============================================================
            file_path = existing.get('file_path')  # Keep existing by default
            
            if 'file' in request.files:
                file = request.files['file']
                if file and file.filename:
                    # Delete old file if exists
                    if existing.get('file_path'):
                        delete_uploaded_file(existing['file_path'])
                    
                    # Save new file
                    new_file_path = save_resource_file(file)
                    if new_file_path:
                        file_path = new_file_path
                    else:
                        return jsonify({'success': False, 'error': 'Invalid file type. Allowed: PDF, DOCX, PPT, MP4, ZIP, PNG, JPG, GIF, WEBP, SVG'}), 400
            
            # Check for removal flag
            remove_file = request.form.get('remove_file', 'false').lower() == 'true'
            if remove_file and existing.get('file_path'):
                delete_uploaded_file(existing['file_path'])
                file_path = None
            
            # Validate: either file_path or external_url must be provided
            if not file_path and not external_url:
                return jsonify({'success': False, 'error': 'Either a file upload or an external URL is required'}), 400
            
            # Build updated data
            updated_data = {
                'title': title,
                'slug': slug,
                'description': description,
                'resource_type': resource_type or existing.get('resource_type'),
                'wp_tag': wp_tag or existing.get('wp_tag'),
                'audience': audience or existing.get('audience'),
                'language': language or existing.get('language', 'English'),
                'is_public': is_public,
                'updated_at': datetime.now().isoformat()
            }
            
            if file_path:
                updated_data['file_path'] = file_path
            elif remove_file:
                updated_data['file_path'] = None
            
            if external_url:
                updated_data['external_url'] = external_url
            elif external_url == '' and not file_path:
                # If external_url is cleared and no file, keep existing
                pass
            
            if license:
                updated_data['license'] = license
            
            # Keep created_at from existing
            updated_data['created_at'] = existing.get('created_at', datetime.now().isoformat())
            
            # Save to JSON
            result = json_service.update('resources.json', id, updated_data)
            
            audit.log_action(
                user=current_user.username,
                action='UPDATE_RESOURCE',
                details={'id': id, 'title': title}
            )
            
            if result:
                return jsonify({
                    'success': True,
                    'data': result,
                    'message': 'Resource updated successfully'
                })
            else:
                return jsonify({
                    'success': False,
                    'error': 'Failed to update resource'
                }), 500
        
        else:
            # ============================================================
            # ✅ HANDLE JSON (No file upload)
            # ============================================================
            data = request.get_json()
            if not data:
                return jsonify({'success': False, 'error': 'No data provided'}), 400
            
            if data.get('title'):
                data['title'] = sanitize_html(data['title'].strip())
            data['updated_at'] = datetime.now().isoformat()
            
            result = json_service.update('resources.json', id, data)
            if not result:
                return jsonify({'error': 'Not found'}), 404
            
            audit.log_action(
                user=current_user.username,
                action='UPDATE_RESOURCE',
                details={'id': id, 'title': data.get('title')}
            )
            
            return jsonify({'success': True, 'data': result, 'message': 'Resource updated successfully'})
        
    except Exception as e:
        audit.log_action(
            user=current_user.username if current_user.is_authenticated else 'Unknown',
            action='UPDATE_RESOURCE_ERROR',
            details={'id': id, 'error': str(e)}
        )
        return jsonify({'success': False, 'error': str(e)}), 400
    






@api_bp.route('/resources/<int:id>', methods=['DELETE'])
@limiter.limit("10 per minute")
@login_required
def api_delete_resource(id):
    """Delete a resource and remove associated file from disk."""
    try:
        resource = json_service.get_by_id('resources.json', id)
        
        if resource:
            # Delete file from disk if exists
            if resource.get('file_path'):
                delete_uploaded_file(resource['file_path'])
            
            audit.log_action(
                user=current_user.username,
                action='DELETE_RESOURCE',
                details={'id': id, 'title': resource.get('title')}
            )
        
        result = json_service.delete('resources.json', id)
        if not result:
            return jsonify({'error': 'Not found'}), 404
        
        return jsonify({'success': True, 'message': 'Resource deleted successfully'})
    except Exception as e:
        audit.log_action(
            user=current_user.username if current_user.is_authenticated else 'Unknown',
            action='DELETE_RESOURCE_ERROR',
            details={'id': id, 'error': str(e)}
        )
        return jsonify({'success': False, 'error': str(e)}), 400

# ================================================================
# API - Partners
# ================================================================

@api_bp.route('/partners/', methods=['GET'])

def api_get_partners():
    partners = json_service.get_all('partners.json')
    return jsonify(partners)


@api_bp.route('/partners/', methods=['POST'])
@limiter.limit("30 per minute")
@login_required
def api_create_partner():
    """
    Create a new partner with optional logo upload.
    Supports both FormData (with file) and JSON.
    """
    try:
        # ============================================================
        # CHECK IF REQUEST IS FORM DATA (with logo) OR JSON
        # ============================================================
        is_form_data = request.content_type and 'multipart/form-data' in request.content_type
        
        if is_form_data:
            # ============================================================
            # ✅ HANDLE FORM DATA WITH LOGO UPLOAD
            # ============================================================
            
            # Get fields from request.form
            short_name = request.form.get('short_name', '').strip()
            name = request.form.get('name', '').strip()
            country = request.form.get('country', '').strip()
            role = request.form.get('role', '').strip()
            description = request.form.get('description', '').strip()
            website = request.form.get('website', '').strip()
            is_consortium = request.form.get('is_consortium', 'true').lower() == 'true'
            display_order = int(request.form.get('display_order', 0)) if request.form.get('display_order') else 0
            is_published = request.form.get('is_published', 'true').lower() == 'true'
            
            # Local partner fields
            tags = request.form.get('tags', '').split(',') if request.form.get('tags') else []
            tags = [t.strip() for t in tags if t.strip()]
            ecosystem_impact = request.form.get('ecosystem_impact', '').strip()
            
            # Validate required fields
            if not short_name:
                return jsonify({'success': False, 'error': 'Short Name is required'}), 400
            if not name:
                return jsonify({'success': False, 'error': 'Name is required'}), 400
            if not country:
                return jsonify({'success': False, 'error': 'Country is required'}), 400
            
            # Sanitize
            short_name = sanitize_html(short_name)
            name = sanitize_html(name)
            country = sanitize_html(country)
            role = sanitize_html(role) if role else ''
            description = sanitize_html(description) if description else ''
            website = website.strip()
            if ecosystem_impact:
                ecosystem_impact = sanitize_html(ecosystem_impact)
            
            # ============================================================
            # ✅ HANDLE LOGO UPLOAD
            # ============================================================
            logo_path = None
            if 'logo' in request.files:
                file = request.files['logo']
                if file and file.filename:
                    logo_path = save_partner_logo(file)
                    if not logo_path:
                        return jsonify({'success': False, 'error': 'Invalid file type. Allowed: SVG, PNG, JPG, WEBP'}), 400
            
            # Build partner data
            partner_data = {
                'short_name': short_name,
                'name': name,
                'country': country,
                'role': role,
                'description': description,
                'website': website,
                'is_consortium': is_consortium,
                'display_order': display_order,
                'is_published': is_published,
                'tags': tags,
                'ecosystem_impact': ecosystem_impact,
                'created_at': datetime.now().isoformat(),
                'updated_at': datetime.now().isoformat()
            }
            
            if logo_path:
                partner_data['logo'] = logo_path
            
            # Save to JSON
            result = json_service.create('partners.json', partner_data)
            
            audit.log_action(
                user=current_user.username,
                action='CREATE_PARTNER',
                details={'short_name': short_name, 'name': name, 'is_consortium': is_consortium}
            )
            
            if result:
                return jsonify({
                    'success': True,
                    'data': result,
                    'message': 'Partner created successfully'
                })
            else:
                return jsonify({
                    'success': False,
                    'error': 'Failed to save partner to JSON'
                }), 500
        
        else:
            # ============================================================
            # ✅ HANDLE JSON (No file upload - for compatibility)
            # ============================================================
            data = request.get_json()
            if not data:
                return jsonify({'success': False, 'error': 'No data provided'}), 400
            
            if not data.get('name') or not data.get('short_name') or not data.get('country'):
                return jsonify({'success': False, 'error': 'Name, Short Name, and Country are required'}), 400
            
            data['name'] = sanitize_html(data['name'].strip())
            data['short_name'] = sanitize_html(data['short_name'].strip())
            data['country'] = sanitize_html(data['country'].strip())
            
            data['created_at'] = datetime.now().isoformat()
            data['updated_at'] = datetime.now().isoformat()
            result = json_service.create('partners.json', data)
            
            audit.log_action(
                user=current_user.username,
                action='CREATE_PARTNER',
                details={'name': data['name']}
            )
            
            if result:
                return jsonify({'success': True, 'data': result, 'message': 'Partner created successfully'})
            else:
                return jsonify({'success': False, 'error': 'Failed to save partner'}), 500
        
    except Exception as e:
        audit.log_action(
            user=current_user.username if current_user.is_authenticated else 'Unknown',
            action='CREATE_PARTNER_ERROR',
            details={'error': str(e)}
        )
        return jsonify({'success': False, 'error': str(e)}), 400

@api_bp.route('/partners/<int:id>', methods=['GET'])
@login_required
def api_get_partner(id):
    partner = json_service.get_by_id('partners.json', id)
    if not partner:
        return jsonify({'error': 'Not found'}), 404
    return jsonify(partner)


@api_bp.route('/partners/<int:id>', methods=['PUT'])
@limiter.limit("30 per minute")
@login_required
def api_update_partner(id):
    """
    Update a partner with optional logo replacement.
    Supports both FormData (with file) and JSON.
    """
    try:
        # Get existing partner
        existing = json_service.get_by_id('partners.json', id)
        if not existing:
            return jsonify({'error': 'Partner not found'}), 404
        
        # ============================================================
        # CHECK IF REQUEST IS FORM DATA (with logo) OR JSON
        # ============================================================
        is_form_data = request.content_type and 'multipart/form-data' in request.content_type
        
        if is_form_data:
            # ============================================================
            # ✅ HANDLE FORM DATA WITH LOGO REPLACEMENT
            # ============================================================
            
            # Get fields from request.form
            short_name = request.form.get('short_name', '').strip()
            name = request.form.get('name', '').strip()
            country = request.form.get('country', '').strip()
            role = request.form.get('role', '').strip()
            description = request.form.get('description', '').strip()
            website = request.form.get('website', '').strip()
            is_consortium = request.form.get('is_consortium', 'true').lower() == 'true'
            display_order = int(request.form.get('display_order', 0)) if request.form.get('display_order') else existing.get('display_order', 0)
            is_published = request.form.get('is_published', 'true').lower() == 'true'
            
            # Local partner fields
            tags = request.form.get('tags', '').split(',') if request.form.get('tags') else existing.get('tags', [])
            tags = [t.strip() for t in tags if t.strip()]
            ecosystem_impact = request.form.get('ecosystem_impact', '').strip()
            
            # Validate required fields
            if not short_name:
                return jsonify({'success': False, 'error': 'Short Name is required'}), 400
            if not name:
                return jsonify({'success': False, 'error': 'Name is required'}), 400
            if not country:
                return jsonify({'success': False, 'error': 'Country is required'}), 400
            
            # Sanitize
            short_name = sanitize_html(short_name)
            name = sanitize_html(name)
            country = sanitize_html(country)
            role = sanitize_html(role) if role else existing.get('role', '')
            description = sanitize_html(description) if description else existing.get('description', '')
            if ecosystem_impact:
                ecosystem_impact = sanitize_html(ecosystem_impact)
            
            # ============================================================
            # ✅ HANDLE LOGO REPLACEMENT
            # ============================================================
            logo_path = existing.get('logo')  # Keep existing by default
            
            if 'logo' in request.files:
                file = request.files['logo']
                if file and file.filename:
                    # Delete old logo if exists
                    if existing.get('logo'):
                        delete_partner_logo(existing['logo'])
                    
                    # Save new logo
                    new_logo_path = save_partner_logo(file)
                    if new_logo_path:
                        logo_path = new_logo_path
                    else:
                        return jsonify({'success': False, 'error': 'Invalid file type. Allowed: SVG, PNG, JPG, WEBP'}), 400
            
            # Check for removal flag
            remove_logo = request.form.get('remove_logo', 'false').lower() == 'true'
            if remove_logo and existing.get('logo'):
                delete_partner_logo(existing['logo'])
                logo_path = None
            
            # Build updated data
            updated_data = {
                'short_name': short_name,
                'name': name,
                'country': country,
                'role': role,
                'description': description,
                'website': website,
                'is_consortium': is_consortium,
                'display_order': display_order,
                'is_published': is_published,
                'tags': tags,
                'ecosystem_impact': ecosystem_impact,
                'updated_at': datetime.now().isoformat()
            }
            
            if logo_path:
                updated_data['logo'] = logo_path
            elif remove_logo:
                updated_data['logo'] = None
            
            # Keep created_at from existing
            updated_data['created_at'] = existing.get('created_at', datetime.now().isoformat())
            
            # Save to JSON
            result = json_service.update('partners.json', id, updated_data)
            
            audit.log_action(
                user=current_user.username,
                action='UPDATE_PARTNER',
                details={'id': id, 'short_name': short_name}
            )
            
            if result:
                return jsonify({
                    'success': True,
                    'data': result,
                    'message': 'Partner updated successfully'
                })
            else:
                return jsonify({
                    'success': False,
                    'error': 'Failed to update partner'
                }), 500
        
        else:
            # ============================================================
            # ✅ HANDLE JSON (No file upload)
            # ============================================================
            data = request.get_json()
            if not data:
                return jsonify({'success': False, 'error': 'No data provided'}), 400
            
            if data.get('name'):
                data['name'] = sanitize_html(data['name'].strip())
            if data.get('short_name'):
                data['short_name'] = sanitize_html(data['short_name'].strip())
            if data.get('country'):
                data['country'] = sanitize_html(data['country'].strip())
            
            data['updated_at'] = datetime.now().isoformat()
            result = json_service.update('partners.json', id, data)
            
            if not result:
                return jsonify({'error': 'Not found'}), 404
            
            audit.log_action(
                user=current_user.username,
                action='UPDATE_PARTNER',
                details={'id': id, 'name': data.get('name')}
            )
            
            return jsonify({'success': True, 'data': result, 'message': 'Partner updated successfully'})
        
    except Exception as e:
        audit.log_action(
            user=current_user.username if current_user.is_authenticated else 'Unknown',
            action='UPDATE_PARTNER_ERROR',
            details={'id': id, 'error': str(e)}
        )
        return jsonify({'success': False, 'error': str(e)}), 400
    

@api_bp.route('/partners/<int:id>', methods=['DELETE'])
@limiter.limit("10 per minute")
@login_required
def api_delete_partner(id):
    """Delete a partner and remove associated logo from disk."""
    try:
        partner = json_service.get_by_id('partners.json', id)
        
        if partner:
            # Delete logo from disk if exists
            if partner.get('logo'):
                delete_partner_logo(partner['logo'])
            
            audit.log_action(
                user=current_user.username,
                action='DELETE_PARTNER',
                details={'id': id, 'name': partner.get('name')}
            )
        
        result = json_service.delete('partners.json', id)
        if not result:
            return jsonify({'error': 'Not found'}), 404
        
        return jsonify({'success': True, 'message': 'Partner deleted successfully'})
    except Exception as e:
        audit.log_action(
            user=current_user.username if current_user.is_authenticated else 'Unknown',
            action='DELETE_PARTNER_ERROR',
            details={'id': id, 'error': str(e)}
        )
        return jsonify({'success': False, 'error': str(e)}), 400


# ================================================================
# API - Team Members
# ================================================================

@api_bp.route('/team/', methods=['GET'])
@login_required
def api_get_team():
    team = json_service.get_all('team.json')
    return jsonify(team)


@api_bp.route('/team/', methods=['POST'])
@limiter.limit("30 per minute")
@login_required
def api_create_team():
    """
    Create a new team member with optional photo upload.
    Supports both FormData (with photo) and JSON.
    """
    try:
        # ============================================================
        # CHECK IF REQUEST IS FORM DATA (with photo) OR JSON
        # ============================================================
        is_form_data = request.content_type and 'multipart/form-data' in request.content_type
        
        if is_form_data:
            # ============================================================
            # ✅ HANDLE FORM DATA WITH PHOTO UPLOAD
            # ============================================================
            
            # Get fields from request.form
            name = request.form.get('name', '').strip()
            role = request.form.get('role', '').strip()
            affiliation = request.form.get('affiliation', '').strip()
            bio = request.form.get('bio', '').strip()
            email = request.form.get('email', '').strip()
            display_order = request.form.get('display_order', 0)
            is_visible = request.form.get('is_visible', 'true').lower() == 'true'
            consent_status = request.form.get('consent_status', 'pending').strip()
            
            # Validate required fields
            if not name:
                return jsonify({'success': False, 'error': 'Name is required'}), 400
            if not role:
                return jsonify({'success': False, 'error': 'Role is required'}), 400
            
            # Sanitize inputs
            name = sanitize_html(name)
            role = sanitize_html(role)
            if affiliation:
                affiliation = sanitize_html(affiliation)
            if bio:
                bio = sanitize_html(bio)
            if email:
                email = sanitize_html(email)
            
            # ============================================================
            # ✅ HANDLE PHOTO UPLOAD
            # ============================================================
            photo_path = None
            if 'photo' in request.files:
                file = request.files['photo']
                if file and file.filename:
                    filename = save_uploaded_file(file, 'team')
                    if filename:
                        photo_path = f"uploads/team/{filename}"
            
            # Build team member data
            team_data = {
                'name': name,
                'role': role,
                'created_at': datetime.now().isoformat(),
                'updated_at': datetime.now().isoformat(),
                'is_visible': is_visible,
                'consent_status': consent_status
            }
            
            # Add optional fields if they have values
            if affiliation:
                team_data['affiliation'] = affiliation
            if bio:
                team_data['bio'] = bio
            if email:
                team_data['email'] = email
            if display_order:
                team_data['display_order'] = int(display_order)
            if photo_path:
                team_data['photo'] = photo_path
            
            print(f"FormData - Team data to save: {team_data}")
            
            # Save to JSON
            result = json_service.create('team.json', team_data)
            
            audit.log_action(
                user=current_user.username,
                action='CREATE_TEAM_MEMBER',
                details={'name': name, 'has_photo': bool(photo_path)}
            )
            
            if result:
                return jsonify({
                    'success': True,
                    'data': result,
                    'message': 'Team member created successfully'
                })
            else:
                return jsonify({
                    'success': False,
                    'error': 'Failed to save team member to JSON'
                }), 500
        
        else:
            # ============================================================
            # ✅ HANDLE JSON (No file upload - compatibility)
            # ============================================================
            data = request.get_json()
            if not data:
                return jsonify({'success': False, 'error': 'No data provided'}), 400
            
            if not data.get('name'):
                return jsonify({'success': False, 'error': 'Name is required'}), 400
            if not data.get('role'):
                return jsonify({'success': False, 'error': 'Role is required'}), 400
            
            data['name'] = sanitize_html(data['name'].strip())
            data['role'] = sanitize_html(data['role'].strip())
            if data.get('affiliation'):
                data['affiliation'] = sanitize_html(data['affiliation'].strip())
            if data.get('bio'):
                data['bio'] = sanitize_html(data['bio'].strip())
            if data.get('email'):
                data['email'] = sanitize_html(data['email'].strip())
            
            data['created_at'] = datetime.now().isoformat()
            data['updated_at'] = datetime.now().isoformat()
            data['is_visible'] = data.get('is_visible', True)
            data['consent_status'] = data.get('consent_status', 'pending')
            
            result = json_service.create('team.json', data)
            
            audit.log_action(
                user=current_user.username,
                action='CREATE_TEAM_MEMBER',
                details={'name': data['name']}
            )
            
            if result:
                return jsonify({'success': True, 'data': result, 'message': 'Team member created successfully'})
            else:
                return jsonify({'success': False, 'error': 'Failed to save team member'}), 500
        
    except Exception as e:
        audit.log_action(
            user=current_user.username if current_user.is_authenticated else 'Unknown',
            action='CREATE_TEAM_MEMBER_ERROR',
            details={'error': str(e)}
        )
        return jsonify({'success': False, 'error': str(e)}), 400


@api_bp.route('/team/<int:id>', methods=['GET'])
@login_required
def api_get_team_member(id):
    member = json_service.get_by_id('team.json', id)
    if not member:
        return jsonify({'error': 'Not found'}), 404
    return jsonify(member)


@api_bp.route('/team/<int:id>', methods=['PUT'])
@limiter.limit("30 per minute")
@login_required
def api_update_team(id):
    """
    Update a team member with optional photo replacement.
    Supports both FormData (with photo) and JSON.
    """
    try:
        # Get existing team member
        existing = json_service.get_by_id('team.json', id)
        if not existing:
            return jsonify({'error': 'Team member not found'}), 404
        
        # ============================================================
        # CHECK IF REQUEST IS FORM DATA (with photo) OR JSON
        # ============================================================
        is_form_data = request.content_type and 'multipart/form-data' in request.content_type
        
        if is_form_data:
            # ============================================================
            # ✅ HANDLE FORM DATA WITH PHOTO REPLACEMENT
            # ============================================================
            
            # Get fields from request.form
            name = request.form.get('name', '').strip()
            role = request.form.get('role', '').strip()
            affiliation = request.form.get('affiliation', '').strip()
            bio = request.form.get('bio', '').strip()
            email = request.form.get('email', '').strip()
            display_order = request.form.get('display_order', 0)
            is_visible = request.form.get('is_visible', 'true').lower() == 'true'
            consent_status = request.form.get('consent_status', 'pending').strip()
            
            # Validate required fields
            if not name:
                return jsonify({'success': False, 'error': 'Name is required'}), 400
            if not role:
                return jsonify({'success': False, 'error': 'Role is required'}), 400
            
            # Sanitize inputs
            name = sanitize_html(name)
            role = sanitize_html(role)
            if affiliation:
                affiliation = sanitize_html(affiliation)
            if bio:
                bio = sanitize_html(bio)
            if email:
                email = sanitize_html(email)
            
            # ============================================================
            # ✅ HANDLE PHOTO REPLACEMENT
            # ============================================================
            photo_path = existing.get('photo')  # Keep existing by default
            
            if 'photo' in request.files:
                file = request.files['photo']
                if file and file.filename:
                    # Delete old photo if exists
                    if existing.get('photo'):
                        delete_uploaded_file(existing['photo'])
                    
                    # Save new photo
                    filename = save_uploaded_file(file, 'team')
                    if filename:
                        photo_path = f"uploads/team/{filename}"
            
            # Check for removal flag
            remove_photo = request.form.get('remove_photo', 'false').lower() == 'true'
            if remove_photo and existing.get('photo'):
                delete_uploaded_file(existing['photo'])
                photo_path = None
            
            # Build updated data
            updated_data = {
                'name': name,
                'role': role,
                'updated_at': datetime.now().isoformat(),
                'is_visible': is_visible,
                'consent_status': consent_status
            }
            
            # Add optional fields if they have values
            if affiliation:
                updated_data['affiliation'] = affiliation
            if bio:
                updated_data['bio'] = bio
            if email:
                updated_data['email'] = email
            if display_order:
                updated_data['display_order'] = int(display_order)
            if photo_path:
                updated_data['photo'] = photo_path
            elif remove_photo:
                updated_data['photo'] = None
            
            # Keep created_at from existing
            updated_data['created_at'] = existing.get('created_at', datetime.now().isoformat())
            
            print(f"FormData - Updated team data: {updated_data}")
            
            # Save to JSON
            result = json_service.update('team.json', id, updated_data)
            
            audit.log_action(
                user=current_user.username,
                action='UPDATE_TEAM_MEMBER',
                details={'id': id, 'name': name}
            )
            
            if not result:
                return jsonify({'error': 'Not found'}), 404
            
            return jsonify({'success': True, 'data': result, 'message': 'Team member updated successfully'})
        
        else:
            # ============================================================
            # ✅ HANDLE JSON (No file upload)
            # ============================================================
            data = request.get_json()
            if not data:
                return jsonify({'success': False, 'error': 'No data provided'}), 400
            
            if data.get('name'):
                data['name'] = sanitize_html(data['name'].strip())
            if data.get('role'):
                data['role'] = sanitize_html(data['role'].strip())
            if data.get('affiliation'):
                data['affiliation'] = sanitize_html(data['affiliation'].strip())
            if data.get('bio'):
                data['bio'] = sanitize_html(data['bio'].strip())
            if data.get('email'):
                data['email'] = sanitize_html(data['email'].strip())
            
            data['updated_at'] = datetime.now().isoformat()
            result = json_service.update('team.json', id, data)
            
            if not result:
                return jsonify({'error': 'Not found'}), 404
            
            audit.log_action(
                user=current_user.username,
                action='UPDATE_TEAM_MEMBER',
                details={'id': id, 'name': data.get('name')}
            )
            
            return jsonify({'success': True, 'data': result, 'message': 'Team member updated successfully'})
        
    except Exception as e:
        audit.log_action(
            user=current_user.username if current_user.is_authenticated else 'Unknown',
            action='UPDATE_TEAM_MEMBER_ERROR',
            details={'id': id, 'error': str(e)}
        )
        return jsonify({'success': False, 'error': str(e)}), 400


@api_bp.route('/team/<int:id>', methods=['DELETE'])
@limiter.limit("10 per minute")
@login_required
def api_delete_team(id):
    """Delete a team member and remove associated photo from disk."""
    try:
        member = json_service.get_by_id('team.json', id)
        
        if member:
            # Delete photo from disk if exists
            if member.get('photo'):
                delete_uploaded_file(member['photo'])
            
            audit.log_action(
                user=current_user.username,
                action='DELETE_TEAM_MEMBER',
                details={'id': id, 'name': member.get('name')}
            )
        
        result = json_service.delete('team.json', id)
        if not result:
            return jsonify({'error': 'Not found'}), 404
        
        return jsonify({'success': True, 'message': 'Team member deleted successfully'})
    except Exception as e:
        audit.log_action(
            user=current_user.username if current_user.is_authenticated else 'Unknown',
            action='DELETE_TEAM_MEMBER_ERROR',
            details={'id': id, 'error': str(e)}
        )
        return jsonify({'success': False, 'error': str(e)}), 400


# ================================================================
# API - FAQs
# ================================================================

@api_bp.route('/faqs/', methods=['GET'])
@login_required
def api_get_faqs():
    faqs = json_service.get_all('faqs.json')
    return jsonify(faqs)


@api_bp.route('/faqs/', methods=['POST'])
@limiter.limit("30 per minute")
@login_required
def api_create_faq():
    data = request.get_json()
    try:
        if not data.get('question') or not data.get('answer'):
            return jsonify({'success': False, 'error': 'Question and Answer are required'}), 400
        
        data['question'] = sanitize_html(data['question'].strip())
        data['answer'] = sanitize_html(data['answer'].strip())
        
        data['created_at'] = datetime.now().isoformat()
        data['updated_at'] = datetime.now().isoformat()
        result = json_service.create('faqs.json', data)
        
        audit.log_action(
            user=current_user.username,
            action='CREATE_FAQ',
            details={'question': data['question']}
        )
        return jsonify({'success': True, 'data': result, 'message': 'FAQ created successfully'})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 400


@api_bp.route('/faqs/<int:id>', methods=['GET'])
@login_required
def api_get_faq(id):
    faq = json_service.get_by_id('faqs.json', id)
    if not faq:
        return jsonify({'error': 'Not found'}), 404
    return jsonify(faq)


@api_bp.route('/faqs/<int:id>', methods=['PUT'])
@limiter.limit("30 per minute")
@login_required
def api_update_faq(id):
    data = request.get_json()
    try:
        if data.get('question'):
            data['question'] = sanitize_html(data['question'].strip())
        if data.get('answer'):
            data['answer'] = sanitize_html(data['answer'].strip())
        
        data['updated_at'] = datetime.now().isoformat()
        result = json_service.update('faqs.json', id, data)
        if not result:
            return jsonify({'error': 'Not found'}), 404
        
        audit.log_action(
            user=current_user.username,
            action='UPDATE_FAQ',
            details={'id': id, 'question': data.get('question')}
        )
        return jsonify({'success': True, 'data': result, 'message': 'FAQ updated successfully'})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 400


@api_bp.route('/faqs/<int:id>', methods=['DELETE'])
@limiter.limit("10 per minute")
@login_required
def api_delete_faq(id):
    try:
        faq = json_service.get_by_id('faqs.json', id)
        if faq:
            audit.log_action(
                user=current_user.username,
                action='DELETE_FAQ',
                details={'id': id, 'question': faq.get('question')}
            )
        result = json_service.delete('faqs.json', id)
        if not result:
            return jsonify({'error': 'Not found'}), 404
        return jsonify({'success': True, 'message': 'FAQ deleted successfully'})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 400


# ================================================================
# API - Gallery Albums
# ================================================================

@api_bp.route('/gallery/', methods=['GET'])
@login_required
def api_get_gallery():
    albums = json_service.get_all('gallery.json')
    return jsonify(albums)


@api_bp.route('/gallery/', methods=['POST'])
@limiter.limit("30 per minute")
@login_required
def api_create_gallery():
    """
    Create a new gallery album with optional image uploads.
    Supports both FormData (with images) and JSON.
    """
    try:
        # ============================================================
        # CHECK IF REQUEST IS FORM DATA (with images) OR JSON
        # ============================================================
        is_form_data = request.content_type and 'multipart/form-data' in request.content_type
        
        if is_form_data:
            # ============================================================
            # ✅ HANDLE FORM DATA WITH IMAGE UPLOADS
            # ============================================================
            
            # Get fields from request.form
            title = request.form.get('title', '').strip()
            date = request.form.get('date', '').strip()
            location = request.form.get('location', '').strip()
            description = request.form.get('description', '').strip()
            is_published = request.form.get('is_published', 'true').lower() == 'true'
            consent_confirmed = request.form.get('consent_confirmed', 'false').lower() == 'true'
            tags = request.form.get('tags', '').split(',') if request.form.get('tags') else []
            
            # Validate required fields
            if not title:
                return jsonify({'success': False, 'error': 'Album title is required'}), 400
            
            # Sanitize inputs
            title = sanitize_html(title)
            if location:
                location = sanitize_html(location)
            if description:
                description = sanitize_html(description)
            tags = [sanitize_html(t.strip()) for t in tags if t.strip()]
            
            # Create slug
            slug = slugify(title)
            if not slug:
                slug = f"album-{int(datetime.now().timestamp())}"
            
            # ============================================================
            # ✅ HANDLE IMAGE UPLOADS
            # ============================================================
            uploaded_images = []
            if 'images' in request.files:
                files = request.files.getlist('images')
                for idx, file in enumerate(files):
                    if file and file.filename:
                        saved_path = save_gallery_image(file)
                        if saved_path:
                            uploaded_images.append({
                                'id': idx + 1,
                                'image_path': saved_path,
                                'caption': '',
                                'alt_text': '',
                                'is_approved': True,
                                'is_featured': (idx == 0),  # First image becomes featured
                                'display_order': idx
                            })
            
            # Build album data
            album_data = {
                'title': title,
                'slug': slug,
                'date': date,
                'location': location,
                'description': description,
                'is_published': is_published,
                'consent_confirmed': consent_confirmed,
                'tags': tags,
                'images': uploaded_images,
                'created_at': datetime.now().isoformat(),
                'updated_at': datetime.now().isoformat()
            }
            
            # Save to JSON
            result = json_service.create('gallery.json', album_data)
            
            audit.log_action(
                user=current_user.username,
                action='CREATE_GALLERY_ALBUM',
                details={'title': title, 'image_count': len(uploaded_images)}
            )
            
            if result:
                return jsonify({
                    'success': True,
                    'data': result,
                    'message': f'Album created successfully with {len(uploaded_images)} images'
                })
            else:
                return jsonify({
                    'success': False,
                    'error': 'Failed to save album to JSON'
                }), 500
        
        else:
            # ============================================================
            # ✅ HANDLE JSON (No file upload - existing logic)
            # ============================================================
            data = request.get_json()
            if not data:
                return jsonify({'success': False, 'error': 'No data provided'}), 400
            
            if not data.get('title'):
                return jsonify({'success': False, 'error': 'Album title is required'}), 400
            
            data['title'] = sanitize_html(data['title'].strip())
            if not data.get('slug'):
                data['slug'] = slugify(data['title'])
            data['created_at'] = datetime.now().isoformat()
            data['updated_at'] = datetime.now().isoformat()
            result = json_service.create('gallery.json', data)
            
            audit.log_action(
                user=current_user.username,
                action='CREATE_GALLERY_ALBUM',
                details={'title': data['title']}
            )
            
            if result:
                return jsonify({'success': True, 'data': result, 'message': 'Album created successfully'})
            else:
                return jsonify({'success': False, 'error': 'Failed to save album'}), 500
        
    except Exception as e:
        audit.log_action(
            user=current_user.username if current_user.is_authenticated else 'Unknown',
            action='CREATE_GALLERY_ALBUM_ERROR',
            details={'error': str(e)}
        )
        print(f"Error creating gallery album: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({'success': False, 'error': str(e)}), 400

@api_bp.route('/gallery/<int:id>', methods=['GET'])
@login_required
def api_get_gallery_album(id):
    album = json_service.get_by_id('gallery.json', id)
    if not album:
        return jsonify({'error': 'Not found'}), 404
    return jsonify(album)


@api_bp.route('/gallery/<int:id>', methods=['PUT'])
@limiter.limit("30 per minute")
@login_required
def api_update_gallery_album(id):
    """
    Update a gallery album with optional image uploads.
    Supports both FormData (with images) and JSON.
    """
    try:
        # Get existing album
        existing = json_service.get_by_id('gallery.json', id)
        if not existing:
            return jsonify({'error': 'Album not found'}), 404
        
        # ============================================================
        # CHECK IF REQUEST IS FORM DATA (with images) OR JSON
        # ============================================================
        is_form_data = request.content_type and 'multipart/form-data' in request.content_type
        
        if is_form_data:
            # ============================================================
            # ✅ HANDLE FORM DATA WITH IMAGE UPLOADS
            # ============================================================
            
            # Get fields from request.form
            title = request.form.get('title', '').strip()
            date = request.form.get('date', '').strip()
            location = request.form.get('location', '').strip()
            description = request.form.get('description', '').strip()
            is_published = request.form.get('is_published', 'true').lower() == 'true'
            consent_confirmed = request.form.get('consent_confirmed', 'false').lower() == 'true'
            tags = request.form.get('tags', '').split(',') if request.form.get('tags') else []
            
            # Validate required fields
            if not title:
                return jsonify({'success': False, 'error': 'Album title is required'}), 400
            
            # Sanitize inputs
            title = sanitize_html(title)
            if location:
                location = sanitize_html(location)
            if description:
                description = sanitize_html(description)
            tags = [sanitize_html(t.strip()) for t in tags if t.strip()]
            
            # Create slug
            slug = slugify(title)
            if not slug:
                slug = f"album-{int(datetime.now().timestamp())}"
            
            # ============================================================
            # ✅ HANDLE NEW IMAGE UPLOADS
            # ============================================================
            existing_images = existing.get('images', [])
            new_images = []
            
            # Get the next available ID
            next_id = max([img.get('id', 0) for img in existing_images]) + 1 if existing_images else 1
            
            if 'images' in request.files:
                files = request.files.getlist('images')
                for idx, file in enumerate(files):
                    if file and file.filename:
                        saved_path = save_gallery_image(file)
                        if saved_path:
                            new_images.append({
                                'id': next_id + idx,
                                'image_path': saved_path,
                                'caption': '',
                                'alt_text': '',
                                'is_approved': True,
                                'is_featured': False,  # Only existing featured remains
                                'display_order': len(existing_images) + idx
                            })
            
            # Combine existing + new images
            all_images = existing_images + new_images
            
            # ============================================================
            # ✅ HANDLE REMOVED IMAGES (via keep_image_ids)
            # ============================================================
            keep_ids = request.form.get('keep_image_ids', '')
            if keep_ids:
                keep_ids_list = [int(x.strip()) for x in keep_ids.split(',') if x.strip()]
                # Filter to keep only those IDs
                all_images = [img for img in all_images if img.get('id') in keep_ids_list]
                # Delete removed image files
                for img in existing_images:
                    if img.get('id') not in keep_ids_list:
                        delete_gallery_image_file(img.get('image_path', ''))
            
            # Build updated data
            updated_data = {
                'title': title,
                'slug': slug,
                'date': date,
                'location': location,
                'description': description,
                'is_published': is_published,
                'consent_confirmed': consent_confirmed,
                'tags': tags,
                'images': all_images,
                'updated_at': datetime.now().isoformat()
            }
            
            # Keep created_at from existing
            updated_data['created_at'] = existing.get('created_at', datetime.now().isoformat())
            
            # Save to JSON
            result = json_service.update('gallery.json', id, updated_data)
            
            audit.log_action(
                user=current_user.username,
                action='UPDATE_GALLERY_ALBUM',
                details={'id': id, 'title': title, 'new_images': len(new_images)}
            )
            
            if result:
                return jsonify({
                    'success': True,
                    'data': result,
                    'message': f'Album updated successfully with {len(new_images)} new images'
                })
            else:
                return jsonify({
                    'success': False,
                    'error': 'Failed to update album'
                }), 500
        
        else:
            # ============================================================
            # ✅ HANDLE JSON (No file upload - existing logic)
            # ============================================================
            data = request.get_json()
            if not data:
                return jsonify({'success': False, 'error': 'No data provided'}), 400
            
            if data.get('title'):
                data['title'] = sanitize_html(data['title'].strip())
            data['updated_at'] = datetime.now().isoformat()
            result = json_service.update('gallery.json', id, data)
            
            if not result:
                return jsonify({'error': 'Not found'}), 404
            
            audit.log_action(
                user=current_user.username,
                action='UPDATE_GALLERY_ALBUM',
                details={'id': id, 'title': data.get('title')}
            )
            
            return jsonify({'success': True, 'data': result, 'message': 'Album updated successfully'})
        
    except Exception as e:
        audit.log_action(
            user=current_user.username if current_user.is_authenticated else 'Unknown',
            action='UPDATE_GALLERY_ALBUM_ERROR',
            details={'id': id, 'error': str(e)}
        )
        print(f"Error updating gallery album: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({'success': False, 'error': str(e)}), 400

@api_bp.route('/gallery/<int:id>', methods=['DELETE'])
@limiter.limit("10 per minute")
@login_required
def api_delete_gallery_album(id):
    try:
        album = json_service.get_by_id('gallery.json', id)
        
        if album:
            # Delete all images from disk
            images = album.get('images', [])
            for img in images:
                if img.get('image_path'):
                    delete_gallery_image_file(img['image_path'])
            
            audit.log_action(
                user=current_user.username,
                action='DELETE_GALLERY_ALBUM',
                details={'id': id, 'title': album.get('title'), 'image_count': len(images)}
            )
        
        result = json_service.delete('gallery.json', id)
        if not result:
            return jsonify({'error': 'Not found'}), 404
        
        return jsonify({'success': True, 'message': 'Album deleted successfully'})
    except Exception as e:
        audit.log_action(
            user=current_user.username if current_user.is_authenticated else 'Unknown',
            action='DELETE_GALLERY_ALBUM_ERROR',
            details={'id': id, 'error': str(e)}
        )
        return jsonify({'success': False, 'error': str(e)}), 400

# ================================================================
# Helper Function - Save Gallery Image
# ================================================================

def save_gallery_image(file):
    """
    Save a gallery image to the images/gallery/ folder.
    Creates album subfolder if needed.
    Returns the saved file path or None.
    """
    if not file or not file.filename:
        return None
    
    # Check if file is allowed
    if not allowed_file(file.filename):
        return None
    
    # Create gallery folder if it doesn't exist
    gallery_folder = os.path.join(current_app.root_path, 'static', 'images', 'gallery')
    os.makedirs(gallery_folder, exist_ok=True)
    
    # Get all existing album folders to determine next album ID
    existing_albums = [d for d in os.listdir(gallery_folder) 
                       if os.path.isdir(os.path.join(gallery_folder, d)) 
                       and d.startswith('album_')]
    
    next_album_num = 1
    for album in existing_albums:
        try:
            num = int(album.replace('album_', ''))
            if num >= next_album_num:
                next_album_num = num + 1
        except:
            pass
    
    album_folder_name = f"album_{next_album_num}"
    album_path = os.path.join(gallery_folder, album_folder_name)
    os.makedirs(album_path, exist_ok=True)
    
    # Generate unique filename with timestamp
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    original_name = secure_filename(file.filename)
    filename = f"{timestamp}_{original_name}"
    
    # Save file
    file_path = os.path.join(album_path, filename)
    file.save(file_path)
    
    return f"images/gallery/{album_folder_name}/{filename}"


# ================================================================
# Helper Function - Delete Gallery Image File
# ================================================================

def delete_gallery_image_file(file_path):
    """
    Delete a gallery image from the filesystem.
    Returns True if deleted or file doesn't exist, False on error.
    """
    if not file_path:
        return True
    
    full_path = os.path.join(current_app.root_path, 'static', file_path)
    
    if os.path.exists(full_path):
        try:
            os.remove(full_path)
            print(f"✅ Deleted gallery image: {full_path}")
            return True
        except Exception as e:
            print(f"❌ Could not delete gallery image: {e}")
            return False
    return True

# ================================================================
# API - Gallery Images
# ================================================================

@api_bp.route('/gallery/<int:album_id>/images/', methods=['GET'])
@login_required
def api_get_gallery_images(album_id):
    album = json_service.get_by_id('gallery.json', album_id)
    if not album:
        return jsonify({'error': 'Not found'}), 404
    return jsonify(album.get('images', []))


@api_bp.route('/gallery/images/', methods=['POST'])
@limiter.limit("30 per minute")
@login_required
def api_create_gallery_image():
    data = request.get_json()
    try:
        album_id = data.get('album_id')
        album = json_service.get_by_id('gallery.json', album_id)
        if not album:
            return jsonify({'error': 'Album not found'}), 404
        
        images = album.get('images', [])
        max_id = max([img.get('id', 0) for img in images]) if images else 0
        data['id'] = max_id + 1
        
        if data.get('caption'):
            data['caption'] = sanitize_html(data['caption'].strip())
        
        images.append(data)
        album['images'] = images
        album['updated_at'] = datetime.now().isoformat()
        json_service.update('gallery.json', album_id, album)
        
        audit.log_action(
            user=current_user.username,
            action='ADD_GALLERY_IMAGE',
            details={'album_id': album_id, 'caption': data.get('caption')}
        )
        return jsonify({'success': True, 'data': data, 'message': 'Image added successfully'})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 400


@api_bp.route('/gallery/images/<int:id>', methods=['PUT'])
@limiter.limit("30 per minute")
@login_required
def api_update_gallery_image(id):
    try:
        albums = json_service.get_all('gallery.json')
        data = request.get_json()
        
        if data.get('caption'):
            data['caption'] = sanitize_html(data['caption'].strip())
        
        for album in albums:
            images = album.get('images', [])
            for i, img in enumerate(images):
                if img.get('id') == id:
                    images[i] = {**img, **data}
                    album['images'] = images
                    album['updated_at'] = datetime.now().isoformat()
                    json_service.update('gallery.json', album['id'], album)
                    
                    audit.log_action(
                        user=current_user.username,
                        action='UPDATE_GALLERY_IMAGE',
                        details={'id': id, 'caption': data.get('caption')}
                    )
                    return jsonify({'success': True, 'message': 'Image updated successfully'})
        
        return jsonify({'error': 'Image not found'}), 404
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 400


@api_bp.route('/gallery/images/<int:id>', methods=['DELETE'])
@limiter.limit("10 per minute")
@login_required
def api_delete_gallery_image(id):
    try:
        albums = json_service.get_all('gallery.json')
        
        for album in albums:
            images = album.get('images', [])
            for i, img in enumerate(images):
                if img.get('id') == id:
                    # Delete the actual file
                    if img.get('image_path'):
                        delete_gallery_image_file(img['image_path'])
                    
                    # Remove from JSON
                    del images[i]
                    album['images'] = images
                    album['updated_at'] = datetime.now().isoformat()
                    json_service.update('gallery.json', album['id'], album)
                    
                    audit.log_action(
                        user=current_user.username,
                        action='DELETE_GALLERY_IMAGE',
                        details={'id': id}
                    )
                    return jsonify({'success': True, 'message': 'Image deleted successfully'})
        
        return jsonify({'error': 'Image not found'}), 404
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 400



# ================================================================
# API - Training Materials
# ================================================================

@api_bp.route('/training-materials/', methods=['GET'])
# ✅ REMOVED @login_required - Public pages need this!
def api_get_training_materials():
    """Get all training materials."""
    try:
        materials = json_service.get_all('training-materials.json')
        return jsonify(materials)
    except Exception as e:
        print(f"❌ Error getting training materials: {e}")
        return jsonify([])


@api_bp.route('/training-materials/', methods=['POST'])
@limiter.limit("30 per minute")
@login_required
def api_create_training_material():
    """
    Create a new training material with optional file upload.
    Supports both FormData (with file) and JSON.
    """
    try:
        # ============================================================
        # CHECK IF REQUEST IS FORM DATA (with file) OR JSON
        # ============================================================
        is_form_data = request.content_type and 'multipart/form-data' in request.content_type
        
        if is_form_data:
            # ============================================================
            # ✅ HANDLE FORM DATA WITH FILE UPLOAD
            # ============================================================
            
            # Get fields from request.form
            title = request.form.get('title', '').strip()
            slug = request.form.get('slug', '').strip()
            description = request.form.get('description', '').strip()
            level = request.form.get('level', 'beginner').strip()
            tags_raw = request.form.get('tags', '')
            resource_type = request.form.get('resource_type', 'training_guide').strip()
            language = request.form.get('language', 'English').strip()
            license = request.form.get('license', '').strip()
            is_public = request.form.get('is_public', 'true').lower() == 'true'
            display_order = request.form.get('display_order', 0)
            
            # Process tags
            tags = []
            if tags_raw:
                tags = [t.strip() for t in tags_raw.split(',') if t.strip()]
            
            # Validate required fields
            if not title:
                return jsonify({'success': False, 'error': 'Title is required'}), 400
            if not description:
                return jsonify({'success': False, 'error': 'Description is required'}), 400
            
            # Sanitize inputs
            title = sanitize_html(title)
            description = sanitize_html(description)
            if license:
                license = sanitize_html(license)
            
            # Auto-generate slug if not provided
            if not slug:
                slug = slugify(title)
                if not slug:
                    slug = f"material-{int(datetime.now().timestamp())}"
            
            # ============================================================
            # ✅ HANDLE FILE UPLOAD
            # ============================================================
            file_path = None
            if 'file' in request.files:
                file = request.files['file']
                if file and file.filename:
                    file_path = save_resource_file(file)
                    if not file_path:
                        return jsonify({'success': False, 'error': 'Invalid file type. Allowed: PDF, DOCX, PPT, MP4, ZIP, PNG, JPG, GIF, WEBP, SVG'}), 400
            
            # Validate: either file_path or external_url must be provided
            if not file_path:
                return jsonify({'success': False, 'error': 'A file upload is required'}), 400
            
            # Build training material data
            material_data = {
                'title': title,
                'slug': slug,
                'description': description,
                'level': level,
                'tags': tags,
                'resource_type': resource_type,
                'language': language,
                'is_public': is_public,
                'display_order': int(display_order),
                'created_at': datetime.now().isoformat(),
                'updated_at': datetime.now().isoformat()
            }
            
            if file_path:
                material_data['file_path'] = file_path
            if license:
                material_data['license'] = license
            
            print(f"FormData - Training material data to save: {material_data}")
            
            # Save to JSON
            result = json_service.create('training-materials.json', material_data)
            
            audit.log_action(
                user=current_user.username,
                action='CREATE_TRAINING_MATERIAL',
                details={'title': title, 'has_file': bool(file_path)}
            )
            
            if result:
                return jsonify({
                    'success': True,
                    'data': result,
                    'message': 'Training material created successfully'
                })
            else:
                return jsonify({
                    'success': False,
                    'error': 'Failed to save training material to JSON'
                }), 500
        
        else:
            # ============================================================
            # ✅ HANDLE JSON (No file upload - compatibility)
            # ============================================================
            data = request.get_json()
            if not data:
                return jsonify({'success': False, 'error': 'No data provided'}), 400
            
            if not data.get('title'):
                return jsonify({'success': False, 'error': 'Title is required'}), 400
            
            title = sanitize_html(data.get('title', '').strip())
            data['title'] = title
            
            if not data.get('slug'):
                data['slug'] = slugify(title)
            
            data['created_at'] = datetime.now().isoformat()
            data['updated_at'] = datetime.now().isoformat()
            
            result = json_service.create('training-materials.json', data)
            
            audit.log_action(
                user=current_user.username,
                action='CREATE_TRAINING_MATERIAL',
                details={'title': title}
            )
            
            if result:
                return jsonify({'success': True, 'data': result, 'message': 'Training material created successfully'})
            else:
                return jsonify({'success': False, 'error': 'Failed to save training material'}), 500
        
    except Exception as e:
        audit.log_action(
            user=current_user.username if current_user.is_authenticated else 'Unknown',
            action='CREATE_TRAINING_MATERIAL_ERROR',
            details={'error': str(e)}
        )
        return jsonify({'success': False, 'error': str(e)}), 400





@api_bp.route('/training-materials/<int:id>', methods=['GET'])
@login_required
def api_get_training_material(id):
    """Get a single training material by ID."""
    material = json_service.get_by_id('training-materials.json', id)
    if not material:
        return jsonify({'error': 'Not found'}), 404
    return jsonify(material)



@api_bp.route('/training-materials/<int:id>', methods=['PUT'])
@limiter.limit("30 per minute")
@login_required
def api_update_training_material(id):
    """
    Update a training material with optional file replacement.
    Supports both FormData (with file) and JSON.
    """
    try:
        # Get existing material
        existing = json_service.get_by_id('training-materials.json', id)
        if not existing:
            return jsonify({'error': 'Training material not found'}), 404
        
        # ============================================================
        # CHECK IF REQUEST IS FORM DATA (with file) OR JSON
        # ============================================================
        is_form_data = request.content_type and 'multipart/form-data' in request.content_type
        
        if is_form_data:
            # ============================================================
            # ✅ HANDLE FORM DATA WITH FILE REPLACEMENT
            # ============================================================
            
            # Get fields from request.form
            title = request.form.get('title', '').strip()
            slug = request.form.get('slug', '').strip()
            description = request.form.get('description', '').strip()
            level = request.form.get('level', 'beginner').strip()
            tags_raw = request.form.get('tags', '')
            resource_type = request.form.get('resource_type', 'training_guide').strip()
            language = request.form.get('language', 'English').strip()
            license = request.form.get('license', '').strip()
            is_public = request.form.get('is_public', 'true').lower() == 'true'
            display_order = request.form.get('display_order', 0)
            
            # Process tags
            tags = []
            if tags_raw:
                tags = [t.strip() for t in tags_raw.split(',') if t.strip()]
            
            # Validate required fields
            if not title:
                return jsonify({'success': False, 'error': 'Title is required'}), 400
            if not description:
                return jsonify({'success': False, 'error': 'Description is required'}), 400
            
            # Sanitize inputs
            title = sanitize_html(title)
            description = sanitize_html(description)
            if license:
                license = sanitize_html(license)
            
            # Auto-generate slug if not provided
            if not slug:
                slug = slugify(title)
                if not slug:
                    slug = f"material-{int(datetime.now().timestamp())}"
            
            # ============================================================
            # ✅ HANDLE FILE REPLACEMENT
            # ============================================================
            file_path = existing.get('file_path')  # Keep existing by default
            
            if 'file' in request.files:
                file = request.files['file']
                if file and file.filename:
                    # Delete old file if exists
                    if existing.get('file_path'):
                        delete_uploaded_file(existing['file_path'])
                    
                    # Save new file
                    new_file_path = save_resource_file(file)
                    if new_file_path:
                        file_path = new_file_path
                    else:
                        return jsonify({'success': False, 'error': 'Invalid file type. Allowed: PDF, DOCX, PPT, MP4, ZIP, PNG, JPG, GIF, WEBP, SVG'}), 400
            
            # Check for removal flag
            remove_file = request.form.get('remove_file', 'false').lower() == 'true'
            if remove_file and existing.get('file_path'):
                delete_uploaded_file(existing['file_path'])
                file_path = None
            
            # Validate: file_path must be provided
            if not file_path:
                return jsonify({'success': False, 'error': 'A file is required'}), 400
            
            # Build updated data
            updated_data = {
                'title': title,
                'slug': slug,
                'description': description,
                'level': level,
                'tags': tags,
                'resource_type': resource_type,
                'language': language,
                'is_public': is_public,
                'display_order': int(display_order),
                'updated_at': datetime.now().isoformat()
            }
            
            if file_path:
                updated_data['file_path'] = file_path
            if license:
                updated_data['license'] = license
            
            # Keep created_at from existing
            updated_data['created_at'] = existing.get('created_at', datetime.now().isoformat())
            
            print(f"FormData - Updated training material data: {updated_data}")
            
            # Save to JSON
            result = json_service.update('training-materials.json', id, updated_data)
            
            audit.log_action(
                user=current_user.username,
                action='UPDATE_TRAINING_MATERIAL',
                details={'id': id, 'title': title}
            )
            
            if not result:
                return jsonify({'error': 'Not found'}), 404
            
            return jsonify({'success': True, 'data': result, 'message': 'Training material updated successfully'})
        
        else:
            # ============================================================
            # ✅ HANDLE JSON (No file upload)
            # ============================================================
            data = request.get_json()
            if not data:
                return jsonify({'success': False, 'error': 'No data provided'}), 400
            
            if data.get('title'):
                data['title'] = sanitize_html(data['title'].strip())
            
            data['updated_at'] = datetime.now().isoformat()
            
            result = json_service.update('training-materials.json', id, data)
            
            if not result:
                return jsonify({'error': 'Not found'}), 404
            
            audit.log_action(
                user=current_user.username,
                action='UPDATE_TRAINING_MATERIAL',
                details={'id': id, 'title': data.get('title')}
            )
            
            return jsonify({'success': True, 'data': result, 'message': 'Training material updated successfully'})
        
    except Exception as e:
        audit.log_action(
            user=current_user.username if current_user.is_authenticated else 'Unknown',
            action='UPDATE_TRAINING_MATERIAL_ERROR',
            details={'id': id, 'error': str(e)}
        )
        return jsonify({'success': False, 'error': str(e)}), 400



@api_bp.route('/training-materials/<int:id>', methods=['DELETE'])
@limiter.limit("10 per minute")
@login_required
def api_delete_training_material(id):
    """Delete a training material and remove associated file from disk."""
    try:
        material = json_service.get_by_id('training-materials.json', id)
        
        if material:
            # Delete file from disk if exists
            if material.get('file_path'):
                delete_uploaded_file(material['file_path'])
            
            audit.log_action(
                user=current_user.username,
                action='DELETE_TRAINING_MATERIAL',
                details={'id': id, 'title': material.get('title')}
            )
        
        result = json_service.delete('training-materials.json', id)
        if not result:
            return jsonify({'error': 'Not found'}), 404
        
        return jsonify({'success': True, 'message': 'Training material deleted successfully'})
    except Exception as e:
        audit.log_action(
            user=current_user.username if current_user.is_authenticated else 'Unknown',
            action='DELETE_TRAINING_MATERIAL_ERROR',
            details={'id': id, 'error': str(e)}
        )
        return jsonify({'success': False, 'error': str(e)}), 400

# ================================================================
# API - Submissions
# ================================================================

@api_bp.route('/submissions/', methods=['GET'])
@login_required
def api_get_submissions():
    """Get all form submissions."""
    try:
        submissions = json_service.get_all('submissions.json')
        sorted_submissions = sorted(submissions, key=lambda x: x.get('submitted_at', ''), reverse=True)
        return jsonify(sorted_submissions)
    except Exception as e:
        print(f"❌ Error getting submissions: {e}")
        return jsonify([])


@api_bp.route('/submissions/<int:id>/', methods=['PUT'])
@limiter.limit("30 per minute")
@login_required
def api_update_submission(id):
    """Update a submission (e.g., mark as read)."""
    try:
        data = request.get_json()
        if not data:
            return jsonify({'success': False, 'error': 'No data provided'}), 400
        
        # ✅ Get existing submission first
        existing = json_service.get_by_id('submissions.json', id)
        if not existing:
            return jsonify({'success': False, 'error': 'Submission not found'}), 404
        
        # ✅ Update only the fields provided
        if 'is_read' in data:
            existing['is_read'] = data['is_read']
        if 'is_responded' in data:
            existing['is_responded'] = data['is_responded']
        
        # ✅ Save back to JSON
        result = json_service.update('submissions.json', id, existing)
        
        if result:
            audit.log_action(
                user=current_user.username,
                action='UPDATE_SUBMISSION',
                details={'id': id, 'is_read': existing.get('is_read')}
            )
            return jsonify({'success': True, 'message': 'Submission updated successfully'})
        else:
            return jsonify({'success': False, 'error': 'Failed to update submission'}), 400
            
    except Exception as e:
        print(f"❌ Error updating submission: {e}")
        return jsonify({'success': False, 'error': str(e)}), 400


@api_bp.route('/submissions/<int:id>/', methods=['DELETE'])
@limiter.limit("10 per minute")
@login_required
def api_delete_submission(id):
    """Delete a submission."""
    try:
        submission = json_service.get_by_id('submissions.json', id)
        if submission:
            audit.log_action(
                user=current_user.username,
                action='DELETE_SUBMISSION',
                details={'id': id}
            )
        
        result = json_service.delete('submissions.json', id)
        if not result:
            return jsonify({'success': False, 'error': 'Submission not found'}), 404
        
        return jsonify({'success': True, 'message': 'Submission deleted successfully'})
    except Exception as e:
        print(f"❌ Error deleting submission: {e}")
        return jsonify({'success': False, 'error': str(e)}), 400


@api_bp.route('/submissions/<int:id>/', methods=['GET'])
@login_required
def api_get_submission(id):
    """Get a single submission by ID for viewing details."""
    try:
        submission = json_service.get_by_id('submissions.json', id)
        if not submission:
            return jsonify({'error': 'Submission not found'}), 404
        return jsonify(submission)
    except Exception as e:
        print(f"❌ Error getting submission: {e}")
        return jsonify({'error': str(e)}), 400


@api_bp.route('/submissions/clear/', methods=['DELETE'])
@limiter.limit("5 per minute")
@login_required
def api_clear_submissions():
    """Delete all form submissions."""
    try:
        result = json_service.clear_all('submissions.json')
        if result:
            audit.log_action(
                user=current_user.username,
                action='CLEAR_SUBMISSIONS',
                details={}
            )
            return jsonify({'success': True, 'message': 'All submissions cleared successfully'})
        return jsonify({'success': False, 'error': 'Failed to clear submissions'}), 500
    except Exception as e:
        print(f"❌ Error clearing submissions: {e}")
        return jsonify({'success': False, 'error': str(e)}), 400



# ================================================================
# API - SME Challenges
# ================================================================

@api_bp.route('/challenges/', methods=['GET'])
@login_required
def api_get_challenges():
    """Get all challenges."""
    try:
        challenges = json_service.get_all('challenges.json')
        return jsonify(challenges)
    except Exception as e:
        print(f"❌ Error getting challenges: {e}")
        return jsonify([])


@api_bp.route('/challenges/', methods=['POST'])
@limiter.limit("30 per minute")
@login_required
def api_create_challenge():
    """Create a new challenge. Supports both FormData and JSON."""
    try:
        # ============================================================
        # CHECK IF REQUEST IS FORM DATA OR JSON
        # ============================================================
        is_form_data = request.content_type and 'multipart/form-data' in request.content_type
        
        if is_form_data:
            # ============================================================
            # ✅ HANDLE FORM DATA
            # ============================================================
            title = request.form.get('title', '').strip()
            description = request.form.get('description', '').strip()
            status = request.form.get('status', 'open').strip()
            deadline = request.form.get('deadline', '').strip()
            is_published = request.form.get('is_published', 'true').lower() == 'true'
            
            # Validate required fields
            if not title:
                return jsonify({'success': False, 'error': 'Title is required'}), 400
            if not description:
                return jsonify({'success': False, 'error': 'Description is required'}), 400
            
            # Sanitize
            title = sanitize_html(title)
            description = sanitize_html(description)
            
            # Auto-generate slug
            slug = slugify(title)
            if not slug:
                slug = f"challenge-{int(datetime.now().timestamp())}"
            
            # Build data
            challenge_data = {
                'title': title,
                'slug': slug,
                'description': description,
                'status': status,
                'deadline': deadline,
                'is_published': is_published,
                'created_at': datetime.now().isoformat(),
                'updated_at': datetime.now().isoformat()
            }
            
            print(f"FormData - Challenge data to save: {challenge_data}")
            
            result = json_service.create('challenges.json', challenge_data)
            
            audit.log_action(
                user=current_user.username,
                action='CREATE_CHALLENGE',
                details={'title': title}
            )
            
            if result:
                return jsonify({'success': True, 'data': result, 'message': 'Challenge created successfully'})
            else:
                return jsonify({'success': False, 'error': 'Failed to save challenge'}), 500
        
        else:
            # ============================================================
            # ✅ HANDLE JSON (original logic)
            # ============================================================
            data = request.get_json()
            if not data:
                return jsonify({'success': False, 'error': 'No data provided'}), 400
            
            if not data.get('title'):
                return jsonify({'success': False, 'error': 'Title is required'}), 400
            
            title = sanitize_html(data.get('title', '').strip())
            data['title'] = title
            
            if not data.get('slug'):
                data['slug'] = slugify(title)
            
            data['created_at'] = datetime.now().isoformat()
            data['updated_at'] = datetime.now().isoformat()
            
            result = json_service.create('challenges.json', data)
            
            audit.log_action(
                user=current_user.username,
                action='CREATE_CHALLENGE',
                details={'title': title}
            )
            
            if result:
                return jsonify({'success': True, 'data': result, 'message': 'Challenge created successfully'})
            else:
                return jsonify({'success': False, 'error': 'Failed to save challenge'}), 500
        
    except Exception as e:
        audit.log_action(
            user=current_user.username if current_user.is_authenticated else 'Unknown',
            action='CREATE_CHALLENGE_ERROR',
            details={'error': str(e)}
        )
        return jsonify({'success': False, 'error': str(e)}), 400

@api_bp.route('/challenges/<int:id>', methods=['GET'])
@login_required
def api_get_challenge(id):
    """Get a single challenge by ID."""
    challenge = json_service.get_by_id('challenges.json', id)
    if not challenge:
        return jsonify({'error': 'Not found'}), 404
    return jsonify(challenge)


@api_bp.route('/challenges/<int:id>', methods=['PUT'])
@limiter.limit("30 per minute")
@login_required
def api_update_challenge(id):
    """Update a challenge. Supports both FormData and JSON."""
    try:
        # Get existing
        existing = json_service.get_by_id('challenges.json', id)
        if not existing:
            return jsonify({'error': 'Not found'}), 404
        
        # ============================================================
        # CHECK IF REQUEST IS FORM DATA OR JSON
        # ============================================================
        is_form_data = request.content_type and 'multipart/form-data' in request.content_type
        
        if is_form_data:
            # ============================================================
            # ✅ HANDLE FORM DATA
            # ============================================================
            title = request.form.get('title', '').strip()
            description = request.form.get('description', '').strip()
            status = request.form.get('status', 'open').strip()
            deadline = request.form.get('deadline', '').strip()
            is_published = request.form.get('is_published', 'true').lower() == 'true'
            
            if not title:
                return jsonify({'success': False, 'error': 'Title is required'}), 400
            
            # Sanitize
            title = sanitize_html(title)
            description = sanitize_html(description) if description else existing.get('description', '')
            
            # Auto-generate slug
            slug = slugify(title)
            if not slug:
                slug = f"challenge-{int(datetime.now().timestamp())}"
            
            # Build updated data
            updated_data = {
                'title': title,
                'slug': slug,
                'description': description,
                'status': status,
                'deadline': deadline or existing.get('deadline', ''),
                'is_published': is_published,
                'updated_at': datetime.now().isoformat(),
                'created_at': existing.get('created_at', datetime.now().isoformat())
            }
            
            result = json_service.update('challenges.json', id, updated_data)
            
            audit.log_action(
                user=current_user.username,
                action='UPDATE_CHALLENGE',
                details={'id': id, 'title': title}
            )
            
            if result:
                return jsonify({'success': True, 'data': result, 'message': 'Challenge updated successfully'})
            else:
                return jsonify({'success': False, 'error': 'Failed to update challenge'}), 500
        
        else:
            # ============================================================
            # ✅ HANDLE JSON (original logic)
            # ============================================================
            data = request.get_json()
            if not data:
                return jsonify({'success': False, 'error': 'No data provided'}), 400
            
            if data.get('title'):
                data['title'] = sanitize_html(data['title'].strip())
            
            data['updated_at'] = datetime.now().isoformat()
            
            result = json_service.update('challenges.json', id, data)
            
            audit.log_action(
                user=current_user.username,
                action='UPDATE_CHALLENGE',
                details={'id': id, 'title': data.get('title')}
            )
            
            if result:
                return jsonify({'success': True, 'data': result, 'message': 'Challenge updated successfully'})
            else:
                return jsonify({'success': False, 'error': 'Failed to update challenge'}), 500
        
    except Exception as e:
        audit.log_action(
            user=current_user.username if current_user.is_authenticated else 'Unknown',
            action='UPDATE_CHALLENGE_ERROR',
            details={'id': id, 'error': str(e)}
        )
        return jsonify({'success': False, 'error': str(e)}), 400

@api_bp.route('/challenges/<int:id>', methods=['DELETE'])
@limiter.limit("10 per minute")
@login_required
def api_delete_challenge(id):
    """Delete a challenge."""
    try:
        challenge = json_service.get_by_id('challenges.json', id)
        if challenge:
            audit.log_action(
                user=current_user.username,
                action='DELETE_CHALLENGE',
                details={'id': id, 'title': challenge.get('title')}
            )
        
        result = json_service.delete('challenges.json', id)
        if not result:
            return jsonify({'error': 'Not found'}), 404
        return jsonify({'success': True, 'message': 'Challenge deleted successfully'})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 400


# ================================================================
# API - SME Hackathons
# ================================================================

@api_bp.route('/hackathons/', methods=['GET'])
@login_required
def api_get_hackathons():
    """Get all hackathons."""
    try:
        hackathons = json_service.get_all('hackathons.json')
        return jsonify(hackathons)
    except Exception as e:
        print(f"❌ Error getting hackathons: {e}")
        return jsonify([])


@api_bp.route('/hackathons/', methods=['POST'])
@limiter.limit("30 per minute")
@login_required
def api_create_hackathon():
    """Create a new hackathon. Supports both FormData and JSON."""
    try:
        # ============================================================
        # CHECK IF REQUEST IS FORM DATA OR JSON
        # ============================================================
        is_form_data = request.content_type and 'multipart/form-data' in request.content_type
        
        if is_form_data:
            # ============================================================
            # ✅ HANDLE FORM DATA
            # ============================================================
            title = request.form.get('title', '').strip()
            description = request.form.get('description', '').strip()
            date = request.form.get('date', '').strip()
            location = request.form.get('location', '').strip()
            status = request.form.get('status', 'upcoming').strip()
            is_published = request.form.get('is_published', 'true').lower() == 'true'
            
            # Validate required fields
            if not title:
                return jsonify({'success': False, 'error': 'Title is required'}), 400
            if not description:
                return jsonify({'success': False, 'error': 'Description is required'}), 400
            if not date:
                return jsonify({'success': False, 'error': 'Date is required'}), 400
            
            # Sanitize
            title = sanitize_html(title)
            description = sanitize_html(description)
            if location:
                location = sanitize_html(location)
            
            # Auto-generate slug
            slug = slugify(title)
            if not slug:
                slug = f"hackathon-{int(datetime.now().timestamp())}"
            
            # Build data
            hackathon_data = {
                'title': title,
                'slug': slug,
                'description': description,
                'date': date,
                'location': location,
                'status': status,
                'is_published': is_published,
                'created_at': datetime.now().isoformat(),
                'updated_at': datetime.now().isoformat()
            }
            
            result = json_service.create('hackathons.json', hackathon_data)
            
            audit.log_action(
                user=current_user.username,
                action='CREATE_HACKATHON',
                details={'title': title}
            )
            
            if result:
                return jsonify({'success': True, 'data': result, 'message': 'Hackathon created successfully'})
            else:
                return jsonify({'success': False, 'error': 'Failed to save hackathon'}), 500
        
        else:
            # ============================================================
            # ✅ HANDLE JSON (original logic)
            # ============================================================
            data = request.get_json()
            if not data:
                return jsonify({'success': False, 'error': 'No data provided'}), 400
            
            if not data.get('title'):
                return jsonify({'success': False, 'error': 'Title is required'}), 400
            
            title = sanitize_html(data.get('title', '').strip())
            data['title'] = title
            
            if not data.get('slug'):
                data['slug'] = slugify(title)
            
            data['created_at'] = datetime.now().isoformat()
            data['updated_at'] = datetime.now().isoformat()
            
            result = json_service.create('hackathons.json', data)
            
            audit.log_action(
                user=current_user.username,
                action='CREATE_HACKATHON',
                details={'title': title}
            )
            
            if result:
                return jsonify({'success': True, 'data': result, 'message': 'Hackathon created successfully'})
            else:
                return jsonify({'success': False, 'error': 'Failed to save hackathon'}), 500
        
    except Exception as e:
        audit.log_action(
            user=current_user.username if current_user.is_authenticated else 'Unknown',
            action='CREATE_HACKATHON_ERROR',
            details={'error': str(e)}
        )
        return jsonify({'success': False, 'error': str(e)}), 400



@api_bp.route('/hackathons/<int:id>', methods=['GET'])
@login_required
def api_get_hackathon(id):
    """Get a single hackathon by ID."""
    hackathon = json_service.get_by_id('hackathons.json', id)
    if not hackathon:
        return jsonify({'error': 'Not found'}), 404
    return jsonify(hackathon)


@api_bp.route('/hackathons/<int:id>', methods=['PUT'])
@limiter.limit("30 per minute")
@login_required
def api_update_hackathon(id):
    """Update a hackathon. Supports both FormData and JSON."""
    try:
        # Get existing
        existing = json_service.get_by_id('hackathons.json', id)
        if not existing:
            return jsonify({'error': 'Not found'}), 404
        
        # ============================================================
        # CHECK IF REQUEST IS FORM DATA OR JSON
        # ============================================================
        is_form_data = request.content_type and 'multipart/form-data' in request.content_type
        
        if is_form_data:
            # ============================================================
            # ✅ HANDLE FORM DATA
            # ============================================================
            title = request.form.get('title', '').strip()
            description = request.form.get('description', '').strip()
            date = request.form.get('date', '').strip()
            location = request.form.get('location', '').strip()
            status = request.form.get('status', 'upcoming').strip()
            is_published = request.form.get('is_published', 'true').lower() == 'true'
            
            if not title:
                return jsonify({'success': False, 'error': 'Title is required'}), 400
            
            # Sanitize
            title = sanitize_html(title)
            description = sanitize_html(description) if description else existing.get('description', '')
            if location:
                location = sanitize_html(location)
            
            # Auto-generate slug
            slug = slugify(title)
            if not slug:
                slug = f"hackathon-{int(datetime.now().timestamp())}"
            
            # Build updated data
            updated_data = {
                'title': title,
                'slug': slug,
                'description': description,
                'date': date or existing.get('date', ''),
                'location': location or existing.get('location', ''),
                'status': status,
                'is_published': is_published,
                'updated_at': datetime.now().isoformat(),
                'created_at': existing.get('created_at', datetime.now().isoformat())
            }
            
            result = json_service.update('hackathons.json', id, updated_data)
            
            audit.log_action(
                user=current_user.username,
                action='UPDATE_HACKATHON',
                details={'id': id, 'title': title}
            )
            
            if result:
                return jsonify({'success': True, 'data': result, 'message': 'Hackathon updated successfully'})
            else:
                return jsonify({'success': False, 'error': 'Failed to update hackathon'}), 500
        
        else:
            # ============================================================
            # ✅ HANDLE JSON (original logic)
            # ============================================================
            data = request.get_json()
            if not data:
                return jsonify({'success': False, 'error': 'No data provided'}), 400
            
            if data.get('title'):
                data['title'] = sanitize_html(data['title'].strip())
            
            data['updated_at'] = datetime.now().isoformat()
            
            result = json_service.update('hackathons.json', id, data)
            
            audit.log_action(
                user=current_user.username,
                action='UPDATE_HACKATHON',
                details={'id': id, 'title': data.get('title')}
            )
            
            if result:
                return jsonify({'success': True, 'data': result, 'message': 'Hackathon updated successfully'})
            else:
                return jsonify({'success': False, 'error': 'Failed to update hackathon'}), 500
        
    except Exception as e:
        audit.log_action(
            user=current_user.username if current_user.is_authenticated else 'Unknown',
            action='UPDATE_HACKATHON_ERROR',
            details={'id': id, 'error': str(e)}
        )
        return jsonify({'success': False, 'error': str(e)}), 400
    

@api_bp.route('/hackathons/<int:id>', methods=['DELETE'])
@limiter.limit("10 per minute")
@login_required
def api_delete_hackathon(id):
    """Delete a hackathon."""
    try:
        hackathon = json_service.get_by_id('hackathons.json', id)
        if hackathon:
            audit.log_action(
                user=current_user.username,
                action='DELETE_HACKATHON',
                details={'id': id, 'title': hackathon.get('title')}
            )
        
        result = json_service.delete('hackathons.json', id)
        if not result:
            return jsonify({'error': 'Not found'}), 404
        return jsonify({'success': True, 'message': 'Hackathon deleted successfully'})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 400


# ================================================================
# API - Success Stories
# ================================================================

@api_bp.route('/success-stories/', methods=['GET'])
@login_required
def api_get_success_stories():
    """Get all success stories."""
    try:
        stories = json_service.get_all('success_stories.json')
        return jsonify(stories)
    except Exception as e:
        print(f"❌ Error getting success stories: {e}")
        return jsonify([])


@api_bp.route('/success-stories/', methods=['POST'])
@limiter.limit("30 per minute")
@login_required
def api_create_success_story():
    """
    Create a new success story with optional image upload.
    Supports both FormData (with image) and JSON.
    """
    try:
        # ============================================================
        # CHECK IF REQUEST IS FORM DATA (with image) OR JSON
        # ============================================================
        is_form_data = request.content_type and 'multipart/form-data' in request.content_type
        
        if is_form_data:
            # ============================================================
            # ✅ HANDLE FORM DATA WITH IMAGE UPLOAD
            # ============================================================
            
            # Get fields from request.form
            title = request.form.get('title', '').strip()
            sme_name = request.form.get('sme_name', '').strip()
            story = request.form.get('story', '').strip()
            industry = request.form.get('industry', '').strip()
            is_published = request.form.get('is_published', 'true').lower() == 'true'
            display_order = request.form.get('display_order', 0)
            
            # Validate required fields
            if not title:
                return jsonify({'success': False, 'error': 'Title is required'}), 400
            if not sme_name:
                return jsonify({'success': False, 'error': 'SME Name is required'}), 400
            if not story:
                return jsonify({'success': False, 'error': 'Story is required'}), 400
            
            # Sanitize inputs
            title = sanitize_html(title)
            sme_name = sanitize_html(sme_name)
            story = sanitize_html(story)
            if industry:
                industry = sanitize_html(industry)
            
            # Auto-generate slug if not provided
            slug = request.form.get('slug', '').strip()
            if not slug:
                slug = slugify(title)
                if not slug:
                    slug = f"story-{int(datetime.now().timestamp())}"
            
            # ============================================================
            # ✅ HANDLE IMAGE UPLOAD
            # ============================================================
            image_path = None
            if 'image' in request.files:
                file = request.files['image']
                if file and file.filename:
                    image_path = save_story_image(file)
                    if not image_path:
                        return jsonify({'success': False, 'error': 'Invalid file type. Allowed: PNG, JPG, JPEG, GIF, WEBP, SVG'}), 400
            
            # Build story data
            story_data = {
                'title': title,
                'sme_name': sme_name,
                'story': story,
                'slug': slug,
                'is_published': is_published,
                'display_order': int(display_order),
                'created_at': datetime.now().isoformat(),
                'updated_at': datetime.now().isoformat()
            }
            
            if industry:
                story_data['industry'] = industry
            if image_path:
                story_data['image'] = image_path
            
            print(f"FormData - Story data to save: {story_data}")
            
            # Save to JSON
            result = json_service.create('success_stories.json', story_data)
            
            audit.log_action(
                user=current_user.username,
                action='CREATE_SUCCESS_STORY',
                details={'title': title, 'sme_name': sme_name, 'has_image': bool(image_path)}
            )
            
            if result:
                return jsonify({
                    'success': True,
                    'data': result,
                    'message': 'Success story created successfully'
                })
            else:
                return jsonify({
                    'success': False,
                    'error': 'Failed to save success story to JSON'
                }), 500
        
        else:
            # ============================================================
            # ✅ HANDLE JSON (No file upload - compatibility)
            # ============================================================
            data = request.get_json()
            if not data:
                return jsonify({'success': False, 'error': 'No data provided'}), 400
            
            if not data.get('title') or not data.get('sme_name') or not data.get('story'):
                return jsonify({'success': False, 'error': 'Title, SME Name, and Story are required'}), 400
            
            title = sanitize_html(data.get('title', '').strip())
            data['title'] = title
            
            if data.get('sme_name'):
                data['sme_name'] = sanitize_html(data['sme_name'].strip())
            if data.get('story'):
                data['story'] = sanitize_html(data['story'].strip())
            if data.get('industry'):
                data['industry'] = sanitize_html(data['industry'].strip())
            
            if not data.get('slug'):
                data['slug'] = slugify(title)
            
            data['created_at'] = datetime.now().isoformat()
            data['updated_at'] = datetime.now().isoformat()
            
            result = json_service.create('success_stories.json', data)
            
            audit.log_action(
                user=current_user.username,
                action='CREATE_SUCCESS_STORY',
                details={'title': title}
            )
            
            if result:
                return jsonify({'success': True, 'data': result, 'message': 'Success story created successfully'})
            else:
                return jsonify({'success': False, 'error': 'Failed to save success story'}), 500
        
    except Exception as e:
        audit.log_action(
            user=current_user.username if current_user.is_authenticated else 'Unknown',
            action='CREATE_SUCCESS_STORY_ERROR',
            details={'error': str(e)}
        )
        return jsonify({'success': False, 'error': str(e)}), 400



@api_bp.route('/success-stories/<int:id>', methods=['GET'])
@login_required
def api_get_success_story(id):
    """Get a single success story by ID."""
    story = json_service.get_by_id('success_stories.json', id)
    if not story:
        return jsonify({'error': 'Not found'}), 404
    return jsonify(story)


@api_bp.route('/success-stories/<int:id>', methods=['PUT'])
@limiter.limit("30 per minute")
@login_required
def api_update_success_story(id):
    """
    Update a success story with optional image replacement.
    Supports both FormData (with image) and JSON.
    """
    try:
        # Get existing story
        existing = json_service.get_by_id('success_stories.json', id)
        if not existing:
            return jsonify({'error': 'Success story not found'}), 404
        
        # ============================================================
        # CHECK IF REQUEST IS FORM DATA (with image) OR JSON
        # ============================================================
        is_form_data = request.content_type and 'multipart/form-data' in request.content_type
        
        if is_form_data:
            # ============================================================
            # ✅ HANDLE FORM DATA WITH IMAGE REPLACEMENT
            # ============================================================
            
            # Get fields from request.form
            title = request.form.get('title', '').strip()
            sme_name = request.form.get('sme_name', '').strip()
            story = request.form.get('story', '').strip()
            industry = request.form.get('industry', '').strip()
            is_published = request.form.get('is_published', 'true').lower() == 'true'
            display_order = request.form.get('display_order', 0)
            
            # Validate required fields
            if not title:
                return jsonify({'success': False, 'error': 'Title is required'}), 400
            if not sme_name:
                return jsonify({'success': False, 'error': 'SME Name is required'}), 400
            if not story:
                return jsonify({'success': False, 'error': 'Story is required'}), 400
            
            # Sanitize inputs
            title = sanitize_html(title)
            sme_name = sanitize_html(sme_name)
            story = sanitize_html(story)
            if industry:
                industry = sanitize_html(industry)
            
            # Auto-generate slug if not provided
            slug = request.form.get('slug', '').strip()
            if not slug:
                slug = slugify(title)
                if not slug:
                    slug = f"story-{int(datetime.now().timestamp())}"
            
            # ============================================================
            # ✅ HANDLE IMAGE REPLACEMENT
            # ============================================================
            image_path = existing.get('image')  # Keep existing by default
            
            if 'image' in request.files:
                file = request.files['image']
                if file and file.filename:
                    # Delete old image if exists
                    if existing.get('image'):
                        delete_uploaded_file(existing['image'])
                    
                    # Save new image
                    new_image_path = save_story_image(file)
                    if new_image_path:
                        image_path = new_image_path
                    else:
                        return jsonify({'success': False, 'error': 'Invalid file type. Allowed: PNG, JPG, JPEG, GIF, WEBP, SVG'}), 400
            
            # Check for removal flag
            remove_image = request.form.get('remove_image', 'false').lower() == 'true'
            if remove_image and existing.get('image'):
                delete_uploaded_file(existing['image'])
                image_path = None
            
            # Build updated data
            updated_data = {
                'title': title,
                'sme_name': sme_name,
                'story': story,
                'slug': slug,
                'is_published': is_published,
                'display_order': int(display_order),
                'updated_at': datetime.now().isoformat()
            }
            
            if industry:
                updated_data['industry'] = industry
            if image_path:
                updated_data['image'] = image_path
            elif remove_image:
                updated_data['image'] = None
            
            # Keep created_at from existing
            updated_data['created_at'] = existing.get('created_at', datetime.now().isoformat())
            
            print(f"FormData - Updated story data: {updated_data}")
            
            # Save to JSON
            result = json_service.update('success_stories.json', id, updated_data)
            
            audit.log_action(
                user=current_user.username,
                action='UPDATE_SUCCESS_STORY',
                details={'id': id, 'title': title}
            )
            
            if not result:
                return jsonify({'error': 'Not found'}), 404
            
            return jsonify({'success': True, 'data': result, 'message': 'Success story updated successfully'})
        
        else:
            # ============================================================
            # ✅ HANDLE JSON (No file upload)
            # ============================================================
            data = request.get_json()
            if not data:
                return jsonify({'success': False, 'error': 'No data provided'}), 400
            
            if data.get('title'):
                data['title'] = sanitize_html(data['title'].strip())
            if data.get('sme_name'):
                data['sme_name'] = sanitize_html(data['sme_name'].strip())
            if data.get('story'):
                data['story'] = sanitize_html(data['story'].strip())
            if data.get('industry'):
                data['industry'] = sanitize_html(data['industry'].strip())
            
            data['updated_at'] = datetime.now().isoformat()
            
            result = json_service.update('success_stories.json', id, data)
            
            if not result:
                return jsonify({'error': 'Not found'}), 404
            
            audit.log_action(
                user=current_user.username,
                action='UPDATE_SUCCESS_STORY',
                details={'id': id, 'title': data.get('title')}
            )
            
            return jsonify({'success': True, 'data': result, 'message': 'Success story updated successfully'})
        
    except Exception as e:
        audit.log_action(
            user=current_user.username if current_user.is_authenticated else 'Unknown',
            action='UPDATE_SUCCESS_STORY_ERROR',
            details={'id': id, 'error': str(e)}
        )
        return jsonify({'success': False, 'error': str(e)}), 400
    



@api_bp.route('/success-stories/<int:id>', methods=['DELETE'])
@limiter.limit("10 per minute")
@login_required
def api_delete_success_story(id):
    """Delete a success story and remove associated image from disk."""
    try:
        story = json_service.get_by_id('success_stories.json', id)
        
        if story:
            # Delete image from disk if exists
            if story.get('image'):
                delete_uploaded_file(story['image'])
            
            audit.log_action(
                user=current_user.username,
                action='DELETE_SUCCESS_STORY',
                details={'id': id, 'title': story.get('title')}
            )
        
        result = json_service.delete('success_stories.json', id)
        if not result:
            return jsonify({'error': 'Not found'}), 404
        
        return jsonify({'success': True, 'message': 'Success story deleted successfully'})
    except Exception as e:
        audit.log_action(
            user=current_user.username if current_user.is_authenticated else 'Unknown',
            action='DELETE_SUCCESS_STORY_ERROR',
            details={'id': id, 'error': str(e)}
        )
        return jsonify({'success': False, 'error': str(e)}), 400
    


# ================================================================
# API - SME Interest Submissions
# ================================================================

@api_bp.route('/sme-submissions/', methods=['GET'])
@login_required
def api_get_sme_submissions():
    """Get all SME interest submissions."""
    try:
        submissions = json_service.get_all('sme_submissions.json')
        sorted_submissions = sorted(submissions, key=lambda x: x.get('submitted_at', ''), reverse=True)
        return jsonify(sorted_submissions)
    except Exception as e:
        print(f"❌ Error getting SME submissions: {e}")
        return jsonify([])


@api_bp.route('/sme-submissions/', methods=['POST'])
@limiter.limit("10 per minute")
def api_create_sme_submission():
    """Create a new SME interest submission (public endpoint)."""
    try:
        data = request.get_json()
        if not data:
            return jsonify({'success': False, 'error': 'No data provided'}), 400
        
        # Validate required fields
        required = ['name', 'email', 'organisation', 'industry', 'interest']
        for field in required:
            if not data.get(field):
                return jsonify({'success': False, 'error': f'{field} is required'}), 400
        
        # Sanitize
        data['name'] = sanitize_html(data.get('name', '').strip())
        data['email'] = sanitize_html(data.get('email', '').strip())
        data['organisation'] = sanitize_html(data.get('organisation', '').strip())
        data['industry'] = sanitize_html(data.get('industry', '').strip())
        data['interest'] = sanitize_html(data.get('interest', '').strip())
        
        if data.get('phone'):
            data['phone'] = sanitize_html(data['phone'].strip())
        if data.get('message'):
            data['message'] = sanitize_html(data['message'].strip())
        
        data['is_read'] = False
        data['submitted_at'] = datetime.now().isoformat()
        
        result = json_service.create('sme_submissions.json', data)
        
        return jsonify({'success': True, 'data': result, 'message': 'Submission received successfully'})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 400


@api_bp.route('/sme-submissions/<int:id>/', methods=['PUT'])
@limiter.limit("30 per minute")
@login_required
def api_update_sme_submission(id):
    """Update an SME submission."""
    try:
        data = request.get_json()
        if not data:
            return jsonify({'success': False, 'error': 'No data provided'}), 400
        
        result = json_service.update('sme_submissions.json', id, data)
        if not result:
            return jsonify({'error': 'Not found'}), 404
        
        audit.log_action(
            user=current_user.username,
            action='UPDATE_SME_SUBMISSION',
            details={'id': id}
        )
        
        return jsonify({'success': True, 'message': 'Submission updated successfully'})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 400


@api_bp.route('/sme-submissions/<int:id>', methods=['DELETE'])
@limiter.limit("10 per minute")
@login_required
def api_delete_sme_submission(id):
    """Delete an SME submission."""
    try:
        submission = json_service.get_by_id('sme_submissions.json', id)
        if submission:
            audit.log_action(
                user=current_user.username,
                action='DELETE_SME_SUBMISSION',
                details={'id': id}
            )
        
        result = json_service.delete('sme_submissions.json', id)
        if not result:
            return jsonify({'error': 'Not found'}), 404
        return jsonify({'success': True, 'message': 'Submission deleted successfully'})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 400


@api_bp.route('/sme-submissions/clear/', methods=['DELETE'])
@limiter.limit("5 per minute")
@login_required
def api_clear_sme_submissions():
    """Delete all SME submissions."""
    try:
        result = json_service.clear_all('sme_submissions.json')
        if result:
            audit.log_action(
                user=current_user.username,
                action='CLEAR_SME_SUBMISSIONS',
                details={}
            )
            return jsonify({'success': True, 'message': 'All submissions cleared successfully'})
        return jsonify({'success': False, 'error': 'Failed to clear submissions'}), 500
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 400




# ================================================================
# API - Community Repositories
# ================================================================

@api_bp.route('/repositories/', methods=['GET'])

def api_get_repositories():
    """Get all repositories."""
    try:
        repos = json_service.get_all('repositories.json')
        return jsonify(repos)
    except Exception as e:
        print(f"❌ Error getting repositories: {e}")
        return jsonify([])


@api_bp.route('/repositories/', methods=['POST'])
@limiter.limit("30 per minute")
@login_required
def api_create_repository():
    """Create a new repository."""
    try:
        data = request.get_json()
        if not data:
            return jsonify({'success': False, 'error': 'No data provided'}), 400
        
        if not data.get('name') or not data.get('description') or not data.get('url'):
            return jsonify({'success': False, 'error': 'Name, Description, and URL are required'}), 400
        
        data['name'] = sanitize_html(data['name'].strip())
        data['description'] = sanitize_html(data['description'].strip())
        data['url'] = data['url'].strip()
        
        if data.get('language'):
            data['language'] = sanitize_html(data['language'].strip())
        if data.get('license'):
            data['license'] = sanitize_html(data['license'].strip())
        
        if not data.get('slug'):
            data['slug'] = slugify(data['name'])
        
        data['created_at'] = datetime.now().isoformat()
        data['updated_at'] = datetime.now().isoformat()
        
        result = json_service.create('repositories.json', data)
        
        audit.log_action(
            user=current_user.username,
            action='CREATE_REPOSITORY',
            details={'name': data['name']}
        )
        
        return jsonify({'success': True, 'data': result, 'message': 'Repository created successfully'})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 400


@api_bp.route('/repositories/<int:id>', methods=['GET'])
def api_get_repository(id):
    """Get a single repository by ID. Public access for viewing details."""
    try:
        all_repos = json_service.get_all('repositories.json')
        
        print(f"Looking for repository ID: {id}")
        print(f"Total repositories in file: {len(all_repos)}")
        print(f"Repository data: {all_repos}")
        
        repo = None
        for item in all_repos:
            if item.get('id') == id:
                repo = item
                print(f"Found by id field: {repo.get('name')}")
                break
        
        if repo is None:
            index = id - 1
            if 0 <= index < len(all_repos):
                repo = all_repos[index]
                repo['id'] = id
                print(f"Found by index {index}: {repo.get('name')}")
        
        if repo is None:
            print(f"Repository with ID {id} not found")
            return jsonify({'error': 'Repository not found'}), 404
        
        return jsonify(repo)
    except Exception as e:
        print(f"Error getting repository: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500
    



@api_bp.route('/repositories/<int:id>', methods=['PUT'])
@limiter.limit("30 per minute")
@login_required
def api_update_repository(id):
    """Update a repository."""
    try:
        data = request.get_json()
        if not data:
            return jsonify({'success': False, 'error': 'No data provided'}), 400
        
        existing = json_service.get_by_id('repositories.json', id)
        if not existing:
            return jsonify({'error': 'Not found'}), 404
        
        if data.get('name'):
            data['name'] = sanitize_html(data['name'].strip())
        if data.get('description'):
            data['description'] = sanitize_html(data['description'].strip())
        
        data['updated_at'] = datetime.now().isoformat()
        
        result = json_service.update('repositories.json', id, data)
        
        audit.log_action(
            user=current_user.username,
            action='UPDATE_REPOSITORY',
            details={'id': id, 'name': data.get('name')}
        )
        
        return jsonify({'success': True, 'data': result, 'message': 'Repository updated successfully'})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 400


@api_bp.route('/repositories/<int:id>', methods=['DELETE'])
@limiter.limit("10 per minute")
@login_required
def api_delete_repository(id):
    """Delete a repository."""
    try:
        repo = json_service.get_by_id('repositories.json', id)
        if repo:
            audit.log_action(
                user=current_user.username,
                action='DELETE_REPOSITORY',
                details={'id': id, 'name': repo.get('name')}
            )
        
        result = json_service.delete('repositories.json', id)
        if not result:
            return jsonify({'error': 'Not found'}), 404
        return jsonify({'success': True, 'message': 'Repository deleted successfully'})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 400


# ================================================================
# API - Community Events
# ================================================================

@api_bp.route('/community-events/', methods=['GET'])

def api_get_community_events():
    """Get all community events."""
    try:
        events = json_service.get_all('community_events.json')
        return jsonify(events)
    except Exception as e:
        print(f"Error getting community events: {e}")
        return jsonify([])


@api_bp.route('/community-events/', methods=['POST'])
@limiter.limit("30 per minute")
@login_required
def api_create_community_event():
    """Create a new community event."""
    try:
        data = request.get_json()
        if not data:
            return jsonify({'success': False, 'error': 'No data provided'}), 400
        
        if not data.get('title') or not data.get('date') or not data.get('type') or not data.get('description'):
            return jsonify({'success': False, 'error': 'Title, Date, Type, and Description are required'}), 400
        
        data['title'] = sanitize_html(data['title'].strip())
        data['description'] = sanitize_html(data['description'].strip())
        
        if not data.get('slug'):
            data['slug'] = slugify(data['title'])
        
        data['created_at'] = datetime.now().isoformat()
        data['updated_at'] = datetime.now().isoformat()
        
        result = json_service.create('community_events.json', data)
        
        audit.log_action(
            user=current_user.username,
            action='CREATE_COMMUNITY_EVENT',
            details={'title': data['title']}
        )
        
        return jsonify({'success': True, 'data': result, 'message': 'Event created successfully'})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 400


@api_bp.route('/community-events/<int:id>', methods=['GET'])
def api_get_community_event(id):
    """Get a single community event by ID. Public access for viewing details."""
    try:
        # Get all events from JSON
        all_events = json_service.get_all('community_events.json')
        
        print(f"Looking for event ID: {id}")
        print(f"Total events in file: {len(all_events)}")
        print(f"Event data: {all_events}")
        
        # Find by id field
        event = None
        for item in all_events:
            if item.get('id') == id:
                event = item
                print(f"Found by id field: {event.get('title')}")
                break
        
        # If not found by id, use index-based lookup
        if event is None:
            index = id - 1
            if 0 <= index < len(all_events):
                event = all_events[index]
                event['id'] = id
                print(f"Found by index {index}: {event.get('title')}")
        
        if event is None:
            print(f"Event with ID {id} not found")
            return jsonify({'error': 'Event not found'}), 404
        
        return jsonify(event)
    except Exception as e:
        print(f"Error getting event: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500
    
    

@api_bp.route('/community-events/<int:id>', methods=['PUT'])
@limiter.limit("30 per minute")
@login_required
def api_update_community_event(id):
    """Update a community event."""
    try:
        data = request.get_json()
        if not data:
            return jsonify({'success': False, 'error': 'No data provided'}), 400
        
        existing = json_service.get_by_id('community_events.json', id)
        if not existing:
            return jsonify({'error': 'Not found'}), 404
        
        if data.get('title'):
            data['title'] = sanitize_html(data['title'].strip())
        if data.get('description'):
            data['description'] = sanitize_html(data['description'].strip())
        
        data['updated_at'] = datetime.now().isoformat()
        
        result = json_service.update('community_events.json', id, data)
        
        audit.log_action(
            user=current_user.username,
            action='UPDATE_COMMUNITY_EVENT',
            details={'id': id, 'title': data.get('title')}
        )
        
        return jsonify({'success': True, 'data': result, 'message': 'Event updated successfully'})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 400


@api_bp.route('/community-events/<int:id>', methods=['DELETE'])
@limiter.limit("10 per minute")
@login_required
def api_delete_community_event(id):
    """Delete a community event."""
    try:
        event = json_service.get_by_id('community_events.json', id)
        if event:
            audit.log_action(
                user=current_user.username,
                action='DELETE_COMMUNITY_EVENT',
                details={'id': id, 'title': event.get('title')}
            )
        
        result = json_service.delete('community_events.json', id)
        if not result:
            return jsonify({'error': 'Not found'}), 404
        return jsonify({'success': True, 'message': 'Event deleted successfully'})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 400


# ================================================================
# API - Community Join Submissions
# ================================================================

@api_bp.route('/community-join/', methods=['POST'])
@limiter.limit("10 per minute")
def api_create_community_submission():
    """Create a new community join submission (public endpoint)."""
    try:
        data = request.get_json()
        if not data:
            return jsonify({'success': False, 'error': 'No data provided'}), 400
        
        # Validate required fields
        required = ['name', 'email', 'role', 'interest']
        for field in required:
            if not data.get(field):
                return jsonify({'success': False, 'error': f'{field} is required'}), 400
        
        # Sanitize
        data['name'] = sanitize_html(data.get('name', '').strip())
        data['email'] = sanitize_html(data.get('email', '').strip())
        data['role'] = sanitize_html(data.get('role', '').strip())
        data['interest'] = sanitize_html(data.get('interest', '').strip())
        
        if data.get('github'):
            data['github'] = sanitize_html(data['github'].strip())
        if data.get('message'):
            data['message'] = sanitize_html(data['message'].strip())
        
        data['is_read'] = False
        data['submitted_at'] = datetime.now().isoformat()
        
        result = json_service.create('community_submissions.json', data)
        
        return jsonify({'success': True, 'data': result, 'message': 'Join request submitted successfully'})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 400


@api_bp.route('/community-submissions/', methods=['GET'])
@login_required
def api_get_community_submissions():
    """Get all community join submissions."""
    try:
        submissions = json_service.get_all('community_submissions.json')
        sorted_submissions = sorted(submissions, key=lambda x: x.get('submitted_at', ''), reverse=True)
        return jsonify(sorted_submissions)
    except Exception as e:
        print(f"Error getting community submissions: {e}")
        return jsonify([])


@api_bp.route('/community-submissions/<int:id>/', methods=['GET'])
@login_required
def api_get_community_submission(id):
    """
    Get a single community submission by ID.
    Used by the View modal to display full details.
    """
    try:
        submission = json_service.get_by_id('community_submissions.json', id)
        if not submission:
            return jsonify({'error': 'Not found'}), 404
        return jsonify(submission)
    except Exception as e:
        print(f"Error getting community submission: {e}")
        return jsonify({'error': str(e)}), 400


@api_bp.route('/community-submissions/<int:id>/', methods=['PUT'])
@limiter.limit("30 per minute")
@login_required
def api_update_community_submission(id):
    """
    Update a community submission (e.g., mark as read/unread).
    Used by the Mark Read/Mark Unread buttons.
    """
    try:
        data = request.get_json()
        if not data:
            return jsonify({'success': False, 'error': 'No data provided'}), 400
        
        # Get existing submission
        existing = json_service.get_by_id('community_submissions.json', id)
        if not existing:
            return jsonify({'success': False, 'error': 'Submission not found'}), 404
        
        # Update only the fields provided
        if 'is_read' in data:
            existing['is_read'] = data['is_read']
        
        # Save back to JSON
        result = json_service.update('community_submissions.json', id, existing)
        
        if result:
            audit.log_action(
                user=current_user.username,
                action='UPDATE_COMMUNITY_SUBMISSION',
                details={'id': id, 'is_read': existing.get('is_read')}
            )
            return jsonify({'success': True, 'message': 'Submission updated successfully'})
        else:
            return jsonify({'success': False, 'error': 'Failed to update submission'}), 400
            
    except Exception as e:
        print(f"Error updating community submission: {e}")
        return jsonify({'success': False, 'error': str(e)}), 400


@api_bp.route('/community-submissions/<int:id>/', methods=['DELETE'])
@limiter.limit("10 per minute")
@login_required
def api_delete_community_submission(id):
    """Delete a community submission."""
    try:
        submission = json_service.get_by_id('community_submissions.json', id)
        if submission:
            audit.log_action(
                user=current_user.username,
                action='DELETE_COMMUNITY_SUBMISSION',
                details={'id': id}
            )
        
        result = json_service.delete('community_submissions.json', id)
        if not result:
            return jsonify({'error': 'Not found'}), 404
        return jsonify({'success': True, 'message': 'Submission deleted successfully'})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 400


@api_bp.route('/community-submissions/clear/', methods=['DELETE'])
@limiter.limit("5 per minute")
@login_required
def api_clear_community_submissions():
    """Delete all community submissions."""
    try:
        result = json_service.clear_all('community_submissions.json')
        if result:
            audit.log_action(
                user=current_user.username,
                action='CLEAR_COMMUNITY_SUBMISSIONS',
                details={}
            )
            return jsonify({'success': True, 'message': 'All submissions cleared successfully'})
        return jsonify({'success': False, 'error': 'Failed to clear submissions'}), 500
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 400




# ================================================================
# API - Replication Resources
# ================================================================

# ================================================================
# API - Replication Resources
# ================================================================

@api_bp.route('/replication-resources/', methods=['GET'])

def api_get_replication_resources():
    """Get all replication resources."""
    try:
        resources = json_service.get_all('replication_resources.json')
        return jsonify(resources)
    except Exception as e:
        print(f"❌ Error getting replication resources: {e}")
        return jsonify([])


@api_bp.route('/replication-resources/', methods=['POST'])
@limiter.limit("30 per minute")
@login_required
def api_create_replication_resource():
    """
    Create a new replication resource with optional file upload.
    Supports both FormData (with file) and JSON.
    """
    try:
        # ============================================================
        # CHECK IF REQUEST IS FORM DATA (with file) OR JSON
        # ============================================================
        is_form_data = request.content_type and 'multipart/form-data' in request.content_type
        
        if is_form_data:
            # ============================================================
            # ✅ HANDLE FORM DATA WITH FILE UPLOAD
            # ============================================================
            
            # Get fields from request.form
            title = request.form.get('title', '').strip()
            slug = request.form.get('slug', '').strip()
            description = request.form.get('description', '').strip()
            file_path = None
            
            # Validate required fields
            if not title:
                return jsonify({'success': False, 'error': 'Title is required'}), 400
            
            # Sanitize inputs
            title = sanitize_html(title)
            if description:
                description = sanitize_html(description)
            
            # Auto-generate slug if not provided
            if not slug:
                slug = slugify(title)
                if not slug:
                    slug = f"resource-{int(datetime.now().timestamp())}"
            
            # ============================================================
            # ✅ HANDLE FILE UPLOAD
            # ============================================================
            if 'file' in request.files:
                file = request.files['file']
                if file and file.filename:
                    file_path = save_replication_file(file)
                    if not file_path:
                        return jsonify({'success': False, 'error': 'Invalid file type. Allowed: PDF, DOCX, DOC, PPT, PPTX, XLS, XLSX, ZIP, PNG, JPG, JPEG, GIF, WEBP, SVG'}), 400
            
            # Validate: file_path is required
            if not file_path:
                return jsonify({'success': False, 'error': 'A file upload is required'}), 400
            
            # Build resource data
            resource_data = {
                'title': title,
                'slug': slug,
                'file_path': file_path,
                'created_at': datetime.now().isoformat(),
                'updated_at': datetime.now().isoformat()
            }
            
            if description:
                resource_data['description'] = description
            
            print(f"FormData - Replication resource data to save: {resource_data}")
            
            # Save to JSON
            result = json_service.create('replication_resources.json', resource_data)
            
            audit.log_action(
                user=current_user.username,
                action='CREATE_REPLICATION_RESOURCE',
                details={'title': title, 'has_file': bool(file_path)}
            )
            
            if result:
                return jsonify({
                    'success': True,
                    'data': result,
                    'message': 'Replication resource created successfully'
                })
            else:
                return jsonify({
                    'success': False,
                    'error': 'Failed to save replication resource to JSON'
                }), 500
        
        else:
            # ============================================================
            # ✅ HANDLE JSON (No file upload - compatibility)
            # ============================================================
            data = request.get_json()
            if not data:
                return jsonify({'success': False, 'error': 'No data provided'}), 400
            
            if not data.get('title') or not data.get('file_path'):
                return jsonify({'success': False, 'error': 'Title and File Path are required'}), 400
            
            title = sanitize_html(data.get('title', '').strip())
            data['title'] = title
            
            if data.get('description'):
                data['description'] = sanitize_html(data['description'].strip())
            
            if not data.get('slug'):
                data['slug'] = slugify(title)
            
            data['created_at'] = datetime.now().isoformat()
            data['updated_at'] = datetime.now().isoformat()
            
            result = json_service.create('replication_resources.json', data)
            
            audit.log_action(
                user=current_user.username,
                action='CREATE_REPLICATION_RESOURCE',
                details={'title': title}
            )
            
            if result:
                return jsonify({'success': True, 'data': result, 'message': 'Replication resource created successfully'})
            else:
                return jsonify({'success': False, 'error': 'Failed to save replication resource'}), 500
        
    except Exception as e:
        audit.log_action(
            user=current_user.username if current_user.is_authenticated else 'Unknown',
            action='CREATE_REPLICATION_RESOURCE_ERROR',
            details={'error': str(e)}
        )
        return jsonify({'success': False, 'error': str(e)}), 400
    



# ================================================================
# ✅ ADD THIS - GET SINGLE RESOURCE (For View Modal)
# ================================================================

@api_bp.route('/replication-resources/<int:id>/', methods=['GET'])

def api_get_replication_resource(id):
    """
    Get a single replication resource by ID.
    Used by the View modal to display full details.
    """
    try:
        resource = json_service.get_by_id('replication_resources.json', id)
        if not resource:
            return jsonify({'error': 'Resource not found'}), 404
        return jsonify(resource)
    except Exception as e:
        print(f"❌ Error getting replication resource: {e}")
        return jsonify({'error': str(e)}), 400


# ================================================================
# END OF ADDED CODE
# ================================================================

@api_bp.route('/replication-resources/<int:id>', methods=['PUT'])
@limiter.limit("30 per minute")
@login_required
def api_update_replication_resource(id):
    """
    Update a replication resource with optional file replacement.
    Supports both FormData (with file) and JSON.
    """
    try:
        # Get existing resource
        existing = json_service.get_by_id('replication_resources.json', id)
        if not existing:
            return jsonify({'error': 'Resource not found'}), 404
        
        # ============================================================
        # CHECK IF REQUEST IS FORM DATA (with file) OR JSON
        # ============================================================
        is_form_data = request.content_type and 'multipart/form-data' in request.content_type
        
        if is_form_data:
            # ============================================================
            # ✅ HANDLE FORM DATA WITH FILE REPLACEMENT
            # ============================================================
            
            # Get fields from request.form
            title = request.form.get('title', '').strip()
            slug = request.form.get('slug', '').strip()
            description = request.form.get('description', '').strip()
            
            # Validate required fields
            if not title:
                return jsonify({'success': False, 'error': 'Title is required'}), 400
            
            # Sanitize inputs
            title = sanitize_html(title)
            if description:
                description = sanitize_html(description)
            
            # Auto-generate slug if not provided
            if not slug:
                slug = slugify(title)
                if not slug:
                    slug = f"resource-{int(datetime.now().timestamp())}"
            
            # ============================================================
            # ✅ HANDLE FILE REPLACEMENT
            # ============================================================
            file_path = existing.get('file_path')  # Keep existing by default
            
            if 'file' in request.files:
                file = request.files['file']
                if file and file.filename:
                    # Delete old file if exists
                    if existing.get('file_path'):
                        delete_uploaded_file(existing['file_path'])
                    
                    # Save new file
                    new_file_path = save_replication_file(file)
                    if new_file_path:
                        file_path = new_file_path
                    else:
                        return jsonify({'success': False, 'error': 'Invalid file type. Allowed: PDF, DOCX, DOC, PPT, PPTX, XLS, XLSX, ZIP, PNG, JPG, JPEG, GIF, WEBP, SVG'}), 400
            
            # Check for removal flag
            remove_file = request.form.get('remove_file', 'false').lower() == 'true'
            if remove_file and existing.get('file_path'):
                delete_uploaded_file(existing['file_path'])
                file_path = None
            
            # Validate: file_path is required
            if not file_path:
                return jsonify({'success': False, 'error': 'A file is required'}), 400
            
            # Build updated data
            updated_data = {
                'title': title,
                'slug': slug,
                'file_path': file_path,
                'updated_at': datetime.now().isoformat()
            }
            
            if description:
                updated_data['description'] = description
            elif description == '' and existing.get('description'):
                updated_data['description'] = None
            
            # Keep created_at from existing
            updated_data['created_at'] = existing.get('created_at', datetime.now().isoformat())
            
            print(f"FormData - Updated replication resource data: {updated_data}")
            
            # Save to JSON
            result = json_service.update('replication_resources.json', id, updated_data)
            
            audit.log_action(
                user=current_user.username,
                action='UPDATE_REPLICATION_RESOURCE',
                details={'id': id, 'title': title}
            )
            
            if not result:
                return jsonify({'error': 'Not found'}), 404
            
            return jsonify({'success': True, 'data': result, 'message': 'Replication resource updated successfully'})
        
        else:
            # ============================================================
            # ✅ HANDLE JSON (No file upload)
            # ============================================================
            data = request.get_json()
            if not data:
                return jsonify({'success': False, 'error': 'No data provided'}), 400
            
            if data.get('title'):
                data['title'] = sanitize_html(data['title'].strip())
            if data.get('description'):
                data['description'] = sanitize_html(data['description'].strip())
            
            data['updated_at'] = datetime.now().isoformat()
            
            result = json_service.update('replication_resources.json', id, data)
            
            if not result:
                return jsonify({'error': 'Not found'}), 404
            
            audit.log_action(
                user=current_user.username,
                action='UPDATE_REPLICATION_RESOURCE',
                details={'id': id, 'title': data.get('title')}
            )
            
            return jsonify({'success': True, 'data': result, 'message': 'Replication resource updated successfully'})
        
    except Exception as e:
        audit.log_action(
            user=current_user.username if current_user.is_authenticated else 'Unknown',
            action='UPDATE_REPLICATION_RESOURCE_ERROR',
            details={'id': id, 'error': str(e)}
        )
        return jsonify({'success': False, 'error': str(e)}), 400
    






@api_bp.route('/replication-resources/<int:id>', methods=['DELETE'])
@limiter.limit("10 per minute")
@login_required
def api_delete_replication_resource(id):
    """Delete a replication resource and remove associated file from disk."""
    try:
        resource = json_service.get_by_id('replication_resources.json', id)
        
        if resource:
            # Delete file from disk if exists
            if resource.get('file_path'):
                delete_uploaded_file(resource['file_path'])
            
            audit.log_action(
                user=current_user.username,
                action='DELETE_REPLICATION_RESOURCE',
                details={'id': id, 'title': resource.get('title')}
            )
        
        result = json_service.delete('replication_resources.json', id)
        if not result:
            return jsonify({'error': 'Not found'}), 404
        
        return jsonify({'success': True, 'message': 'Replication resource deleted successfully'})
    except Exception as e:
        audit.log_action(
            user=current_user.username if current_user.is_authenticated else 'Unknown',
            action='DELETE_REPLICATION_RESOURCE_ERROR',
            details={'id': id, 'error': str(e)}
        )
        return jsonify({'success': False, 'error': str(e)}), 400
    

# ================================================================
# API - Replication Templates
# ================================================================

@api_bp.route('/replication-templates/', methods=['GET'])

def api_get_replication_templates():
    """Get all replication templates."""
    try:
        templates = json_service.get_all('replication_templates.json')
        return jsonify(templates)
    except Exception as e:
        print(f"❌ Error getting replication templates: {e}")
        return jsonify([])


@api_bp.route('/replication-templates/', methods=['POST'])
@limiter.limit("30 per minute")
@login_required
def api_create_replication_template():
    """Create a new replication template. Supports both FormData and JSON."""
    try:
        # ============================================================
        # CHECK IF REQUEST IS FORM DATA (with file) OR JSON
        # ============================================================
        is_form_data = request.content_type and 'multipart/form-data' in request.content_type
        
        if is_form_data:
            # ============================================================
            # ✅ HANDLE FORM DATA WITH FILE UPLOAD
            # ============================================================
            
            # Get fields from request.form
            title = request.form.get('title', '').strip()
            slug = request.form.get('slug', '').strip()
            description = request.form.get('description', '').strip()
            file_path = None
            
            # Validate required fields
            if not title:
                return jsonify({'success': False, 'error': 'Title is required'}), 400
            
            # Sanitize inputs
            title = sanitize_html(title)
            if description:
                description = sanitize_html(description)
            
            # Auto-generate slug if not provided
            if not slug:
                slug = slugify(title)
                if not slug:
                    slug = f"template-{int(datetime.now().timestamp())}"
            
            # ============================================================
            # ✅ HANDLE FILE UPLOAD
            # ============================================================
            if 'file' in request.files:
                file = request.files['file']
                if file and file.filename:
                    file_path = save_replication_file(file)
                    if not file_path:
                        return jsonify({'success': False, 'error': 'Invalid file type. Allowed: PDF, DOCX, DOC, PPT, PPTX, XLS, XLSX, ZIP, PNG, JPG, JPEG, GIF, WEBP, SVG'}), 400
            
            # Validate: file_path is required
            if not file_path:
                return jsonify({'success': False, 'error': 'A file upload is required'}), 400
            
            # Build template data
            template_data = {
                'title': title,
                'slug': slug,
                'file_path': file_path,
                'created_at': datetime.now().isoformat(),
                'updated_at': datetime.now().isoformat()
            }
            
            if description:
                template_data['description'] = description
            
            print(f"FormData - Replication template data to save: {template_data}")
            
            # Save to JSON
            result = json_service.create('replication_templates.json', template_data)
            
            audit.log_action(
                user=current_user.username,
                action='CREATE_REPLICATION_TEMPLATE',
                details={'title': title, 'has_file': bool(file_path)}
            )
            
            if result:
                return jsonify({
                    'success': True,
                    'data': result,
                    'message': 'Template created successfully'
                })
            else:
                return jsonify({
                    'success': False,
                    'error': 'Failed to save template to JSON'
                }), 500
        
        else:
            # ============================================================
            # ✅ HANDLE JSON (No file upload - compatibility)
            # ============================================================
            data = request.get_json()
            if not data:
                return jsonify({'success': False, 'error': 'No data provided'}), 400
            
            if not data.get('title') or not data.get('file_path'):
                return jsonify({'success': False, 'error': 'Title and File Path are required'}), 400
            
            title = sanitize_html(data.get('title', '').strip())
            data['title'] = title
            
            if data.get('description'):
                data['description'] = sanitize_html(data['description'].strip())
            
            if not data.get('slug'):
                data['slug'] = slugify(title)
            
            data['created_at'] = datetime.now().isoformat()
            data['updated_at'] = datetime.now().isoformat()
            
            result = json_service.create('replication_templates.json', data)
            
            audit.log_action(
                user=current_user.username,
                action='CREATE_REPLICATION_TEMPLATE',
                details={'title': title}
            )
            
            if result:
                return jsonify({'success': True, 'data': result, 'message': 'Template created successfully'})
            else:
                return jsonify({'success': False, 'error': 'Failed to save template'}), 500
        
    except Exception as e:
        audit.log_action(
            user=current_user.username if current_user.is_authenticated else 'Unknown',
            action='CREATE_REPLICATION_TEMPLATE_ERROR',
            details={'error': str(e)}
        )
        return jsonify({'success': False, 'error': str(e)}), 400
    
# ================================================================
# ✅ ADD THIS - GET SINGLE TEMPLATE (For View Modal)
# ================================================================

@api_bp.route('/replication-templates/<int:id>/', methods=['GET'])

def api_get_replication_template(id):
    """
    Get a single replication template by ID.
    Used by the View modal to display full details.
    """
    try:
        template = json_service.get_by_id('replication_templates.json', id)
        if not template:
            return jsonify({'error': 'Template not found'}), 404
        return jsonify(template)
    except Exception as e:
        print(f"❌ Error getting replication template: {e}")
        return jsonify({'error': str(e)}), 400


# ================================================================
# END OF ADDED CODE
# ================================================================

@api_bp.route('/replication-templates/<int:id>', methods=['PUT'])
@limiter.limit("30 per minute")
@login_required
def api_update_replication_template(id):
    """Update a replication template. Supports both FormData and JSON."""
    try:
        # Get existing template
        existing = json_service.get_by_id('replication_templates.json', id)
        if not existing:
            return jsonify({'error': 'Not found'}), 404
        
        # ============================================================
        # CHECK IF REQUEST IS FORM DATA (with file) OR JSON
        # ============================================================
        is_form_data = request.content_type and 'multipart/form-data' in request.content_type
        
        if is_form_data:
            # ============================================================
            # ✅ HANDLE FORM DATA WITH FILE REPLACEMENT
            # ============================================================
            
            # Get fields from request.form
            title = request.form.get('title', '').strip()
            slug = request.form.get('slug', '').strip()
            description = request.form.get('description', '').strip()
            
            # Validate required fields
            if not title:
                return jsonify({'success': False, 'error': 'Title is required'}), 400
            
            # Sanitize inputs
            title = sanitize_html(title)
            if description:
                description = sanitize_html(description)
            
            # Auto-generate slug if not provided
            if not slug:
                slug = slugify(title)
                if not slug:
                    slug = f"template-{int(datetime.now().timestamp())}"
            
            # ============================================================
            # ✅ HANDLE FILE REPLACEMENT
            # ============================================================
            file_path = existing.get('file_path')  # Keep existing by default
            
            if 'file' in request.files:
                file = request.files['file']
                if file and file.filename:
                    # Delete old file if exists
                    if existing.get('file_path'):
                        delete_uploaded_file(existing['file_path'])
                    
                    # Save new file
                    new_file_path = save_replication_file(file)
                    if new_file_path:
                        file_path = new_file_path
                    else:
                        return jsonify({'success': False, 'error': 'Invalid file type. Allowed: PDF, DOCX, DOC, PPT, PPTX, XLS, XLSX, ZIP, PNG, JPG, JPEG, GIF, WEBP, SVG'}), 400
            
            # Check for removal flag
            remove_file = request.form.get('remove_file', 'false').lower() == 'true'
            if remove_file and existing.get('file_path'):
                delete_uploaded_file(existing['file_path'])
                file_path = None
            
            # Validate: file_path is required
            if not file_path:
                return jsonify({'success': False, 'error': 'A file is required'}), 400
            
            # Build updated data
            updated_data = {
                'title': title,
                'slug': slug,
                'file_path': file_path,
                'updated_at': datetime.now().isoformat()
            }
            
            if description:
                updated_data['description'] = description
            elif description == '' and existing.get('description'):
                updated_data['description'] = None
            
            # Keep created_at from existing
            updated_data['created_at'] = existing.get('created_at', datetime.now().isoformat())
            
            print(f"FormData - Updated template data: {updated_data}")
            
            # Save to JSON
            result = json_service.update('replication_templates.json', id, updated_data)
            
            audit.log_action(
                user=current_user.username,
                action='UPDATE_REPLICATION_TEMPLATE',
                details={'id': id, 'title': title}
            )
            
            if not result:
                return jsonify({'error': 'Not found'}), 404
            
            return jsonify({'success': True, 'data': result, 'message': 'Template updated successfully'})
        
        else:
            # ============================================================
            # ✅ HANDLE JSON (No file upload)
            # ============================================================
            data = request.get_json()
            if not data:
                return jsonify({'success': False, 'error': 'No data provided'}), 400
            
            if data.get('title'):
                data['title'] = sanitize_html(data['title'].strip())
            if data.get('description'):
                data['description'] = sanitize_html(data['description'].strip())
            data['updated_at'] = datetime.now().isoformat()
            
            result = json_service.update('replication_templates.json', id, data)
            if not result:
                return jsonify({'error': 'Not found'}), 404
            
            audit.log_action(
                user=current_user.username,
                action='UPDATE_REPLICATION_TEMPLATE',
                details={'id': id, 'title': data.get('title')}
            )
            
            return jsonify({'success': True, 'data': result, 'message': 'Template updated successfully'})
        
    except Exception as e:
        audit.log_action(
            user=current_user.username if current_user.is_authenticated else 'Unknown',
            action='UPDATE_REPLICATION_TEMPLATE_ERROR',
            details={'id': id, 'error': str(e)}
        )
        return jsonify({'success': False, 'error': str(e)}), 400

@api_bp.route('/replication-templates/<int:id>', methods=['DELETE'])
@limiter.limit("10 per minute")
@login_required
def api_delete_replication_template(id):
    """Delete a replication template."""
    try:
        template = json_service.get_by_id('replication_templates.json', id)
        if template:
            audit.log_action(user=current_user.username, action='DELETE_REPLICATION_TEMPLATE', details={'id': id})
        result = json_service.delete('replication_templates.json', id)
        if not result:
            return jsonify({'error': 'Not found'}), 404
        return jsonify({'success': True, 'message': 'Template deleted successfully'})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 400

# ================================================================
# API - Replication Lessons
# ================================================================

@api_bp.route('/replication-lessons/', methods=['GET'])

def api_get_replication_lessons():
    """Get all replication lessons."""
    try:
        lessons = json_service.get_all('replication_lessons.json')
        return jsonify(lessons)
    except Exception as e:
        print(f"❌ Error getting replication lessons: {e}")
        return jsonify([])


@api_bp.route('/replication-lessons/', methods=['POST'])
@limiter.limit("30 per minute")
@login_required
def api_create_replication_lesson():
    """Create a new replication lesson. Supports both FormData and JSON."""
    try:
        # ============================================================
        # CHECK IF REQUEST IS FORM DATA OR JSON
        # ============================================================
        is_form_data = request.content_type and 'multipart/form-data' in request.content_type
        
        if is_form_data:
            # ============================================================
            # ✅ HANDLE FORM DATA (Lesson doesn't have file upload)
            # ============================================================
            
            # Get fields from request.form
            title = request.form.get('title', '').strip()
            description = request.form.get('description', '').strip()
            content = request.form.get('content', '').strip()
            subtext = request.form.get('subtext', '').strip()
            
            # Validate required fields
            if not title:
                return jsonify({'success': False, 'error': 'Title is required'}), 400
            if not description:
                return jsonify({'success': False, 'error': 'Description is required'}), 400
            
            # Sanitize inputs
            title = sanitize_html(title)
            description = sanitize_html(description)
            if content:
                content = sanitize_html(content)
            if subtext:
                subtext = sanitize_html(subtext)
            
            # Auto-generate slug
            slug = slugify(title)
            if not slug:
                slug = f"lesson-{int(datetime.now().timestamp())}"
            
            # Build lesson data
            lesson_data = {
                'title': title,
                'slug': slug,
                'description': description,
                'created_at': datetime.now().isoformat(),
                'updated_at': datetime.now().isoformat()
            }
            
            if content:
                lesson_data['content'] = content
            if subtext:
                lesson_data['subtext'] = subtext
            
            print(f"FormData - Lesson data to save: {lesson_data}")
            
            # Save to JSON
            result = json_service.create('replication_lessons.json', lesson_data)
            
            audit.log_action(
                user=current_user.username,
                action='CREATE_REPLICATION_LESSON',
                details={'title': title}
            )
            
            if result:
                return jsonify({
                    'success': True,
                    'data': result,
                    'message': 'Lesson created successfully'
                })
            else:
                return jsonify({
                    'success': False,
                    'error': 'Failed to save lesson to JSON'
                }), 500
        
        else:
            # ============================================================
            # ✅ HANDLE JSON (compatibility)
            # ============================================================
            data = request.get_json()
            if not data:
                return jsonify({'success': False, 'error': 'No data provided'}), 400
            
            if not data.get('title') or not data.get('description'):
                return jsonify({'success': False, 'error': 'Title and Description are required'}), 400
            
            title = sanitize_html(data.get('title', '').strip())
            data['title'] = title
            data['description'] = sanitize_html(data.get('description', '').strip())
            if data.get('content'):
                data['content'] = sanitize_html(data['content'].strip())
            if data.get('subtext'):
                data['subtext'] = sanitize_html(data['subtext'].strip())
            
            if not data.get('slug'):
                data['slug'] = slugify(title)
            
            data['created_at'] = datetime.now().isoformat()
            data['updated_at'] = datetime.now().isoformat()
            
            result = json_service.create('replication_lessons.json', data)
            audit.log_action(user=current_user.username, action='CREATE_REPLICATION_LESSON', details={'title': data['title']})
            
            if result:
                return jsonify({'success': True, 'data': result, 'message': 'Lesson created successfully'})
            else:
                return jsonify({'success': False, 'error': 'Failed to save lesson'}), 500
        
    except Exception as e:
        audit.log_action(
            user=current_user.username if current_user.is_authenticated else 'Unknown',
            action='CREATE_REPLICATION_LESSON_ERROR',
            details={'error': str(e)}
        )
        return jsonify({'success': False, 'error': str(e)}), 400


# ================================================================
# ✅ ADD THIS - GET SINGLE LESSON (For View Modal)
# ================================================================

@api_bp.route('/replication-lessons/<int:id>', methods=['GET'])

def api_get_replication_lesson(id):
    """
    Get a single replication lesson by ID.
    Used by the View modal to display full details.
    """
    try:
        lesson = json_service.get_by_id('replication_lessons.json', id)
        if not lesson:
            return jsonify({'error': 'Lesson not found'}), 404
        return jsonify(lesson)
    except Exception as e:
        print(f"Error getting replication lesson: {e}")
        return jsonify({'error': str(e)}), 400


@api_bp.route('/replication-lessons/<int:id>', methods=['PUT'])
@limiter.limit("30 per minute")
@login_required
def api_update_replication_lesson(id):
    """Update a replication lesson. Supports both FormData and JSON."""
    try:
        # Get existing lesson
        existing = json_service.get_by_id('replication_lessons.json', id)
        if not existing:
            return jsonify({'error': 'Not found'}), 404
        
        # ============================================================
        # CHECK IF REQUEST IS FORM DATA OR JSON
        # ============================================================
        is_form_data = request.content_type and 'multipart/form-data' in request.content_type
        
        if is_form_data:
            # ============================================================
            # ✅ HANDLE FORM DATA
            # ============================================================
            
            # Get fields from request.form
            title = request.form.get('title', '').strip()
            description = request.form.get('description', '').strip()
            content = request.form.get('content', '').strip()
            subtext = request.form.get('subtext', '').strip()
            
            # Validate required fields
            if not title:
                return jsonify({'success': False, 'error': 'Title is required'}), 400
            if not description:
                return jsonify({'success': False, 'error': 'Description is required'}), 400
            
            # Sanitize inputs
            title = sanitize_html(title)
            description = sanitize_html(description)
            if content:
                content = sanitize_html(content)
            if subtext:
                subtext = sanitize_html(subtext)
            
            # Auto-generate slug
            slug = slugify(title)
            if not slug:
                slug = f"lesson-{int(datetime.now().timestamp())}"
            
            # Build updated data
            updated_data = {
                'title': title,
                'slug': slug,
                'description': description,
                'updated_at': datetime.now().isoformat()
            }
            
            if content:
                updated_data['content'] = content
            if subtext:
                updated_data['subtext'] = subtext
            
            # Keep created_at from existing
            updated_data['created_at'] = existing.get('created_at', datetime.now().isoformat())
            
            print(f"FormData - Updated lesson data: {updated_data}")
            
            # Save to JSON
            result = json_service.update('replication_lessons.json', id, updated_data)
            
            audit.log_action(
                user=current_user.username,
                action='UPDATE_REPLICATION_LESSON',
                details={'id': id, 'title': title}
            )
            
            if not result:
                return jsonify({'error': 'Not found'}), 404
            
            return jsonify({'success': True, 'data': result, 'message': 'Lesson updated successfully'})
        
        else:
            # ============================================================
            # ✅ HANDLE JSON
            # ============================================================
            data = request.get_json()
            if not data:
                return jsonify({'success': False, 'error': 'No data provided'}), 400
            
            if data.get('title'):
                data['title'] = sanitize_html(data['title'].strip())
            if data.get('description'):
                data['description'] = sanitize_html(data['description'].strip())
            if data.get('content'):
                data['content'] = sanitize_html(data['content'].strip())
            if data.get('subtext'):
                data['subtext'] = sanitize_html(data['subtext'].strip())
            data['updated_at'] = datetime.now().isoformat()
            
            result = json_service.update('replication_lessons.json', id, data)
            if not result:
                return jsonify({'error': 'Not found'}), 404
            
            audit.log_action(
                user=current_user.username,
                action='UPDATE_REPLICATION_LESSON',
                details={'id': id, 'title': data.get('title')}
            )
            
            return jsonify({'success': True, 'data': result, 'message': 'Lesson updated successfully'})
        
    except Exception as e:
        audit.log_action(
            user=current_user.username if current_user.is_authenticated else 'Unknown',
            action='UPDATE_REPLICATION_LESSON_ERROR',
            details={'id': id, 'error': str(e)}
        )
        return jsonify({'success': False, 'error': str(e)}), 400


        

@api_bp.route('/replication-lessons/<int:id>', methods=['DELETE'])
@limiter.limit("10 per minute")
@login_required
def api_delete_replication_lesson(id):
    """Delete a replication lesson."""
    try:
        lesson = json_service.get_by_id('replication_lessons.json', id)
        if lesson:
            audit.log_action(user=current_user.username, action='DELETE_REPLICATION_LESSON', details={'id': id})
        result = json_service.delete('replication_lessons.json', id)
        if not result:
            return jsonify({'error': 'Not found'}), 404
        return jsonify({'success': True, 'message': 'Lesson deleted successfully'})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 400




# ================================================================
# Error Handlers for API
# ================================================================

@api_bp.errorhandler(404)
def api_not_found(error):
    return jsonify({'error': 'Resource not found'}), 404


@api_bp.errorhandler(500)
def api_internal_error(error):
    return jsonify({'error': 'Internal server error'}), 500