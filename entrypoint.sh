#!/bin/bash
# ================================================================
# BRIDGE-AI KENYA - Docker Entrypoint Script (JSON Version)
# ================================================================
# This script runs when the Docker container starts.
# No database required - uses JSON file storage.
# ================================================================

set -e

# ================================================================
# Colors for output
# ================================================================

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}============================================================${NC}"
echo -e "${BLUE}  BRIDGE-AI Kenya - Docker Entrypoint${NC}"
echo -e "${BLUE}============================================================${NC}"

# ================================================================
# Display configuration
# ================================================================

echo -e "${YELLOW}📋 Configuration:${NC}"
echo -e "  FLASK_ENV: ${FLASK_ENV:-development}"
echo -e "  DATA_FOLDER: ${DATA_FOLDER:-app/data}"
echo -e "  ADMIN_USERNAME: ${ADMIN_USERNAME:-admin}"

# ================================================================
# Create necessary directories
# ================================================================

echo -e "${YELLOW}📁 Creating required directories...${NC}"

# Ensure JSON data directory exists
mkdir -p ${DATA_FOLDER:-app/data}

# Ensure upload directories exist
mkdir -p app/static/images/uploads
mkdir -p app/static/images/uploads/activities
mkdir -p app/static/images/uploads/events
mkdir -p app/static/images/uploads/team
mkdir -p app/static/images/uploads/resources
mkdir -p app/static/images/gallery
mkdir -p app/static/images/hero
mkdir -p logs

echo -e "${GREEN}✅ Directories created!${NC}"

# ================================================================
# Seed data (first time only)
# ================================================================

if [ "$FLASK_ENV" = "development" ] || [ "$SEED_DATA" = "true" ]; then
    echo -e "${YELLOW}🌱 Seeding JSON data...${NC}"
    
    # Check if seed command exists in Flask app
    if flask seed 2>/dev/null; then
        echo -e "${GREEN}✅ JSON data seeded successfully!${NC}"
    else
        echo -e "${YELLOW}⚠️  Seed command not available or already seeded.${NC}"
    fi
fi

# ================================================================
# Display JSON data files
# ================================================================

echo -e "${YELLOW}📄 JSON Data Files:${NC}"
if [ -d "${DATA_FOLDER:-app/data}" ]; then
    ls -la ${DATA_FOLDER:-app/data}/*.json 2>/dev/null || echo -e "  (No JSON files found yet)"
else
    echo -e "  (Data folder not found)"
fi

# ================================================================
# Start the application
# ================================================================

echo -e "${BLUE}============================================================${NC}"
echo -e "${GREEN}🚀 Starting BRIDGE-AI Kenya...${NC}"
echo -e "${BLUE}============================================================${NC}"

# Use Gunicorn in production, Flask run in development
if [ "$FLASK_ENV" = "production" ]; then
    echo -e "${GREEN}▶️  Starting Gunicorn (Production)${NC}"
    exec gunicorn --config gunicorn.conf.py wsgi:app
else
    echo -e "${GREEN}▶️  Starting Flask (Development)${NC}"
    exec python run.py
fi