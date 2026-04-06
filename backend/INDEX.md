# Remove old dependencies
rm -r node_modules -Force
rm package-lock.json -Force

# Install fresh
npm install

# Continue with setup
npm run migrate
npm run seed
npm run dev# 📑 Backend Project Index & File Guide

Complete index of all files in your Pop-Up Workspace backend project.

---

## 📁 File Structure

```
backend/
├── 📄 package.json                 ★ Dependencies & scripts
├── 📄 .env.example                 ★ Environment template
├── 📄 .gitignore                   ★ Git ignore rules
│
├── 📚 Documentation/
│   ├── 📖 SETUP_COMPLETE.md        ★ You are here! Setup summary
│   ├── 📖 QUICKSTART.md            ★ Quick reference & commands
│   ├── 📖 README.md                ★ Complete API documentation
│   ├── 📖 DEPLOYMENT.md            ★ Deployment guides (Heroku/AWS/Docker)
│   ├── 📖 SCHEMA.md                ★ Database schema & ERD
│   ├── 📖 FRONTEND_INTEGRATION.md  ★ How to connect frontend
│   ├── 📖 TESTING.md               ★ cURL test commands
│   └── 📖 INDEX.md                 ★ This file
│
├── 🔧 Configuration/
│   └── src/config/
│       ├── database.js             ★ PostgreSQL connection
│       └── constants.js            ★ App constants & enums
│
├── 📊 Database/
│   ├── migrations/
│   │   ├── 001_initial_schema.sql  ★ Database schema
│   │   └── run.js                  ★ Migration runner
│   └── seeds/
│       └── seedDatabase.js         ★ Sample data seeder
│
├── 🛣️ API Routes/
│   └── src/routes/
│       ├── users.js                ★ Auth & user endpoints
│       ├── bookings.js             ★ Booking endpoints
│       ├── locations.js            ★ Location endpoints
│       └── memberships.js          ★ Membership endpoints
│
├── 🗄️ Data Models/
│   └── src/models/
│       ├── User.js                 ★ User queries
│       ├── Booking.js              ★ Booking queries
│       ├── Location.js             ★ Location queries
│       ├── Membership.js           ★ Membership queries
│       └── Quota.js                ★ Usage quota queries
│
├── 🔐 Middleware/
│   └── src/middleware/
│       ├── auth.js                 ★ JWT authentication
│       └── validator.js            ★ Request validation
│
├── 🚀 Main Application/
│   └── src/
│       └── server.js               ★ Express app setup
│
└── 🌐 Frontend Client/
    └── api-client.js               ★ Pre-built frontend API client
```

---

## 📖 Documentation Files

| File | Purpose | Read First? |
|------|---------|------------|
| **SETUP_COMPLETE.md** | Overview of what was built | ✅ YES |
| **QUICKSTART.md** | Commands & quick reference | ✅ YES |
| **README.md** | Full API endpoint documentation | After setup |
| **TESTING.md** | cURL commands to test API | After setup |
| **DEPLOYMENT.md** | Production deployment guides | Before deploying |
| **SCHEMA.md** | Database tables & relationships | For DB understanding |
| **FRONTEND_INTEGRATION.md** | Connect your frontend | When connecting frontend |
| **INDEX.md** | This file - project overview | Anytime |

**Recommended Reading Order:**
1. Start → SETUP_COMPLETE.md (you are here)
2. Run → QUICKSTART.md (setup commands)
3. Test → TESTING.md (verify endpoints)
4. Integrate → FRONTEND_INTEGRATION.md (connect frontend)
5. Deploy → DEPLOYMENT.md (when ready for production)

---

## 🚀 Source Code Files

### Configuration (`src/config/`)
| File | Purpose |
|------|---------|
| `database.js` | PostgreSQL connection pool |
| `constants.js` | Membership tiers, user status, enums |

### Models - Database Queries (`src/models/`)
| File | Purpose | Functions |
|------|---------|-----------|
| `User.js` | User operations | signup, login, profile |
| `Booking.js` | Booking operations | create, list, cancel |
| `Location.js` | Location operations | search, availability |
| `Membership.js` | Membership & billing | tiers, entitlements, payments |
| `Quota.js` | Usage quotas | track meeting hours, credits |

### Routes - API Endpoints (`src/routes/`)
| File | Endpoints |
|------|-----------|
| `users.js` | POST /signup, POST /login, GET /:id, PUT /:id |
| `bookings.js` | POST /, GET /, GET /upcoming, GET /:id, PUT /:id/cancel |
| `locations.js` | GET /, GET /city/:city, GET /available/cities, GET /:id, GET /:id/spots |
| `memberships.js` | GET /tiers, GET /user/details, GET /user/payments |

### Middleware (`src/middleware/`)
| File | Purpose |
|------|---------|
| `auth.js` | JWT token verification |
| `validator.js` | Request validation |

### Main App (`src/`)
| File | Purpose |
|------|---------|
| `server.js` | Express app setup & route registration |

---

## 💾 Database Files

| File | Purpose |
|------|---------|
| `migrations/001_initial_schema.sql` | Complete database schema (10 tables) |
| `migrations/run.js` | Migration runner |
| `seeds/seedDatabase.js` | Creates sample data |

---

## 🌐 Frontend Integration

| File | Purpose |
|------|---------|
| `api-client.js` | Pre-built API client for frontend |
| `FRONTEND_INTEGRATION.md` | How to use the API client |

Copy `api-client.js` to your frontend project!

---

## 📦 Configuration Files

| File | Purpose |
|------|---------|
| `package.json` | Dependencies & npm scripts |
| `.env.example` | Environment variables template |
| `.gitignore` | Files to exclude from git |

---

## 🎯 What Each File Does

### Core Application

**`src/server.js`**
- Main Express application entry point
- Registers all routes
- Sets up middleware (CORS, Helmet, JSON parsing)
- Starts HTTP server on port 3000

**`src/config/database.js`**
- Creates PostgreSQL connection pool
- Exports query interface for models
- Handles connection errors

**`src/config/constants.js`**
- Membership tier definitions
- User status enums
- Booking status enums
- Spot category enums

### API Routes

**`src/routes/users.js`** (4 endpoints)
- POST /signup - Register new user
- POST /login - Login with email/password
- GET /:customer_id - Get user profile
- PUT /:customer_id - Update profile

**`src/routes/bookings.js`** (5 endpoints)
- POST / - Create reservation
- GET / - List user bookings
- GET /upcoming - Get future reservations
- GET /:reservation_id - Get booking details
- PUT /:reservation_id/cancel - Cancel booking

**`src/routes/locations.js`** (5 endpoints)
- GET / - List all locations
- GET /city/:city - Filter by city
- GET /available/cities - Available cities list
- GET /:location_id - Location details with spots
- GET /:location_id/spots - Available spots only

**`src/routes/memberships.js`** (3 endpoints)
- GET /tiers - All membership tiers
- GET /user/details - User membership info
- GET /user/payments - Payment transaction history

### Database Models

**`src/models/User.js`** - User account operations
- createUser, getUserById, getUserByEmail
- updateUser, getUserProfile, createUserProfile
- updateUserProfile

**`src/models/Booking.js`** - Reservation operations
- createBooking, getBookingById
- getUserBookings, getUpcomingBookings
- updateBookingStatus, cancelBooking

**`src/models/Location.js`** - Location & spot operations
- getLocationById, getAllLocations
- getLocationsByCity, getAvailableCities
- getLocationSpots, getSpotById
- isSpotAvailable

**`src/models/Membership.js`** - Membership & billing
- getEntitlementsByTier, getUserEntitlements
- getFinancials, createFinancials
- updateBalance, getPaymentTransactions

**`src/models/Quota.js`** - Usage tracking
- getUserQuota, createUserQuota
- updateQuotaUsage, resetMonthlyQuota

### Middleware

**`src/middleware/auth.js`**
- Verifies JWT token from Authorization header
- Adds decoded user to request
- Returns 401 if token invalid/missing

**`src/middleware/validator.js`**
- Checks validation errors from express-validator
- Returns 400 with error details if validation failed

### Database

**`migrations/001_initial_schema.sql`** - 10 tables:
1. users - Customer accounts
2. user_profiles - Extended profile info
3. locations - Workspace locations
4. spots - Individual desks/rooms
5. bookings - Reservations
6. membership_entitlements - Tier benefits
7. usage_and_quotas - Monthly limits
8. booking_analytics - Booking statistics
9. financials - Billing information
10. payment_transactions - Payment history

**`migrations/run.js`**
- Reads SQL migration files
- Executes them against PostgreSQL
- Exits with success/error status

**`seeds/seedDatabase.js`**
- Creates sample membership tiers
- Creates 3 sample locations
- Creates 6 sample workspace spots
- Useful for testing

---

## 🔄 Data Flow Example

### Booking Flow

```
User Interface (Frontend)
         ↓
   api-client.js
         ↓
   POST /api/bookings
         ↓
   src/routes/bookings.js
    (validates input)
         ↓
   src/models/Booking.js
    (isSpotAvailable)
         ↓
   PostgreSQL Database
    (check conflicts, create booking)
         ↓
   Response with booking details
```

---

## 📋 Setup Checklist

- [ ] Install PostgreSQL
- [ ] Create database: `popup_workspace_db`
- [ ] Copy `.env.example` to `.env`
- [ ] Update DB credentials in `.env`
- [ ] Run `npm install`
- [ ] Run `npm run migrate`
- [ ] Run `npm run seed` (optional)
- [ ] Run `npm run dev`
- [ ] Test API with TESTING.md commands
- [ ] Connect frontend with FRONTEND_INTEGRATION.md
- [ ] Deploy with DEPLOYMENT.md guide

---

## 🚀 Quick Commands

```bash
# Development
npm run dev              # Start with auto-reload

# Database
npm run migrate          # Run migrations
npm run seed             # Add sample data

# Production
npm start                # Start server
NODE_ENV=production npm start

# Testing
curl http://localhost:3000/health
```

---

## 🧠 Understanding the Architecture

### Three-Layer Architecture

```
Frontend (Stitch)
      ↓
API Layer (Express)
      ↓
Database Layer (PostgreSQL)
```

### Request Flow

1. **Frontend** sends HTTP request
2. **Route Handler** in Express receives request
3. **Middleware** validates & authenticates
4. **Model** executes database query
5. **Database** returns data
6. **Route Handler** returns JSON response
7. **Frontend** processes data

---

## 📚 Key Concepts

### JWT Authentication
- Token-based auth (not session-based)
- Token includes: customer_id, email
- Expires after 7 days (configurable)
- Sent in Authorization header

### Models
- Database abstraction layer
- All SQL queries in here
- Reusable across routes
- Easy to test and modify

### Routes
- API endpoint definitions
- Input validation
- Error handling
- Response formatting

### Middleware
- Pre-processes requests
- Authentication checks
- Validation
- Error handling

---

## 🔐 Security Notes

- Passwords hashed with bcrypt (10 rounds)
- JWT signed with HS256
- CORS restricted to frontend domains
- Helmet adds security headers
- Input validation on all endpoints
- SQL injection protected (parameterized queries)

---

## 📞 Need Help?

1. **Setup issues?** → Check QUICKSTART.md
2. **API not working?** → Check TESTING.md
3. **Endpoint docs?** → Check README.md
4. **DB questions?** → Check SCHEMA.md
5. **Frontend connection?** → Check FRONTEND_INTEGRATION.md
6. **Deployment?** → Check DEPLOYMENT.md

---

## ✅ Next Steps

1. **Start server:** `npm run dev`
2. **Test endpoints:** Use commands in TESTING.md
3. **Connect frontend:** Follow FRONTEND_INTEGRATION.md
4. **Deploy:** Use DEPLOYMENT.md guide
5. **Monitor:** Check logs and database

---

**Everything is ready! Happy coding! 🎉**
