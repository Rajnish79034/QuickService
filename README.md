# Hyperlocal Service Aggregator MVP — ServeNow

A beautifully designed, premium-feeling service aggregator built to demonstrate strong product sense and UI/UX skills.

## Tech Stack
- **Frontend:** React (Vite), Tailwind CSS, Framer Motion, Lucide-React, React Router
- **Backend:** Flask, Flask-CORS, PyMongo
- **Database:** MongoDB Atlas

## Folder Structure
```
myproject/
├── backend/
│   ├── app.py            # Flask server with all API routes
│   ├── requirements.txt  # Python dependencies
│   └── .env              # MongoDB connection string
├── frontend/
│   ├── index.html
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   ├── vite.config.js
│   ├── package.json
│   ├── public/
│   └── src/
│       ├── main.jsx
│       ├── App.jsx
│       ├── index.css
│       ├── components/
│       │   └── Navbar.jsx
│       └── pages/
│           ├── Landing.jsx
│           ├── Auth.jsx
│           ├── Dashboard.jsx
│           ├── Providers.jsx
│           ├── Booking.jsx
│           └── Confirmation.jsx
└── README.md
```

## Setup Instructions

### 1. Backend Setup
```bash
cd backend
python -m venv venv
# Windows:
.\venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate
pip install -r requirements.txt
```
**Edit `.env`** and replace `<db_password>` with your actual MongoDB password.
```bash
python app.py
```
Server runs on http://localhost:5000

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
App opens on http://localhost:5173

## User Flow
1. **Landing Page** → Hero, trust indicators, CTA
2. **Login / Signup** → Simple email/name form
3. **Dashboard** → Service categories grid, promo banner
4. **Provider List** → Ratings, distance, pricing cards
5. **Booking** → Date & time slot picker
6. **Confirmation** → Success animation + confetti 🎉

## Interview Pitch (1 minute)
> "I intentionally simplified authentication to focus on user experience and the booking flow. My goal was to simulate a real product feel — like Urban Company or Airbnb — rather than over-engineer the backend. UI/UX was prioritized to reduce friction in service booking. The backend is a lightweight Flask + MongoDB layer that can be extended with real auth (Firebase/NextAuth) on day two."

## Common Interview Questions
**Q: Why no real authentication?**
A: MVP mindset — proving the user flow matters more than auth, which is a solved problem.

**Q: How does this scale?**
A: Decouple booking engine from user endpoints into microservices, add Redis caching for provider listings.

**Q: Why MongoDB?**
A: Flexible document schema for evolving provider profiles without migrations.
