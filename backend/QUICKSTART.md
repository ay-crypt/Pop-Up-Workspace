# Quick Start Checklist

## Initial Setup (First Time Only)

- [ ] Install PostgreSQL
- [ ] Create database: `popup_workspace_db`
- [ ] Copy `.env.example` to `.env` and update credentials
- [ ] Run `npm install`
- [ ] Run `npm run migrate`
- [ ] Run `npm run seed` (optional, for sample data)

## Daily Development

### Terminal 1: Backend API
```bash
cd backend
npm run dev
# API runs on http://localhost:3000
```

### Terminal 2: Frontend (if applicable)
```bash
cd frontend
npm run dev
# Frontend runs on http://localhost:5173
```

## Directory Structure

```
backend/
├── src/
│   ├── server.js           # Main entry point
│   ├── config/             # Configuration files
│   ├── models/             # Database queries
│   ├── routes/             # API endpoints
│   └── middleware/         # Auth, validation
├── migrations/             # Database migrations
├── seeds/                  # Sample data
├── package.json
├── .env                    # Your local secrets
├── .env.example            # Template for .env
├── README.md               # API documentation
├── DEPLOYMENT.md           # Deployment guide
├── FRONTEND_INTEGRATION.md # Connection guide
└── api-client.js           # Frontend API client
```

## API Endpoints Summary

### Auth
- `POST /api/users/signup` - Register
- `POST /api/users/login` - Login

### Users
- `GET /api/users/:customer_id` - Get profile
- `PUT /api/users/:customer_id` - Update profile

### Bookings
- `POST /api/bookings` - Create booking
- `GET /api/bookings` - List bookings
- `GET /api/bookings/upcoming` - Upcoming bookings
- `GET /api/bookings/:reservation_id` - Booking details
- `PUT /api/bookings/:reservation_id/cancel` - Cancel

### Locations
- `GET /api/locations` - All locations
- `GET /api/locations/city/:city` - By city
- `GET /api/locations/available/cities` - Available cities
- `GET /api/locations/:location_id` - Details
- `GET /api/locations/:location_id/spots` - Spots

### Memberships
- `GET /api/memberships/tiers` - All tiers
- `GET /api/memberships/user/details` - User membership
- `GET /api/memberships/user/payments` - Payment history

## Database Management

### Connect to Database
```bash
psql -U postgres -d popup_workspace_db
```

### Useful SQL Queries
```sql
-- Count users
SELECT COUNT(*) FROM users;

-- View all bookings
SELECT * FROM bookings ORDER BY created_at DESC;

-- Check bookings by user
SELECT * FROM bookings WHERE customer_id = 'YOUR_CUSTOMER_ID';

-- View membership tiers
SELECT * FROM membership_entitlements;

-- Check available spots
SELECT * FROM spots WHERE is_available = true;
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| `ECONNREFUSED` | Start PostgreSQL service |
| `database does not exist` | Run `npm run migrate` |
| 401 Unauthorized | Token expired, re-login |
| CORS errors | Check CORS_ORIGIN in .env |
| Can't connect to backend | Ensure `npm run dev` running on port 3000 |

## Environment Variables

```env
# Required
DB_HOST=localhost
DB_PORT=5432
DB_NAME=popup_workspace_db
DB_USER=postgres
DB_PASSWORD=your_password

# Server
PORT=3000
NODE_ENV=development

# Security
JWT_SECRET=your-secret-key
JWT_EXPIRE=7d

# CORS
CORS_ORIGIN=http://localhost:3000,http://localhost:5173
```

## Common Commands

```bash
# Start development server
npm run dev

# Run migrations
npm run migrate

# Seed sample data
npm run seed

# Check logs (production)
npm run logs

# Restart server (production)
npm run restart

# Update dependencies
npm update
```

## Testing API with cURL

```bash
# Signup
curl -X POST http://localhost:3000/api/users/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "full_name": "John Doe",
    "membership_type": "Gold"
  }'

# Login
curl -X POST http://localhost:3000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'

# Get locations (replace TOKEN with actual token)
curl -X GET http://localhost:3000/api/locations \
  -H "Authorization: Bearer TOKEN"

# Create booking (after getting TOKEN from login)
curl -X POST http://localhost:3000/api/bookings \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "spot_id": "DESK-401",
    "location_id": "LOC-NY-001",
    "start_time": "2026-04-10T09:00:00Z",
    "end_time": "2026-04-10T17:00:00Z",
    "number_of_guests": 1
  }'
```

## Frontend Integration

1. Copy `api-client.js` to `frontend/src/services/api.js`
2. Set `VITE_API_URL=http://localhost:3000/api`
3. Import and use: `import api from './services/api'`
4. See `FRONTEND_INTEGRATION.md` for detailed examples

## Deployment

- **Development:** `npm run dev` locally
- **Staging:** Deploy to Heroku staging
- **Production:** Deploy to AWS EC2 or Heroku
- See `DEPLOYMENT.md` for detailed instructions

## Key Features

✅ User authentication with JWT
✅ Workspace location management
✅ Booking system with availability checking
✅ Membership tiers with entitlements
✅ Usage quotas and billing
✅ Payment tracking
✅ REST API with validation
✅ PostgreSQL database
✅ CORS enabled for frontend
✅ Error handling and logging

## Need Help?

- Check `README.md` for API documentation
- Check `DEPLOYMENT.md` for deployment issues
- Check `FRONTEND_INTEGRATION.md` for frontend connection
- Review error logs: `pm2 logs` or `heroku logs --tail`
