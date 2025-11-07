#!/bin/bash

echo "🚀 Starting build process..."

# Collect static files
echo "📦 Collecting static files..."
python manage.py collectstatic --no-input

# Run migrations
echo "🗄️ Running database migrations..."
python manage.py migrate --no-input

echo "✅ Build completed successfully!"
