# Database Schema Documentation

## Overview

The Pop-Up Workspace backend uses a hierarchical PostgreSQL schema to manage customers, memberships, locations, bookings, and financial data.

## Entity Relationship Diagram

```
┌─────────────┐
│   users     │ (customer accounts)
├─────────────┤
│ customer_id │◄────────────┐
│ email       │             │
│ full_name   │             │
│ membership  │             │
│ status      │             │
└─────────────┘             │
      │                     │
      ├─► ┌──────────────────┐
      │   │ user_profiles    │
      │   ├──────────────────┤
      │   │ profile_id       │
      │   │ customer_id      │──┐
      │   │ company_name     │  │
      │   │ job_title        │  │
      │   │ bio              │  │
      │   └──────────────────┘  │
      │                         │
      ├─► ┌──────────────────┐  │
      │   │ usage_and_quotas │  │
      │   ├──────────────────┤  │
      │   │ quota_id         │  │
      │   │ customer_id      │──┤
      │   │ meeting_hours    │  │
      │   │ printing_credits │  │
      │   └──────────────────┘  │
      │                         │
      ├─► ┌──────────────────┐  │
      │   │ booking_analytics│  │
      │   ├──────────────────┤  │
      │   │ analytics_id     │  │
      │   │ customer_id      │──┤
      │   │ total_bookings   │  │
      │   │ preferred_spot_id│──┼──► spot
      │   └──────────────────┘  │
      │                         │
      ├─► ┌──────────────────┐  │
      │   │ financials       │  │
      │   ├──────────────────┤  │
      │   │ financial_id     │  │
      │   │ customer_id      │──┤
      │   │ subscription_fee │  │
      │   │ balance          │  │
      │   └──────────────────┘  │
      │                         │
      └─► ┌──────────────────┐  │
          │ payment_transactions
          ├──────────────────┤  │
          │ transaction_id   │  │
          │ customer_id      │──┤
          │ amount           │
          │ status           │
          └──────────────────┘

┌──────────────┐
│ bookings     │ (reservations)
├──────────────┤
│ reservation_id│
│ customer_id  │──► users
│ spot_id      │──► spots
│ location_id  │──► locations
│ start_time   │
│ end_time     │
│ status       │
│ total_cost   │
└──────────────┘

┌─────────────┐
│ locations   │ (workspace hubs)
├─────────────┤
│ location_id │
│ name        │
│ city        │
│ country     │
│ address     │
│ amenities   │
│ is_active   │
└─────────────┘
      │
      └─► ┌─────────────┐
          │ spots       │ (desks/rooms)
          ├─────────────┤
          │ spot_id     │
          │ location_id │
          │ category    │
          │ capacity    │
          │ hourly_rate │
          │ is_available│
          └─────────────┘

┌──────────────────────┐
│ membership_entitlements
├──────────────────────┤
│ entitlement_id       │
│ tier_level           │ (Silver, Gold, Platinum)
│ access_rank          │
│ spot_access_privileges
│ geographical_access  │
│ available_cities[]   │
└──────────────────────┘
```

## Table Definitions

### `users` - Customer Accounts
Stores basic user authentication and profile information.

| Column | Type | Description |
|--------|------|-------------|
| customer_id | UUID | Primary key |
| email | VARCHAR(255) | Unique email |
| password_hash | VARCHAR(255) | Hashed password |
| full_name | VARCHAR(255) | User's full name |
| phone_number | VARCHAR(20) | Contact phone |
| membership_type | ENUM | Silver/Gold/Platinum |
| status | ENUM | Active/Inactive/Suspended/Pending |
| created_at | TIMESTAMP | Account creation |
| updated_at | TIMESTAMP | Last update |

**Indexes:**
- `email` - For login queries
- `status` - For filtering users
- `membership_type` - For membership queries

---

### `user_profiles` - Extended User Information
Detailed profile information linked to users table.

| Column | Type | Description |
|--------|------|-------------|
| profile_id | UUID | Primary key |
| customer_id | UUID | Foreign key to users |
| primary_location_id | VARCHAR(50) | Preferred location |
| company_name | VARCHAR(255) | Company affiliation |
| job_title | VARCHAR(255) | Job position |
| bio | TEXT | User biography |
| avatar_url | VARCHAR(500) | Profile picture URL |
| verification_status | VARCHAR(50) | unverified/verified |
| created_at | TIMESTAMP | Creation date |
| updated_at | TIMESTAMP | Last update |

---

### `locations` - Workspace Hubs
Physical workspace locations available for booking.

| Column | Type | Description |
|--------|------|-------------|
| location_id | VARCHAR(50) | Primary key (e.g., LOC-NY-001) |
| name | VARCHAR(255) | Location name |
| city | VARCHAR(100) | City name |
| state | VARCHAR(50) | State/Province |
| country | VARCHAR(100) | Country |
| address | VARCHAR(500) | Full address |
| postal_code | VARCHAR(20) | Postal code |
| latitude | DECIMAL(10,8) | GPS latitude |
| longitude | DECIMAL(11,8) | GPS longitude |
| total_desks | INTEGER | Total desks available |
| available_desks | INTEGER | Currently available |
| description | TEXT | Location description |
| amenities | JSONB | List of amenities |
| opening_hours | JSONB | Operating hours |
| is_active | BOOLEAN | Active status |
| created_at | TIMESTAMP | Creation date |
| updated_at | TIMESTAMP | Last update |

**Indexes:**
- `city` - For location search
- `country` - For country filtering
- `is_active` - For active locations only

---

### `spots` - Workspace Desks/Rooms
Individual desks or rooms within a location.

| Column | Type | Description |
|--------|------|-------------|
| spot_id | VARCHAR(50) | Primary key (e.g., DESK-401) |
| location_id | VARCHAR(50) | Foreign key to locations |
| category | ENUM | Open Desk/Private Office/Executive Suite/Meeting Room/Phone Booth |
| floor_number | INTEGER | Floor level |
| zone_name | VARCHAR(100) | Zone identifier |
| capacity | INTEGER | Number of people |
| is_available | BOOLEAN | Availability status |
| hourly_rate | DECIMAL(10,2) | Hourly rental rate |
| daily_rate | DECIMAL(10,2) | Daily rental rate |
| monthly_rate | DECIMAL(10,2) | Monthly rental rate |
| amenities | TEXT[] | Array of amenities |
| created_at | TIMESTAMP | Creation date |
| updated_at | TIMESTAMP | Last update |

**Indexes:**
- `location_id` - For location spots
- `category` - For spot category search

---

### `bookings` - Reservations
User reservations for workspace spots.

| Column | Type | Description |
|--------|------|-------------|
| reservation_id | VARCHAR(50) | Primary key (e.g., RES-9921) |
| customer_id | UUID | Foreign key to users |
| spot_id | VARCHAR(50) | Foreign key to spots |
| location_id | VARCHAR(50) | Foreign key to locations |
| start_time | TIMESTAMP | Booking start |
| end_time | TIMESTAMP | Booking end |
| status | ENUM | Pending/Confirmed/Completed/Cancelled |
| number_of_guests | INTEGER | Guests count |
| notes | TEXT | Additional notes |
| total_cost | DECIMAL(10,2) | Reservation cost |
| created_at | TIMESTAMP | Creation date |
| updated_at | TIMESTAMP | Last update |

**Indexes:**
- `customer_id` - For user bookings
- `spot_id` - For spot bookings
- `start_time` - For availability queries
- `status` - For booking status filtering

---

### `membership_entitlements` - Membership Tiers
Defines benefits for each membership tier.

| Column | Type | Description |
|--------|------|-------------|
| entitlement_id | UUID | Primary key |
| tier_level | ENUM | Silver/Gold/Platinum |
| access_rank | INTEGER | Tier ranking (1=lowest) |
| description | TEXT | Tier description |
| is_priority_booking_enabled | BOOLEAN | Priority booking access |
| eligible_spot_categories | ENUM[] | Allowed spot types |
| max_guests_per_visit | INTEGER | Maximum guests |
| access_scope | VARCHAR(50) | Local/National/International |
| restricted_locations | VARCHAR(50)[] | Blocked locations |
| available_cities | TEXT[] | Accessible cities |
| created_at | TIMESTAMP | Creation date |
| updated_at | TIMESTAMP | Last update |

**Sample Data:**
```
Silver: $99/month, single city, open desks only
Gold: $299/month, multi-city, premium access
Platinum: $599/month, unlimited cities, all amenities
```

---

### `usage_and_quotas` - Monthly Usage Tracking
Tracks user subscription usage quotas.

| Column | Type | Description |
|--------|------|-------------|
| quota_id | UUID | Primary key |
| customer_id | UUID | Foreign key to users |
| meeting_room_hours_per_month | INTEGER | Monthly hour allocation |
| hours_consumed_current_month | DECIMAL(8,2) | Hours used |
| printing_credits_remaining | INTEGER | Remaining credits |
| last_check_in_timestamp | TIMESTAMP | Last access |
| created_at | TIMESTAMP | Creation date |
| updated_at | TIMESTAMP | Last update |

---

### `booking_analytics` - Booking Statistics
Aggregated booking data per user.

| Column | Type | Description |
|--------|------|-------------|
| analytics_id | UUID | Primary key |
| customer_id | UUID | Foreign key to users |
| total_bookings | INTEGER | Total bookings made |
| preferred_spot_id | VARCHAR(50) | Most booked spot |
| average_stay_duration_hours | DECIMAL(10,2) | Average duration |
| last_booking_date | TIMESTAMP | Last booking date |
| created_at | TIMESTAMP | Creation date |
| updated_at | TIMESTAMP | Last update |

---

### `financials` - Billing Information
Payment and subscription details per user.

| Column | Type | Description |
|--------|------|-------------|
| financial_id | UUID | Primary key |
| customer_id | UUID | Foreign key to users |
| monthly_subscription_fee | DECIMAL(10,2) | Recurring charge |
| currency | VARCHAR(3) | Currency code (USD) |
| outstanding_balance | DECIMAL(10,2) | Amount owed |
| payment_method_on_file | VARCHAR(50) | Stored payment method |
| total_spent_lifetime | DECIMAL(12,2) | Lifetime spending |
| created_at | TIMESTAMP | Creation date |
| updated_at | TIMESTAMP | Last update |

---

### `payment_transactions` - Payment History
Individual payment records.

| Column | Type | Description |
|--------|------|-------------|
| transaction_id | UUID | Primary key |
| customer_id | UUID | Foreign key to users |
| amount | DECIMAL(10,2) | Transaction amount |
| transaction_type | VARCHAR(50) | subscription/booking/refund |
| payment_method | VARCHAR(50) | Payment method used |
| status | VARCHAR(50) | pending/completed/failed |
| reference_id | VARCHAR(100) | External reference |
| created_at | TIMESTAMP | Transaction date |

**Indexes:**
- `customer_id` - For user transactions
- `created_at` - For date range queries

---

## Data Types & Enums

### Membership Tier ENUM
```
Silver   - Entry tier, single city, basic amenities
Gold     - Mid-tier, multi-city, premium access  
Platinum - Premium tier, unlimited cities, VIP treatment
```

### User Status ENUM
```
Pending    - Awaiting verification
Active     - Fully active account
Inactive   - Temporarily disabled
Suspended  - Account flagged/restricted
```

### Booking Status ENUM
```
Pending    - Awaiting confirmation
Confirmed  - Booking confirmed
Completed  - Booking fulfilled
Cancelled  - Booking cancelled
```

### Spot Category ENUM
```
Open Desk      - Hot desking
Private Office - Dedicated private space
Executive Suite - Premium private suite
Meeting Room   - Conference space
Phone Booth    - Private call booth
```

---

## Key Relationships

1. **Users → User Profiles** (1:1)
   - Each user has one extended profile

2. **Users → Bookings** (1:N)
   - One user can have many bookings

3. **Locations → Spots** (1:N)
   - One location has many spots

4. **Spots → Bookings** (1:N)
   - One spot can be booked many times

5. **Users → Usage Quotas** (1:1)
   - Each user has one quota record

6. **Users → Financials** (1:1)
   - Each user has one financials record

7. **Users → Payment Transactions** (1:N)
   - One user has many transactions

---

## Query Patterns

### Get complete user profile
```sql
SELECT 
  u.*,
  up.*,
  uq.*,
  ba.*,
  f.*,
  me.*
FROM users u
LEFT JOIN user_profiles up ON u.customer_id = up.customer_id
LEFT JOIN usage_and_quotas uq ON u.customer_id = uq.customer_id
LEFT JOIN booking_analytics ba ON u.customer_id = ba.customer_id
LEFT JOIN financials f ON u.customer_id = f.customer_id
LEFT JOIN membership_entitlements me ON u.membership_type = me.tier_level
WHERE u.customer_id = $1;
```

### Check spot availability
```sql
SELECT s.* FROM spots s
WHERE s.location_id = $1
AND s.spot_id NOT IN (
  SELECT DISTINCT spot_id FROM bookings
  WHERE status IN ('Confirmed', 'Pending')
  AND (
    (start_time <= $2 AND end_time > $2) OR
    (start_time < $3 AND end_time >= $3)
  )
);
```

### User booking history
```sql
SELECT b.*, l.name as location_name, s.category
FROM bookings b
JOIN locations l ON b.location_id = l.location_id
JOIN spots s ON b.spot_id = s.spot_id
WHERE b.customer_id = $1
ORDER BY b.start_time DESC;
```

---

## Performance Considerations

- Indexes on frequently queried columns (email, customer_id, location_id, etc.)
- Connection pooling configured in database.js
- JSONB for flexible amenities/hours data
- Partitioning by date for large booking tables (future optimization)
- Caching layer for membership tiers and locations (future)

---

## Migration Strategy

All schema changes should be:
1. Added to new migration files (e.g., `002_add_feature.sql`)
2. Run with `npm run migrate`
3. Rolled back with `npm run migrate:rollback` if needed
4. Never modified directly in production

