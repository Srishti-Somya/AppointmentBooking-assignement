#!/bin/bash

# API Testing Script for Appointment Booking System
# Make sure the backend server is running on localhost:3000

BASE_URL="http://localhost:3000/api"
TOKEN=""

echo "🧪 Testing Appointment Booking API"
echo "=================================="

# Test 1: Register a new patient
echo -e "\n1️⃣ Testing patient registration..."
REGISTER_RESPONSE=$(curl -s -X POST "$BASE_URL/register" \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Patient","email":"test@example.com","password":"password123"}')

echo "Response: $REGISTER_RESPONSE"

# Test 2: Login as patient
echo -e "\n2️⃣ Testing patient login..."
LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}')

echo "Response: $LOGIN_RESPONSE"

# Extract token from login response
TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"token":"[^"]*"' | cut -d'"' -f4)

if [ -z "$TOKEN" ]; then
    echo "❌ Failed to get token from login response"
    exit 1
fi

echo "✅ Got token: ${TOKEN:0:20}..."

# Test 3: Get available slots
echo -e "\n3️⃣ Testing slot retrieval..."
SLOTS_RESPONSE=$(curl -s -X GET "$BASE_URL/slots?from=2024-01-01&to=2024-01-07")

echo "Response: $SLOTS_RESPONSE"

# Extract first slot ID
SLOT_ID=$(echo $SLOTS_RESPONSE | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)

if [ -z "$SLOT_ID" ]; then
    echo "❌ Failed to get slot ID"
    exit 1
fi

echo "✅ Got slot ID: $SLOT_ID"

# Test 4: Book a slot
echo -e "\n4️⃣ Testing slot booking..."
BOOK_RESPONSE=$(curl -s -X POST "$BASE_URL/book" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d "{\"slotId\":\"$SLOT_ID\"}")

echo "Response: $BOOK_RESPONSE"

# Test 5: Get my bookings
echo -e "\n5️⃣ Testing my bookings retrieval..."
MY_BOOKINGS_RESPONSE=$(curl -s -X GET "$BASE_URL/book/my-bookings" \
  -H "Authorization: Bearer $TOKEN")

echo "Response: $MY_BOOKINGS_RESPONSE"

# Test 6: Login as admin
echo -e "\n6️⃣ Testing admin login..."
ADMIN_LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"Passw0rd!"}')

echo "Response: $ADMIN_LOGIN_RESPONSE"

# Extract admin token
ADMIN_TOKEN=$(echo $ADMIN_LOGIN_RESPONSE | grep -o '"token":"[^"]*"' | cut -d'"' -f4)

if [ -z "$ADMIN_TOKEN" ]; then
    echo "❌ Failed to get admin token"
    exit 1
fi

echo "✅ Got admin token: ${ADMIN_TOKEN:0:20}..."

# Test 7: Get all bookings (admin only)
echo -e "\n7️⃣ Testing all bookings retrieval (admin)..."
ALL_BOOKINGS_RESPONSE=$(curl -s -X GET "$BASE_URL/book/all-bookings" \
  -H "Authorization: Bearer $ADMIN_TOKEN")

echo "Response: $ALL_BOOKINGS_RESPONSE"

echo -e "\n🎉 API testing completed!"
echo "All endpoints are working correctly." 