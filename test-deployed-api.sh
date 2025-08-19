#!/bin/bash

# Test script for deployed backend
# Replace YOUR_BACKEND_URL with your actual Render URL

BACKEND_URL="https://your-app.onrender.com"

echo "🧪 Testing Deployed Backend API"
echo "================================"

echo ""
echo "1. 🔍 Health Check:"
echo "GET $BACKEND_URL/health"
curl -s "$BACKEND_URL/health" | jq '.' || curl -s "$BACKEND_URL/health"

echo ""
echo ""
echo "2. 📋 Get Available Slots:"
echo "GET $BACKEND_URL/api/slots"
curl -s "$BACKEND_URL/api/slots" | jq '.' || curl -s "$BACKEND_URL/api/slots"

echo ""
echo ""
echo "3. 📝 Test User Registration:"
echo "POST $BACKEND_URL/api/register"
curl -s -X POST "$BACKEND_URL/api/register" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123"
  }' | jq '.' || curl -s -X POST "$BACKEND_URL/api/register" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123"
  }'

echo ""
echo ""
echo "4. 🔑 Test Login:"
echo "POST $BACKEND_URL/api/login"
curl -s -X POST "$BACKEND_URL/api/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "Passw0rd!"
  }' | jq '.' || curl -s -X POST "$BACKEND_URL/api/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "Passw0rd!"
  }'

echo ""
echo ""
echo "✅ Testing complete!"
echo "📝 Note: Replace 'https://your-app.onrender.com' with your actual Render URL"
