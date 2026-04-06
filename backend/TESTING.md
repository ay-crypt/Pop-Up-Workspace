# API Testing Guide (cURL Commands)

Quick reference for testing all endpoints using cURL. Copy and paste these commands in your terminal!

## Prerequisites

- Backend running: `npm run dev` (on port 3000)
- PostgreSQL running with seeded data

---

## 1. Health Check

```bash
curl http://localhost:3000/health
```

Expected response:
```json
{
  "status": "OK",
  "message": "Pop-Up Workspace API is running"
}
```

---

## 2. Authentication

### Signup (Create new user)

```bash
curl -X POST http://localhost:3000/api/users/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.doe@example.com",
    "password": "SecurePassword123",
    "full_name": "John Doe",
    "membership_type": "Gold"
  }'
```

Expected response:
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "customer_id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "john.doe@example.com",
    "full_name": "John Doe",
    "membership_type": "Gold"
  },
  "token": "eyJhbGciOiJIUzI1NiI..."
}
```

**Save the token for next requests!**

### Login

```bash
curl -X POST http://localhost:3000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.doe@example.com",
    "password": "SecurePassword123"
  }'
```

---

## 3. User Endpoints

Replace `YOUR_TOKEN` with the token from signup/login

### Get User Profile

```bash
curl -X GET http://localhost:3000/api/users/550e8400-e29b-41d4-a716-446655440000 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Update User Profile

```bash
curl -X PUT http://localhost:3000/api/users/550e8400-e29b-41d4-a716-446655440000 \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "full_name": "John Smith",
    "company_name": "Tech Corp",
    "job_title": "Senior Developer",
    "bio": "Workspace enthusiast",
    "primary_location_id": "LOC-NY-001"
  }'
```

---

## 4. Location Endpoints (No auth required)

### Get All Locations

```bash
curl -X GET "http://localhost:3000/api/locations?limit=50&offset=0"
```

### Get Available Cities

```bash
curl -X GET http://localhost:3000/api/locations/available/cities
```

### Get Locations by City

```bash
curl -X GET "http://localhost:3000/api/locations/city/New%20York?limit=50&offset=0"
```

Or use single quotes on Mac/Linux:
```bash
curl -X GET 'http://localhost:3000/api/locations/city/New York?limit=50&offset=0'
```

### Get Location Details

```bash
curl -X GET http://localhost:3000/api/locations/LOC-NY-001
```

Response includes location info and available spots.

### Get Available Spots

```bash
curl -X GET http://localhost:3000/api/locations/LOC-NY-001/spots
```

---

## 5. Booking Endpoints (Auth required)

### Create Booking

First, get a spot and location from the locations endpoint.

```bash
curl -X POST http://localhost:3000/api/bookings \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "spot_id": "DESK-401",
    "location_id": "LOC-NY-001",
    "start_time": "2026-04-10T09:00:00Z",
    "end_time": "2026-04-10T17:00:00Z",
    "number_of_guests": 1,
    "notes": "Regular business work"
  }'
```

### Get User Bookings

```bash
curl -X GET "http://localhost:3000/api/bookings?limit=50&offset=0" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Get Upcoming Bookings

```bash
curl -X GET http://localhost:3000/api/bookings/upcoming \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Get Booking Details

```bash
curl -X GET http://localhost:3000/api/bookings/RES-1701234567890 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

Replace `RES-1701234567890` with actual reservation ID from booking creation.

### Cancel Booking

```bash
curl -X PUT http://localhost:3000/api/bookings/RES-1701234567890/cancel \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 6. Membership Endpoints

### Get All Membership Tiers (No auth required)

```bash
curl -X GET http://localhost:3000/api/memberships/tiers
```

Sample response:
```json
{
  "success": true,
  "data": [
    {
      "tier_level": "Silver",
      "access_rank": 1,
      "description": "Basic access & single city",
      "is_priority_booking_enabled": false,
      "eligible_spot_categories": ["Open Desk"],
      "max_guests_per_visit": 1,
      "access_scope": "Local",
      "available_cities": ["New York"]
    },
    {
      "tier_level": "Gold",
      "access_rank": 2,
      "description": "Premium spots & multi-city access",
      "is_priority_booking_enabled": true,
      "eligible_spot_categories": ["Open Desk", "Private Office", "Executive Suite"],
      "max_guests_per_visit": 3,
      "access_scope": "National",
      "available_cities": ["New York", "San Francisco", "London"]
    },
    {
      "tier_level": "Platinum",
      "access_rank": 3,
      "description": "VIP access & unlimited cities",
      "is_priority_booking_enabled": true,
      "eligible_spot_categories": ["Open Desk", "Private Office", "Executive Suite", "Meeting Room", "Phone Booth"],
      "max_guests_per_visit": 5,
      "access_scope": "International",
      "available_cities": ["New York", "San Francisco", "London", "Tokyo", "Singapore"]
    }
  ]
}
```

### Get User Membership Details (Auth required)

```bash
curl -X GET http://localhost:3000/api/memberships/user/details \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Get Payment History (Auth required)

```bash
curl -X GET "http://localhost:3000/api/memberships/user/payments?limit=50&offset=0" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## Testing Workflow

Here's a complete workflow to test the entire API:

### 1. Signup
```bash
TOKEN=$(curl -s -X POST http://localhost:3000/api/users/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test'$(date +%s)'@example.com",
    "password": "TestPass123",
    "full_name": "Test User"
  }' | jq -r '.token')

echo "Token: $TOKEN"
```

### 2. Get Locations
```bash
curl http://localhost:3000/api/locations | jq '.'
```

### 3. Create Booking
```bash
curl -X POST http://localhost:3000/api/bookings \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "spot_id": "DESK-401",
    "location_id": "LOC-NY-001",
    "start_time": "2026-04-15T10:00:00Z",
    "end_time": "2026-04-15T16:00:00Z",
    "number_of_guests": 1
  }' | jq '.'
```

### 4. Get Bookings
```bash
curl http://localhost:3000/api/bookings \
  -H "Authorization: Bearer $TOKEN" | jq '.'
```

---

## Useful cURL Options

```bash
# Pretty print JSON (-j for --jq installed)
curl ... | jq '.'

# Save response to file
curl ... > response.json

# Show headers
curl -i ...

# Verbose output (useful for debugging)
curl -v ...

# Include POST data in output
curl -X POST ... -d '{...}' -i

# Custom headers
curl -H "Header-Name: value" ...

# Bearer token shorthand
curl -H "Authorization: Bearer $TOKEN" ...
```

---

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Validation errors",
  "errors": [
    {
      "param": "email",
      "msg": "Invalid value"
    }
  ]
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Invalid or expired token"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Resource not found"
}
```

### 500 Server Error
```json
{
  "success": false,
  "message": "Error description"
}
```

---

## Tips for Testing

1. **Save the token** - After signup/login, use it for all authenticated requests
2. **Use jq for formatting** - `curl ... | jq '.'` makes JSON readable
3. **Check timestamps** - Bookings use ISO 8601 format (e.g., 2026-04-10T09:00:00Z)
4. **Test with real data** - Use location IDs and spot IDs from seeded data
5. **Create multiple users** - Test concurrent bookings and conflicts

---

## Sample Data Reference

### Available Locations
- `LOC-NY-001` - Downtown Hub NYC
- `LOC-SF-001` - Silicon Valley Center
- `LOC-LON-001` - London Business Hub

### Available Spots
- `DESK-401` - Open Desk in NYC
- `OFFICE-301` - Private Office in NYC
- `EXEC-201` - Executive Suite in NYC

### Membership Types
- `Silver` - $99/month
- `Gold` - $299/month
- `Platinum` - $599/month

---

## Debugging Commands

### Check if server is running
```bash
curl http://localhost:3000/health
```

### View latest logs
```bash
npm run dev  # or pm2 logs for production
```

### Test database connection
```bash
psql -U postgres -d popup_workspace_db -c "SELECT COUNT(*) FROM users;"
```

### Test email format
```bash
curl http://localhost:3000/api/users/signup \
  -d '{"email":"invalid-email","password":"test","full_name":"test"}'
```

---

**Ready to test? Start with `npm run dev` and run the endpoints above!**
