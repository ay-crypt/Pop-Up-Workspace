# Pop-Up Workspace Backend API

Complete backend service for the Pop-Up Workspace rental platform with Node.js, Express, and PostgreSQL.

## Quick Start

### Prerequisites
- Node.js (v14+)
- PostgreSQL (v12+)
- npm or yarn

### Installation

1. **Clone/Navigate to project**
   ```bash
   cd backend
   npm install
   ```

2. **Setup environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your database credentials
   ```

3. **Create PostgreSQL database**
   ```sql
   CREATE DATABASE popup_workspace_db;
   ```

4. **Run migrations**
   ```bash
   npm run migrate
   ```

5. **Seed sample data (optional)**
   ```bash
   npm run seed
   ```

6. **Start the server**
   ```bash
   # Development (with auto-reload)
   npm run dev
   
   # Production
   npm start
   ```

Server will run on `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/users/signup` - Register new user
- `POST /api/users/login` - Login user

### User Management
- `GET /api/users/:customer_id` - Get user profile
- `PUT /api/users/:customer_id` - Update user profile

### Bookings
- `POST /api/bookings` - Create booking
- `GET /api/bookings` - Get user bookings
- `GET /api/bookings/upcoming` - Get upcoming reservations
- `GET /api/bookings/:reservation_id` - Get booking details
- `PUT /api/bookings/:reservation_id/cancel` - Cancel booking

### Locations
- `GET /api/locations` - Get all locations
- `GET /api/locations/city/:city` - Get locations by city
- `GET /api/locations/available/cities` - Get available cities
- `GET /api/locations/:location_id` - Get location details
- `GET /api/locations/:location_id/spots` - Get available spots

### Memberships
- `GET /api/memberships/tiers` - Get membership tiers
- `GET /api/memberships/user/details` - Get user membership details
- `GET /api/memberships/user/payments` - Get payment history

## Database Schema

### Key Tables
- **users** - Customer accounts
- **user_profiles** - Extended user information
- **locations** - Workspace locations
- **spots** - Individual desks/rooms
- **bookings** - Reservations
- **membership_entitlements** - Tier benefits
- **usage_and_quotas** - Usage tracking
- **financials** - Billing information
- **payment_transactions** - Payment history

## Authentication

All protected endpoints require JWT token in Authorization header:
```
Authorization: Bearer <token>
```

Tokens are issued on signup/login and expire after 7 days (configurable).

## Environment Variables

```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=popup_workspace_db
DB_USER=postgres
DB_PASSWORD=your_password
PORT=3000
NODE_ENV=development
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d
CORS_ORIGIN=http://localhost:3000
```

## Project Structure

```
backend/
├── src/
│   ├── server.js              # Express app entry point
│   ├── config/
│   │   ├── database.js        # Database connection
│   │   └── constants.js       # App constants
│   ├── models/
│   │   ├── User.js            # User queries
│   │   ├── Booking.js         # Booking queries
│   │   ├── Location.js        # Location queries
│   │   ├── Membership.js      # Membership queries
│   │   └── Quota.js           # Usage quota queries
│   ├── routes/
│   │   ├── users.js           # User endpoints
│   │   ├── bookings.js        # Booking endpoints
│   │   ├── locations.js       # Location endpoints
│   │   └── memberships.js     # Membership endpoints
│   └── middleware/
│       ├── auth.js            # JWT authentication
│       └── validator.js       # Request validation
├── migrations/
│   ├── 001_initial_schema.sql # Database schema
│   └── run.js                 # Migration runner
├── seeds/
│   └── seedDatabase.js        # Sample data
├── package.json
├── .env.example
└── README.md
```

## Development

- **Auto-reload:** Uses nodemon for file watching
- **Validation:** Express-validator for request validation
- **Security:** Helmet for HTTP headers, bcrypt for passwords
- **JWT:** Token-based authentication
- **CORS:** Configurable cross-origin requests

## Error Handling

All endpoints return consistent JSON responses:

**Success:**
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {}
}
```

**Error:**
```json
{
  "success": false,
  "message": "Error description"
}
```

## Next Steps

1. Connect frontend to API
2. Implement payment processing (Stripe/PayPal)
3. Add websocket for real-time availability
4. Implement email notifications
5. Add admin dashboard

## License

MIT
