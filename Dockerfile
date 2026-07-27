# ================================================================
# BRIDGE-AI KENYA - Dockerfile (JSON Version)
# ================================================================
# This Dockerfile builds a container for the application.
# Uses Python 3.11 with JSON file storage.
# Optimized for Render deployment.
# ================================================================

# Use Python 3.11 slim image
FROM python:3.11-slim

# ================================================================
# Metadata
# ================================================================

LABEL maintainer="BRIDGE-AI Kenya <bridge-ai@jkuat.ac.ke>"
LABEL description="BRIDGE-AI Kenya Web Application"
LABEL version="1.0.0"

# ================================================================
# Environment Variables
# ================================================================

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    FLASK_APP=run.py \
    FLASK_ENV=production \
    PYTHONPATH=/app \
    TZ=Africa/Nairobi

# ================================================================
# Install System Dependencies
# ================================================================

RUN apt-get update && apt-get install -y \
    gcc \
    curl \
    && rm -rf /var/lib/apt/lists/*

# ================================================================
# Set Working Directory
# ================================================================

WORKDIR /app

# ================================================================
# Install Python Dependencies
# ================================================================

# Copy requirements first for better caching
COPY requirements.txt ./

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# ================================================================
# Copy Application Code
# ================================================================

COPY . .

# ================================================================
# Create Required Directories
# ================================================================

RUN mkdir -p /app/app/data \
    /app/app/static/uploads/activities \
    /app/app/static/uploads/stories \
    /app/app/static/uploads/replication \
    /app/app/static/uploads/gallery \
    /app/logs

# ================================================================
# Create Non-Root User and Set Permissions
# ================================================================

RUN adduser --disabled-password --gecos '' appuser && \
    chown -R appuser:appuser /app

# ================================================================
# Switch to Non-Root User
# ================================================================

USER appuser

# ================================================================
# Expose Port
# ================================================================

EXPOSE 5000

# ================================================================
# Run the Application
# ================================================================

CMD ["gunicorn", "--bind", "0.0.0.0:5000", "--workers", "4", "--timeout", "120", "--chdir", "/app", "wsgi:app"]