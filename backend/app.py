import os
import base64
from datetime import datetime
from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from bson.objectid import ObjectId
from dotenv import load_dotenv
from werkzeug.security import generate_password_hash, check_password_hash
import google.generativeai as genai

load_dotenv()
import random

app = Flask(__name__)
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max upload
CORS(app)

# ── Gemini AI setup ─────────────────────────────────────────────
import time as _time
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)
    # Use multiple models as fallback chain
    GEMINI_MODELS = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-flash-latest']
    gemini_model = genai.GenerativeModel(GEMINI_MODELS[0])
    print(f"✅ Gemini AI configured with models: {', '.join(GEMINI_MODELS)}")
else:
    gemini_model = None
    GEMINI_MODELS = []
    print("⚠️  GEMINI_API_KEY not set — AI features disabled")

# MongoDB connection
MONGO_URI = os.getenv("MONGODB_URI", "mongodb://localhost:27017/service_aggregator")
try:
    client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=5000, connectTimeoutMS=5000)
    client.admin.command('ping')
    db = client.get_database()
    print("✅ MongoDB connected successfully")
except Exception as e:
    print(f"⚠️ MongoDB connection failed: {e}")
    print("   Server will start but DB features won't work until MongoDB is reachable.")
    client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=5000, connectTimeoutMS=5000)
    db = client.get_database()

users_col = db.users
providers_col = db.providers
bookings_col = db.bookings

# ── Seed sample providers if empty ──────────────────────────────
try:
    if providers_col.count_documents({}) == 0:
        import random
        def gen_phone():
            return f"+91 {random.randint(9000000000, 9999999999)}"

        elec_img = 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=150&h=150&fit=crop'
        barb_img = 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=150&h=150&fit=crop'
        plumb_img = 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=150&h=150&fit=crop'
        gas_img = 'https://images.unsplash.com/photo-1589802829985-817e51171b92?w=150&h=150&fit=crop'

        sample_providers = [
            {"name": "Rahul Verma",      "service": "Electrician",  "rating": 4.8, "price": "₹400/hr",   "distance": "2.5 km", "reviews": 124, "phone": gen_phone(), "image": elec_img},
            {"name": "Anita Sharma",     "service": "Electrician",  "rating": 4.9, "price": "₹450/hr",   "distance": "1.2 km", "reviews": 89,  "phone": gen_phone(), "image": elec_img},
            {"name": "Deepak Mehra",     "service": "Electrician",  "rating": 4.6, "price": "₹350/hr",   "distance": "3.0 km", "reviews": 56,  "phone": gen_phone(), "image": elec_img},
            {"name": "Vikas Singh",      "service": "Barber",       "rating": 4.7, "price": "₹200/visit", "distance": "0.5 km", "reviews": 210, "phone": gen_phone(), "image": barb_img},
            {"name": "Neha Gupta",       "service": "Barber",       "rating": 4.9, "price": "₹250/visit", "distance": "1.0 km", "reviews": 178, "phone": gen_phone(), "image": barb_img},
            {"name": "Priya Salon",      "service": "Barber",       "rating": 4.5, "price": "₹300/visit", "distance": "1.8 km", "reviews": 95,  "phone": gen_phone(), "image": barb_img},
            {"name": "Surya Plumbings",  "service": "Plumber",      "rating": 4.6, "price": "₹300/hr",   "distance": "3.1 km", "reviews": 67,  "phone": gen_phone(), "image": plumb_img},
            {"name": "AquaFix Services", "service": "Plumber",      "rating": 4.8, "price": "₹350/hr",   "distance": "2.0 km", "reviews": 134, "phone": gen_phone(), "image": plumb_img},
            {"name": "Ravi Gas Services","service": "Gas Service",   "rating": 4.8, "price": "₹150/visit","distance": "0.8 km", "reviews": 202, "phone": gen_phone(), "image": gas_img},
            {"name": "SafeGas Co.",      "service": "Gas Service",   "rating": 4.7, "price": "₹200/visit","distance": "1.5 km", "reviews": 145, "phone": gen_phone(), "image": gas_img},
        ]
        providers_col.insert_many(sample_providers)
        print("✅ Seeded providers collection with sample data")
except Exception as e:
    print(f"⚠️ Could not connect to MongoDB for seeding (it may be down or timing out): {e}")



# ── Routes ──────────────────────────────────────────────────────

@app.route('/api/signup', methods=['POST'])
def signup():
    data = request.json
    email = data.get('email', '').strip()
    name = data.get('name', '').strip()
    password = data.get('password', '')

    if not email or not name or not password:
        return jsonify({"error": "Name, Email, and Password are required"}), 400
        
    if len(password) < 8:
        return jsonify({"error": "Password must be at least 8 characters long"}), 400

    if users_col.find_one({"email": email}):
        return jsonify({"error": "Email already registered. Please log in."}), 400

    hashed_password = generate_password_hash(password)

    user_id = users_col.insert_one({
        "email": email,
        "name": name,
        "password": hashed_password,
        "created_at": datetime.utcnow()
    }).inserted_id

    return jsonify({
        "message": "Signup successful",
        "user": {"id": str(user_id), "name": name, "email": email}
    }), 201


@app.route('/api/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email', '').strip()
    password = data.get('password', '')

    if not email or not password:
        return jsonify({"error": "Email and Password are required"}), 400

    user = users_col.find_one({"email": email})
    if not user:
        return jsonify({"error": "User not found. Please sign up first."}), 404

    if not user.get('password') or not check_password_hash(user['password'], password):
        return jsonify({"error": "Incorrect email or password."}), 401

    return jsonify({
        "message": "Login successful",
        "user": {"id": str(user["_id"]), "name": user["name"], "email": email}
    }), 200


@app.route('/api/services', methods=['GET'])
def get_services():
    base_services = [
        {"id": "electrician",  "name": "Electrician",  "icon": "Zap",      "color": "amber"},
        {"id": "barber",       "name": "Barber",       "icon": "Scissors",  "color": "rose"},
        {"id": "gas-service",  "name": "Gas Service",  "icon": "Flame",     "color": "orange"},
        {"id": "plumber",      "name": "Plumber",      "icon": "Wrench",    "color": "blue"}
    ]
    # Add dynamically registered service types
    existing_ids = {s['id'] for s in base_services}
    dynamic_types = providers_col.distinct("service")
    extra_colors = ['purple', 'teal', 'indigo', 'pink', 'emerald', 'cyan']
    ci = 0
    for stype in dynamic_types:
        sid = stype.lower().replace(' ', '-')
        if sid not in existing_ids:
            base_services.append({"id": sid, "name": stype, "icon": "Wrench", "color": extra_colors[ci % len(extra_colors)]})
            existing_ids.add(sid)
            ci += 1
    return jsonify(base_services), 200


@app.route('/api/providers', methods=['GET'])
def get_providers():
    service_type = request.args.get('service', '')
    query = {}
    if service_type:
        query["service"] = {"$regex": f"^{service_type}$", "$options": "i"}

    providers_cursor = providers_col.find(query)
    providers = []
    for p in providers_cursor:
        p['_id'] = str(p['_id'])
        providers.append(p)

    return jsonify(providers), 200


@app.route('/api/providers/<provider_id>', methods=['GET'])
def get_provider(provider_id):
    try:
        provider = providers_col.find_one({"_id": ObjectId(provider_id)})
    except Exception:
        return jsonify({"error": "Invalid provider ID"}), 400

    if not provider:
        return jsonify({"error": "Provider not found"}), 404

    provider['_id'] = str(provider['_id'])
    return jsonify(provider), 200


@app.route('/api/book', methods=['POST'])
def book_service():
    data = request.json
    user_id = data.get('user_id')
    provider_id = data.get('provider_id')
    date = data.get('date', 'Today')
    time_slot = data.get('time_slot')

    if not all([user_id, provider_id, time_slot]):
        return jsonify({"error": "Missing required fields"}), 400

    booking = {
        "user_id": user_id,
        "provider_id": provider_id,
        "date": date,
        "time_slot": time_slot,
        "status": "confirmed",
        "created_at": datetime.utcnow()
    }

    booking_id = bookings_col.insert_one(booking).inserted_id
    return jsonify({
        "message": "Booking confirmed!",
        "booking_id": str(booking_id)
    }), 201


# ── Gemini Chat ─────────────────────────────────────────────────
@app.route('/api/chat', methods=['POST'])
def chat():
    if not gemini_model:
        return jsonify({"error": "AI service not configured"}), 503
    data = request.json
    message = data.get('message', '').strip()
    history = data.get('history', [])
    user_location = data.get('location', 'Chandigarh')
    if not message:
        return jsonify({"error": "Message is required"}), 400

    # ── Fetch ALL live provider data from MongoDB ──
    db_available = True
    try:
        all_providers = list(providers_col.find({}, {"_id": 0}))
        all_services = providers_col.distinct("service")
        total_providers = providers_col.count_documents({})
        total_users = users_col.count_documents({})
        total_bookings = bookings_col.count_documents({})
    except Exception as db_err:
        print(f"⚠️ Chat: MongoDB unreachable — {db_err}")
        db_available = False
        all_providers = []
        all_services = []
        total_providers = total_users = total_bookings = 0

    # ── Group ALL providers by service category, sorted by rating ──
    from collections import defaultdict
    grouped = defaultdict(list)
    for p in all_providers:
        grouped[p.get('service', 'Other')].append(p)

    # Sort each group by rating (highest first), then distance (closest first)
    for svc in grouped:
        grouped[svc].sort(key=lambda p: (-float(p.get('rating', 0)), float(str(p.get('distance', '99')).replace(' km', '').strip() or '99')))

    # Build a detailed, grouped provider listing
    provider_blocks = []
    for svc in sorted(grouped.keys()):
        lines = [f"\n### {svc}s ({len(grouped[svc])} registered)"]
        for i, p in enumerate(grouped[svc], 1):
            lines.append(
                f"  {i}. **{p.get('name', 'Unknown')}**\n"
                f"     - Rating: {p.get('rating', 'N/A')}⭐ ({p.get('reviews', 0)} reviews)\n"
                f"     - Price: {p.get('price', 'N/A')}\n"
                f"     - Distance from user: {p.get('distance', 'N/A')}\n"
                f"     - Phone: {p.get('phone', 'N/A')}\n"
                f"     - Email: {p.get('email', 'N/A')}\n"
                f"     - Description: {p.get('description', 'Professional service provider')}"
            )
        provider_blocks.append("\n".join(lines))

    all_provider_data = "\n".join(provider_blocks) if provider_blocks else "No providers registered yet."

    # Build DB status notice for the AI
    db_status_notice = ""
    if not db_available:
        db_status_notice = """\n## ⚠️ DATABASE STATUS: TEMPORARILY UNREACHABLE
- The MongoDB database is currently unreachable due to a network issue.
- You DO NOT have access to real provider data right now.
- Be HONEST with the user: tell them the database is temporarily down and to try again shortly.
- DO NOT invent or make up any provider names, ratings, or phone numbers.
- You can still answer general questions about how FixKaro works, booking flow, features, etc.\n"""
    elif not all_providers:
        db_status_notice = """\n## ℹ️ DATABASE STATUS: CONNECTED BUT EMPTY
- The database is connected but no providers are registered yet.
- Tell the user honestly that no providers are available yet and encourage them to register.\n"""

    system_prompt = f"""You are FixKaro Assistant — the official AI helper for FixKaro, a home services marketplace app.

## About FixKaro
- FixKaro connects users with trusted local professionals for home services.
- Available in Chandigarh and surrounding areas.
- Users can browse services, view provider profiles, compare ratings & prices, and book instantly.
- The app offers a 20% discount on first bookings using code FIRST20.

## User's Current Location: {user_location}

## Available Service Categories
{', '.join(all_services) if all_services else 'Electrician, Barber, Plumber, Gas Service'}

## Live Platform Statistics
- Total Providers: {total_providers}
- Total Registered Users: {total_users}
- Total Bookings Made: {total_bookings}

## ══════════════════════════════════════════════
## COMPLETE PROVIDER DATABASE (ALL REGISTERED PROVIDERS)
## Use this data to answer ALL provider-related questions.
## Each provider has: Name, Rating, Reviews, Price, Distance, Phone, Email, Description.
## ══════════════════════════════════════════════
{all_provider_data}
{db_status_notice}
## How Booking Works
1. User signs up / logs in with email and password.
2. Browse service categories on the Dashboard.
3. Click a category to see all available providers with ratings, prices, and distance.
4. Select a provider → Choose a date (Today/Tomorrow) and time slot.
5. Confirm booking → Get a confirmation page with booking ID.
6. Contact the provider via WhatsApp or phone call directly from the confirmation page.

## Provider Registration
- Anyone can register as a service provider through Profile → "Register as Provider".
- They fill in: Name, Phone, Email, Service Type (from dropdown or custom), Pricing, and optionally upload a profile photo.
- If no photo is uploaded, the system auto-generates a profession-based avatar.
- New service types (like Car Driver, Carpenter, Painter, etc.) are automatically added to the platform.

## Key Features
- 🔍 Search for services
- ⭐ Provider ratings and reviews
- 📱 WhatsApp and phone call integration
- 🌙 Dark mode support
- 🤖 AI chat assistant (that's you!)
- 📋 Service provider self-registration
- 🎉 First booking discount (FIRST20)

## Guidelines for Responses
- Be friendly, concise, and helpful. Use emojis occasionally.
- **IMPORTANT**: When a user asks for "top", "best", "nearest" providers — ALWAYS use the COMPLETE PROVIDER DATABASE above to give accurate answers.
- Recommend based on: rating (highest first), then distance (closest to user), then reviews count.
- When recommending, include the provider's name, rating, price, distance, and phone number.
- If a user asks "best electrician near me", filter electricians from the database, sort by rating + distance, and list the top ones.
- If a user asks about a specific provider by name, look them up from the database and share ALL their details.
- If asked about pricing, share actual prices from the database.
- If asked to book, guide them: click the service category on Dashboard → select provider → pick date/time → confirm.
- If asked about becoming a provider, explain registration through Profile menu.
- Always be accurate — use the REAL data provided above. Never invent providers that don't exist in the database.
- If you don't know something, say so honestly.
- Keep responses short and scannable — use bullet points when listing providers.

USER MESSAGE: {message}
"""

    try:
        chat_history = []
        for h in history[-10:]:
            role = 'user' if h.get('role') == 'user' else 'model'
            chat_history.append({'role': role, 'parts': [h.get('content', '')]})

        # Try each model in the fallback chain
        last_error = None
        for model_name in GEMINI_MODELS:
            try:
                model = genai.GenerativeModel(model_name)
                chat_session = model.start_chat(history=chat_history)
                response = chat_session.send_message(system_prompt)
                return jsonify({"response": response.text}), 200
            except Exception as model_err:
                last_error = model_err
                print(f"⚠️ Model {model_name} failed: {model_err}. Trying next...")
                continue

        # All models rate-limited or failed
        err_str = str(last_error)
        if '429' in err_str:
            return jsonify({"error": "The AI assistant is temporarily busy due to high demand. Please try again in a minute! ⏳"}), 429
        return jsonify({"error": f"AI error: {err_str}"}), 500
    except Exception as e:
        print(f"❌ Gemini error: {e}")
        err_str = str(e)
        if '429' in err_str:
            return jsonify({"error": "The AI assistant is temporarily busy due to high demand. Please try again in a minute! ⏳"}), 429
        return jsonify({"error": f"AI error: {err_str}"}), 500


# ── Provider Registration ───────────────────────────────────────
@app.route('/api/register-provider', methods=['POST'])
def register_provider():
    data = request.json
    name = data.get('name', '').strip()
    phone = data.get('phone', '').strip()
    email = data.get('email', '').strip()
    service = data.get('service', '').strip()
    price = data.get('price', '').strip()
    distance = data.get('distance', '1.0 km')
    description = data.get('description', '').strip()
    image = data.get('image', '')  # base64 or URL

    if not name or not service or not phone:
        return jsonify({"error": "Name, service type, and phone are required"}), 400

    # If no image provided, generate AI avatar
    if not image and gemini_model:
        try:
            avatar_prompt = f"Professional profile photo of an Indian {service.lower()} worker, realistic portrait, clean background, professional attire, high quality"
            avatar_response = gemini_model.generate_content(avatar_prompt)
            # Gemini text model can't generate images, so we use a placeholder based on service
            service_images = {
                'electrician': 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=150&h=150&fit=crop',
                'barber': 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=150&h=150&fit=crop',
                'plumber': 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=150&h=150&fit=crop',
                'gas service': 'https://images.unsplash.com/photo-1589802829985-817e51171b92?w=150&h=150&fit=crop',
                'car driver': 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=150&h=150&fit=crop',
                'carpenter': 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=150&h=150&fit=crop',
                'painter': 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=150&h=150&fit=crop',
                'ac repair': 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=150&h=150&fit=crop',
                'pest control': 'https://images.unsplash.com/photo-1632935190868-11939e8e29b0?w=150&h=150&fit=crop',
            }
            image = service_images.get(service.lower(), f'https://ui-avatars.com/api/?name={name}&background=FC8019&color=fff&size=150&bold=true')
        except Exception:
            image = f'https://ui-avatars.com/api/?name={name}&background=FC8019&color=fff&size=150&bold=true'
    elif not image:
        image = f'https://ui-avatars.com/api/?name={name}&background=FC8019&color=fff&size=150&bold=true'

    provider = {
        "name": name,
        "phone": phone,
        "email": email,
        "service": service,
        "price": price or "Contact for price",
        "distance": distance,
        "description": description,
        "rating": 5.0,
        "reviews": 0,
        "image": image,
        "registered": True,
        "created_at": datetime.utcnow()
    }

    provider_id = providers_col.insert_one(provider).inserted_id
    return jsonify({
        "message": "Registration successful! You are now listed as a provider.",
        "provider_id": str(provider_id)
    }), 201


if __name__ == '__main__':
    port = int(os.getenv("PORT", 5001))
    print(f"🚀 FixKaro API running on http://localhost:{port}")
    app.run(debug=True, port=port, use_reloader=False)
