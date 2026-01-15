#!/bin/bash

echo "🌱 Seeding database with test data..."
echo ""

# Seed the database
RESPONSE=$(curl -s -X POST http://localhost:3000/api/seed)

# Parse JSON response
SUCCESS=$(echo $RESPONSE | python3 -c "import sys, json; print(json.load(sys.stdin).get('success', False))" 2>/dev/null)

if [ "$SUCCESS" = "True" ]; then
    echo "✅ Database seeded successfully!"
    echo ""
    echo "📊 Stats:"
    echo $RESPONSE | python3 -c "import sys, json; data=json.load(sys.stdin); print(f\"  Users: {data['stats']['users']}\n  Stores: {data['stats']['stores']}\n  Promotions: {data['stats']['promotions']}\n  Metrics: {data['stats']['metrics']}\")" 2>/dev/null
    echo ""
    echo "🔐 Test User Credentials:"
    echo "  Email: develop@test.com"
    echo "  Password: test123"
    echo ""
    echo "🚀 You can now login and test the application!"
else
    echo "❌ Failed to seed database"
    echo $RESPONSE | python3 -m json.tool 2>/dev/null
    exit 1
fi
