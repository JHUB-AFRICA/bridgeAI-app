FROM node:22-alpine AS frontend-build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM python:3.10-slim
WORKDIR /app
RUN apt-get update && apt-get install -y gcc && rm -rf /var/lib/apt/lists/*
COPY backend/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt
COPY backend/ ./backend/
COPY --from=frontend-build /app/dist/bridge-ai-angular/browser ./static
WORKDIR /app/backend
EXPOSE 5000
CMD ["gunicorn", "run:app", "--config", "gunicorn.conf.py"]
