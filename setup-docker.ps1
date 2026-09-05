# BRIDGE-AI Angular - Docker Setup Script

Write-Host "Creating Docker files for BRIDGE-AI Angular..." -ForegroundColor Green
Write-Host ""

Write-Host "Creating .dockerignore..." -ForegroundColor Yellow

@'
node_modules/
npm-debug.log
dist/
.angular/
__pycache__/
*.pyc
*.pyo
.env
.env.local
.env.*.local
.vscode/
.idea/
*.swp
.git/
.gitignore
logs/
*.log
.DS_Store
Thumbs.db
Dockerfile*
docker-compose*
.dockerignore
*.md
*.txt
*.ps1
*.sh
'@ | Out-File -FilePath ".dockerignore" -Encoding utf8

Write-Host "  Created: .dockerignore" -ForegroundColor Gray

Write-Host ""
Write-Host "Creating Dockerfile..." -ForegroundColor Yellow

@'
FROM node:20-alpine AS frontend-build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build -- --prod

FROM python:3.10-slim
WORKDIR /app
RUN apt-get update && apt-get install -y gcc && rm -rf /var/lib/apt/lists/*
COPY backend/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt
COPY backend/ ./backend/
COPY --from=frontend-build /app/dist/bridge-ai-angular/browser ./static
WORKDIR /app/backend
EXPOSE 5000
CMD ["gunicorn", "run:app", "--bind", "0.0.0.0:5000", "--config", "gunicorn.conf.py"]
'@ | Out-File -FilePath "Dockerfile" -Encoding utf8

Write-Host "  Created: Dockerfile" -ForegroundColor Gray

Write-Host ""
Write-Host "Creating Dockerfile.prod..." -ForegroundColor Yellow

@'
FROM node:20-alpine AS frontend-build
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build -- --prod

FROM python:3.10-slim
WORKDIR /app
RUN apt-get update && apt-get install -y gcc && rm -rf /var/lib/apt/lists/*
COPY backend/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt
COPY backend/ ./backend/
COPY --from=frontend-build /app/dist/bridge-ai-angular/browser ./static
WORKDIR /app/backend
RUN adduser --disabled-password --gecos '' appuser && chown -R appuser /app
USER appuser
EXPOSE 5000
CMD ["gunicorn", "run:app", "--bind", "0.0.0.0:5000", "--config", "gunicorn.conf.py", "--worker-class", "sync", "--workers", "2"]
'@ | Out-File -FilePath "Dockerfile.prod" -Encoding utf8

Write-Host "  Created: Dockerfile.prod" -ForegroundColor Gray

Write-Host ""
Write-Host "Creating docker-compose.yml..." -ForegroundColor Yellow

@'
version: '3.8'

services:
  backend:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: bridge-ai-backend
    ports:
      - "5000:5000"
    environment:
      - FLASK_ENV=development
      - FLASK_DEBUG=1
      - CLOUDINARY_CLOUD_NAME=${CLOUDINARY_CLOUD_NAME}
      - CLOUDINARY_API_KEY=${CLOUDINARY_API_KEY}
      - CLOUDINARY_API_SECRET=${CLOUDINARY_API_SECRET}
    volumes:
      - ./backend:/app/backend
      - ./backend/data:/app/backend/data
    restart: unless-stopped

  frontend:
    image: node:20-alpine
    container_name: bridge-ai-frontend
    working_dir: /app
    ports:
      - "4200:4200"
    volumes:
      - ./:/app
    command: sh -c "npm install && npm start"
    restart: unless-stopped
'@ | Out-File -FilePath "docker-compose.yml" -Encoding utf8

Write-Host "  Created: docker-compose.yml" -ForegroundColor Gray

Write-Host ""
Write-Host "Creating docker-compose.prod.yml..." -ForegroundColor Yellow

@'
version: '3.8'

services:
  backend:
    build:
      context: .
      dockerfile: Dockerfile.prod
    container_name: bridge-ai-backend-prod
    ports:
      - "5000:5000"
    environment:
      - FLASK_ENV=production
      - FLASK_DEBUG=0
      - CLOUDINARY_CLOUD_NAME=${CLOUDINARY_CLOUD_NAME}
      - CLOUDINARY_API_KEY=${CLOUDINARY_API_KEY}
      - CLOUDINARY_API_SECRET=${CLOUDINARY_API_SECRET}
    restart: always
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:5000/api/activities"]
      interval: 30s
      timeout: 10s
      retries: 3
'@ | Out-File -FilePath "docker-compose.prod.yml" -Encoding utf8

Write-Host "  Created: docker-compose.prod.yml" -ForegroundColor Gray

Write-Host ""
Write-Host "============================================================" -ForegroundColor Green
Write-Host "DOCKER FILES CREATED SUCCESSFULLY!" -ForegroundColor Green
Write-Host "============================================================" -ForegroundColor Green
Write-Host ""
Write-Host "Files created:" -ForegroundColor Yellow
Write-Host "  - .dockerignore" -ForegroundColor White
Write-Host "  - Dockerfile" -ForegroundColor White
Write-Host "  - Dockerfile.prod" -ForegroundColor White
Write-Host "  - docker-compose.yml" -ForegroundColor White
Write-Host "  - docker-compose.prod.yml" -ForegroundColor White
Write-Host ""
Write-Host "Docker commands:" -ForegroundColor Yellow
Write-Host "  Build:     docker build -t bridge-ai-app ." -ForegroundColor Cyan
Write-Host "  Run:       docker run -p 5000:5000 bridge-ai-app" -ForegroundColor Cyan
Write-Host "  Compose:   docker-compose up" -ForegroundColor Cyan
Write-Host ""
Write-Host "============================================================" -ForegroundColor Green