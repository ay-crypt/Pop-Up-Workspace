-- Create enum types
CREATE TYPE membership_tier AS ENUM ('Silver', 'Gold', 'Platinum');
CREATE TYPE user_status AS ENUM ('Active', 'Inactive', 'Suspended', 'Pending');
CREATE TYPE booking_status AS ENUM ('Pending', 'Confirmed', 'Completed', 'Cancelled');
CREATE TYPE spot_category AS ENUM ('Open Desk', 'Private Office', 'Executive Suite', 'Meeting Room', 'Phone Booth');

-- Users/Customers Table
CREATE TABLE users (
  customer_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  phone_number VARCHAR(20),
  membership_type membership_tier DEFAULT 'Silver',
  status user_status DEFAULT 'Pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User Profiles Table (Extended details)
CREATE TABLE user_profiles (
  profile_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL UNIQUE,
  primary_location_id VARCHAR(50),
  company_name VARCHAR(255),
  job_title VARCHAR(255),
  bio TEXT,
  avatar_url VARCHAR(500),
  verification_status VARCHAR(50) DEFAULT 'unverified',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES users(customer_id) ON DELETE CASCADE
);

-- Locations/Workspaces Table
CREATE TABLE locations (
  location_id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  city VARCHAR(100) NOT NULL,
  state VARCHAR(50),
  country VARCHAR(100) NOT NULL,
  address VARCHAR(500) NOT NULL,
  postal_code VARCHAR(20),
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  total_desks INTEGER,
  available_desks INTEGER,
  description TEXT,
  amenities JSONB,
  opening_hours JSONB,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Workspace Spots/Desks Table
CREATE TABLE spots (
  spot_id VARCHAR(50) PRIMARY KEY,
  location_id VARCHAR(50) NOT NULL,
  category spot_category NOT NULL,
  floor_number INTEGER,
  zone_name VARCHAR(100),
  capacity INTEGER DEFAULT 1,
  is_available BOOLEAN DEFAULT true,
  hourly_rate DECIMAL(10, 2),
  daily_rate DECIMAL(10, 2),
  monthly_rate DECIMAL(10, 2),
  amenities TEXT[],
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (location_id) REFERENCES locations(location_id) ON DELETE CASCADE
);

-- Membership Tiers/Entitlements Table
CREATE TABLE membership_entitlements (
  entitlement_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tier_level membership_tier NOT NULL UNIQUE,
  access_rank INTEGER NOT NULL,
  description TEXT,
  is_priority_booking_enabled BOOLEAN DEFAULT false,
  eligible_spot_categories spot_category[] NOT NULL,
  max_guests_per_visit INTEGER DEFAULT 1,
  access_scope VARCHAR(50) DEFAULT 'Local',
  restricted_locations VARCHAR(50)[] DEFAULT '{}',
  available_cities TEXT[] DEFAULT '{}',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Usage and Quotas Table
CREATE TABLE usage_and_quotas (
  quota_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL UNIQUE,
  meeting_room_hours_per_month INTEGER DEFAULT 0,
  hours_consumed_current_month DECIMAL(8, 2) DEFAULT 0,
  printing_credits_remaining INTEGER DEFAULT 100,
  last_check_in_timestamp TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES users(customer_id) ON DELETE CASCADE
);

-- Bookings/Reservations Table
CREATE TABLE bookings (
  reservation_id VARCHAR(50) PRIMARY KEY,
  customer_id UUID NOT NULL,
  spot_id VARCHAR(50) NOT NULL,
  location_id VARCHAR(50) NOT NULL,
  start_time TIMESTAMP NOT NULL,
  end_time TIMESTAMP NOT NULL,
  status booking_status DEFAULT 'Pending',
  number_of_guests INTEGER DEFAULT 1,
  notes TEXT,
  total_cost DECIMAL(10, 2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES users(customer_id) ON DELETE CASCADE,
  FOREIGN KEY (spot_id) REFERENCES spots(spot_id) ON DELETE CASCADE,
  FOREIGN KEY (location_id) REFERENCES locations(location_id) ON DELETE CASCADE
);

-- Booking History/Analytics Table
CREATE TABLE booking_analytics (
  analytics_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL UNIQUE,
  total_bookings INTEGER DEFAULT 0,
  preferred_spot_id VARCHAR(50),
  average_stay_duration_hours DECIMAL(10, 2) DEFAULT 0,
  last_booking_date TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES users(customer_id) ON DELETE CASCADE,
  FOREIGN KEY (preferred_spot_id) REFERENCES spots(spot_id) ON DELETE SET NULL
);

-- Financials/Payments Table
CREATE TABLE financials (
  financial_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL UNIQUE,
  monthly_subscription_fee DECIMAL(10, 2) DEFAULT 0,
  currency VARCHAR(3) DEFAULT 'USD',
  outstanding_balance DECIMAL(10, 2) DEFAULT 0,
  payment_method_on_file VARCHAR(50),
  total_spent_lifetime DECIMAL(12, 2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES users(customer_id) ON DELETE CASCADE
);

-- Payment Transactions Table
CREATE TABLE payment_transactions (
  transaction_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  transaction_type VARCHAR(50) NOT NULL, -- 'subscription', 'booking', 'refund'
  payment_method VARCHAR(50),
  status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'completed', 'failed'
  reference_id VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES users(customer_id) ON DELETE CASCADE
);

-- Create Indexes for better query performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_status ON users(status);
CREATE INDEX idx_users_membership_type ON users(membership_type);
CREATE INDEX idx_user_profiles_customer_id ON user_profiles(customer_id);
CREATE INDEX idx_locations_city ON locations(city);
CREATE INDEX idx_locations_country ON locations(country);
CREATE INDEX idx_spots_location_id ON spots(location_id);
CREATE INDEX idx_spots_category ON spots(category);
CREATE INDEX idx_bookings_customer_id ON bookings(customer_id);
CREATE INDEX idx_bookings_spot_id ON bookings(spot_id);
CREATE INDEX idx_bookings_start_time ON bookings(start_time);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_usage_customer_id ON usage_and_quotas(customer_id);
CREATE INDEX idx_financials_customer_id ON financials(customer_id);
CREATE INDEX idx_transactions_customer_id ON payment_transactions(customer_id);
CREATE INDEX idx_transactions_created_at ON payment_transactions(created_at);
