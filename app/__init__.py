# ================================================================
# BRIDGE-AI Kenya - Application Factory (JSON Version)
# ================================================================

import os
import logging
from datetime import datetime
from logging.handlers import RotatingFileHandler
from flask import Flask, render_template, request, redirect

from app.config import get_config
from app.extensions import (
    csrf,
    limiter,
    login_manager,
    mail,
    # ❌ REMOVED: uploads, photos, documents, videos
    init_extensions
)
from app.services.json_service import JSONService


def create_app(config_name=None):
    """
    Application factory function.
    Creates and configures the Flask application.
    """
    
    # Create Flask app
    app = Flask(__name__)
    
    # Load configuration
    if config_name is None:
        config_name = os.environ.get('FLASK_ENV', 'development')
    
    app.config.from_object(get_config())
    
    # Ensure instance folder exists
    try:
        os.makedirs(app.instance_path, exist_ok=True)
    except OSError:
        pass
    
    # Ensure data folder exists for JSON files
    data_folder = app.config.get('DATA_FOLDER', 'app/data')
    try:
        os.makedirs(data_folder, exist_ok=True)
    except OSError:
        pass
    
    # Initialize extensions (NO flask_uploads)
    init_extensions(app)
    
    # ============================================================
    # Register Blueprints / Routes
    # ============================================================
    
    from app.routes import public_bp, admin_bp, api_bp
    app.register_blueprint(public_bp)
    app.register_blueprint(admin_bp, url_prefix='/admin')
    app.register_blueprint(api_bp, url_prefix='/api')
    
    # ============================================================
    # HTTPS Redirect (Production)
    # ============================================================
    
    @app.before_request
    def before_request():
        """Force HTTPS in production."""
        if app.config.get('FLASK_ENV') == 'production':
            if request.headers.get('X-Forwarded-Proto') == 'http':
                return redirect(request.url.replace('http://', 'https://'), 301)
    
    # ============================================================
    # Context Processor - Make data available to all templates
    # ============================================================
    
    @app.context_processor
    def inject_global_data():
        """Inject global variables into all templates."""
        json_service = JSONService()
        
        stats = {
            'activities': len(json_service.get_all('activities.json')),
            'published_activities': len([a for a in json_service.get_all('activities.json') if a.get('evidence_status') == 'published']),
            'events': len(json_service.get_all('events.json')),
            'upcoming_events': len([e for e in json_service.get_all('events.json') if e.get('status') == 'upcoming']),
            'resources': len(json_service.get_all('resources.json')),
            'partners': len(json_service.get_all('partners.json')),
            'team': len(json_service.get_all('team.json')),
            'albums': len(json_service.get_all('gallery.json')),
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
        
        return {
            'PROJECT_ACRONYM': app.config.get('PROJECT_ACRONYM', 'BRIDGE-AI'),
            'PROJECT_FULL_NAME': app.config.get('PROJECT_FULL_NAME', ''),
            'GRANT_AGREEMENT': app.config.get('GRANT_AGREEMENT', ''),
            'EU_FUNDING_STATEMENT': app.config.get('EU_FUNDING_STATEMENT', ''),
            'EU_DISCLAIMER': app.config.get('EU_DISCLAIMER', ''),
            'PARTNERS': app.config.get('PARTNERS', []),
            'COUNTRIES': app.config.get('COUNTRIES', []),
            'KENYA_SITE': app.config.get('KENYA_SITE', ''),
            'stats': stats,
        }
    
    # ============================================================
    # Error Handlers
    # ============================================================
    
    @app.errorhandler(404)
    def page_not_found(error):
        return render_template('404.html'), 404
    
    @app.errorhandler(403)
    def forbidden(error):
        return render_template('403.html'), 403
    
    @app.errorhandler(500)
    def internal_error(error):
        return render_template('500.html'), 500
    
    # ============================================================
    # CLI Commands
    # ============================================================
    
    @app.cli.command('seed')
    def seed_database():
        """Seed the JSON data files with initial data."""
        from werkzeug.security import generate_password_hash
        
        json_service = JSONService()
        
        print("🌱 Seeding JSON data files...")
        
        # ============================================================
        # Seed Users
        # ============================================================
        
        admin_username = app.config.get('ADMIN_USERNAME', 'admin')
        admin_password = app.config.get('ADMIN_PASSWORD', 'changeme123')
        admin_email = app.config.get('ADMIN_EMAIL', 'admin@jkuat.ac.ke')
        
        users = json_service.get_all('users.json')
        existing_admin = None
        for u in users:
            if u.get('username') == admin_username:
                existing_admin = u
                break
        
        if not existing_admin:
            admin_user = {
                'username': admin_username,
                'password_hash': generate_password_hash(admin_password),
                'email': admin_email,
                'full_name': 'Admin User',
                'role': 'admin',
                'is_active': True,
                'last_login': None,
                'created_at': datetime.now().isoformat(),
                'updated_at': datetime.now().isoformat()
            }
            json_service.create('users.json', admin_user)
            print(f"✅ Admin user '{admin_username}' created.")
        else:
            print(f"ℹ️ Admin user '{admin_username}' already exists.")
        
        # ============================================================
        # Seed Partners
        # ============================================================
        
        partners_data = [
            {
                'name': 'FUNDACIO EURECAT',
                'short_name': 'EURECAT',
                'country': 'Spain',
                'role': 'Coordinator',
                'description': 'Leading the BRIDGE-AI project coordination and technical development.',
                'website': 'https://eurecat.org',
                'logo': 'logos/partners/eurecat.svg',
                'display_order': 1,
                'is_consortium': True
            },
            {
                'name': 'Universidad Politecnica de Madrid',
                'short_name': 'UPM',
                'country': 'Spain',
                'role': 'Beneficiary',
                'description': 'Leading technical development of GenAI models and digital shadows.',
                'website': 'https://upm.es',
                'logo': 'logos/partners/upm.svg',
                'display_order': 2,
                'is_consortium': True
            },
            {
                'name': 'Jomo Kenyatta University of Agriculture and Technology',
                'short_name': 'JKUAT',
                'country': 'Kenya',
                'role': 'Beneficiary - WP5 Lead',
                'description': 'Host of the Smart Mushroom case-study and WP5 Capacity Building lead.',
                'website': 'https://jkuat.ac.ke',
                'logo': 'logos/partners/jkuat.svg',
                'display_order': 3,
                'is_consortium': True
            },
            {
                'name': 'University of Sousse',
                'short_name': 'US',
                'country': 'Tunisia',
                'role': 'Beneficiary',
                'description': 'Research partner for North Africa use-cases.',
                'website': 'https://usousse.rnu.tn',
                'logo': 'logos/partners/us.svg',
                'display_order': 4,
                'is_consortium': True
            },
            {
                'name': 'STE LIFEYE SARL',
                'short_name': 'MOOME',
                'country': 'Tunisia',
                'role': 'Beneficiary',
                'description': 'SME partner for innovative agricultural solutions.',
                'website': 'https://lifeye.tn',
                'logo': 'logos/partners/moome.svg',
                'display_order': 5,
                'is_consortium': True
            },
            {
                'name': 'AgroInfoTech Labs Limited',
                'short_name': 'AGROINFOTECH',
                'country': 'Nigeria',
                'role': 'Beneficiary',
                'description': 'Agritech innovation partner for Nigeria.',
                'website': 'https://agroinfotech.com',
                'logo': 'logos/partners/agroinfotech.svg',
                'display_order': 6,
                'is_consortium': True
            },
            {
                'name': 'Austria Card',
                'short_name': 'ACV',
                'country': 'Austria',
                'role': 'Beneficiary',
                'description': 'Technology and security partner.',
                'website': 'https://austriacard.com',
                'logo': 'logos/partners/acv.svg',
                'display_order': 7,
                'is_consortium': True
            },
            {
                'name': 'Seamless Middleware Technologies SL',
                'short_name': 'SMW',
                'country': 'Spain',
                'role': 'Beneficiary',
                'description': 'Middleware and platform integration partner.',
                'website': 'https://seamlessmw.com',
                'logo': 'logos/partners/smw.svg',
                'display_order': 8,
                'is_consortium': True
            }
        ]
        
        existing_partners = json_service.get_all('partners.json')
        existing_short_names = [p.get('short_name') for p in existing_partners]
        
        for data in partners_data:
            if data['short_name'] not in existing_short_names:
                json_service.create('partners.json', data)
                print(f"✅ Partner '{data['short_name']}' created.")
            else:
                print(f"ℹ️ Partner '{data['short_name']}' already exists.")
        
        # ============================================================
        # Seed FAQs
        # ============================================================
        
        faqs_data = [
            {
                'question': 'What is BRIDGE-AI?',
                'answer': 'BRIDGE-AI (Building ResIlient Development with GEnerative AI in Education & Agriculture) is a Horizon Europe Research and Innovation Action that aims to improve African rural societies by integrating GenAI-based solutions into agricultural optimisation and digital skills acquisition. The project operates across Kenya, Tunisia and Nigeria.',
                'audience_tag': 'public',
                'category': 'general',
                'display_order': 1,
                'reviewer': 'System',
                'is_published': True
            },
            {
                'question': 'What is the Smart Mushroom project?',
                'answer': 'The Smart Mushroom project is JKUAT\'s flagship agritech initiative using IoT sensors, GenAI analytics, and low-bandwidth dashboards to help Kenyan mushroom farmers monitor and optimize growing conditions. It uses a 40-foot shipping container as a climate-controlled grow room with remote smartphone access. The project has reached over 400,000 farmers across Kenya.',
                'audience_tag': 'farmers',
                'category': 'pilot',
                'display_order': 2,
                'reviewer': 'System',
                'is_published': True
            },
            {
                'question': 'How can I participate in training?',
                'answer': 'Visit our Training & WP5 page to register for upcoming bootcamps and workshops. You can also express interest through our contact form. Training includes hands-on experience with IoT sensors, GenAI tools, and Smart Mushroom monitoring.',
                'audience_tag': 'youth',
                'category': 'training',
                'display_order': 3,
                'reviewer': 'System',
                'is_published': True
            },
            {
                'question': 'Who can I contact for more information?',
                'answer': 'You can use our Contact page to send a message to the JKUAT project team. We\'ll respond to your enquiry as soon as possible. You can also follow us on social media for updates.',
                'audience_tag': 'public',
                'category': 'general',
                'display_order': 4,
                'reviewer': 'System',
                'is_published': True
            },
            {
                'question': 'What technology is used in the Smart Mushroom pilot?',
                'answer': 'The Smart Mushroom pilot uses: (1) IoT sensors for temperature, humidity, CO₂, and light monitoring, (2) PID control loops for automated climate regulation, (3) GenAI for predictive analytics and anomaly detection, (4) Digital Shadows for scenario testing, and (5) Swahili NLP voice alerts for farmers.',
                'audience_tag': 'farmers',
                'category': 'technology',
                'display_order': 5,
                'reviewer': 'System',
                'is_published': True
            },
            {
                'question': 'How does BRIDGE-AI support capacity building?',
                'answer': 'JKUAT leads WP5 which focuses on capacity building through: (1) Hands-on bootcamps at JKUAT Smart Farm Zone, (2) SME mentoring programs, (3) Open training repositories, (4) Replication toolkits, and (5) Hackathons and innovation challenges.',
                'audience_tag': 'students',
                'category': 'wp5',
                'display_order': 6,
                'reviewer': 'System',
                'is_published': True
            }
        ]
        
        existing_faqs = json_service.get_all('faqs.json')
        existing_questions = [f.get('question') for f in existing_faqs]
        
        for data in faqs_data:
            if data['question'] not in existing_questions:
                json_service.create('faqs.json', data)
                print(f"✅ FAQ '{data['question'][:30]}...' created.")
            else:
                print(f"ℹ️ FAQ '{data['question'][:30]}...' already exists.")
        
        # ============================================================
        # Seed Settings
        # ============================================================
        
        settings = json_service.get_settings()
        if not settings:
            import json
            default_settings = {
                'site_title': 'BRIDGE-AI Kenya',
                'site_description': 'AI for African Agriculture - GenAI, IoT and digital skills for climate-smart mushroom farming',
                'site_tagline': 'Generative AI, IoT sensing and digital skills for climate-smart mushroom farming and rural innovation.',
                'footer_text': '© 2026 BRIDGE-AI Kenya | JKUAT - Jomo Kenyatta University of Agriculture and Technology',
                'eu_funding_statement': app.config.get('EU_FUNDING_STATEMENT', ''),
                'eu_disclaimer': app.config.get('EU_DISCLAIMER', ''),
                'counters': {
                    'activities': 0,
                    'participants_trained': 0,
                    'women_youth_percentage': 0,
                    'events': 0,
                    'resources': 0,
                    'smes_mentored': 0
                },
                'social_links': {
                    'linkedin': 'https://linkedin.com/company/bridge-ai',
                    'youtube': 'https://youtube.com/@bridge-ai',
                    'twitter': 'https://twitter.com/bridge_ai',
                    'facebook': 'https://facebook.com/bridge-ai'
                },
                'contact': {
                    'email': 'bridge-ai@jkuat.ac.ke',
                    'phone': '+254-XXX-XXXX',
                    'address': 'JKUAT Smart Farm Zone, Juja, Kenya'
                },
                'updated_at': datetime.now().isoformat()
            }
            
            settings_file = os.path.join(app.config.get('DATA_FOLDER', 'app/data'), 'settings.json')
            with open(settings_file, 'w', encoding='utf-8') as f:
                json.dump({'settings': default_settings}, f, indent=2, ensure_ascii=False)
            print("✅ Settings created.")
        else:
            print("ℹ️ Settings already exist.")
        
        print("✅ JSON data seeding complete!")
    
    # ============================================================
    # Setup Logging
    # ============================================================
    
    if not app.debug and not app.testing:
        log_dir = os.path.dirname(app.config.get('LOG_FILE', 'logs/app.log'))
        try:
            os.makedirs(log_dir, exist_ok=True)
        except OSError:
            pass
        
        file_handler = RotatingFileHandler(
            app.config.get('LOG_FILE', 'logs/app.log'),
            maxBytes=10485760,
            backupCount=10
        )
        file_handler.setLevel(logging.INFO)
        
        formatter = logging.Formatter(
            '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
        )
        file_handler.setFormatter(formatter)
        
        app.logger.addHandler(file_handler)
        app.logger.setLevel(logging.INFO)
        app.logger.info('Application startup')
    
    return app


# ================================================================
# Create application instance (for import)
# ================================================================

app = create_app()