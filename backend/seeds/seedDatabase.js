const db = require('../src/config/database');

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');

    // Seed membership entitlements
    const entitlementsQuery = `
      INSERT INTO membership_entitlements 
      (tier_level, access_rank, description, is_priority_booking_enabled, eligible_spot_categories, max_guests_per_visit, access_scope, available_cities)
      VALUES
      ('Silver', 1, 'Basic access & single city', false, ARRAY['Open Desk']::spot_category[], 1, 'Local', ARRAY['New York']),
      ('Gold', 2, 'Premium spots & multi-city access', true, ARRAY['Open Desk', 'Private Office', 'Executive Suite']::spot_category[], 3, 'National', ARRAY['New York', 'San Francisco', 'London']),
      ('Platinum', 3, 'VIP access & unlimited cities', true, ARRAY['Open Desk', 'Private Office', 'Executive Suite', 'Meeting Room', 'Phone Booth']::spot_category[], 5, 'International', ARRAY['New York', 'San Francisco', 'London', 'Tokyo', 'Singapore'])
      ON CONFLICT (tier_level) DO NOTHING;
    `;
    await db.query(entitlementsQuery);
    console.log('✓ Membership entitlements seeded');

    // Seed locations
    const locationsQuery = `
      INSERT INTO locations 
      (location_id, name, city, country, address, postal_code, latitude, longitude, total_desks, available_desks, description, amenities)
      VALUES
      ('LOC-NY-001', 'Downtown Hub NYC', 'New York', 'USA', '123 Broadway', '10001', 40.7128, -74.0060, 50, 45, 'Premium workspace in heart of Manhattan', '["Free WiFi", "Coffee Bar", "Meeting Rooms", "Parking"]'::jsonb),
      ('LOC-SF-001', 'Silicon Valley Center', 'San Francisco', 'USA', '456 Market St', '94102', 37.7749, -122.4194, 80, 60, 'Modern offices with tech amenities', '["High Speed WiFi", "Standing Desks", "Phone Booths", "Kitchen"]'::jsonb),
      ('LOC-LON-001', 'London Business Hub', 'London', 'UK', '789 Piccadilly', 'W1J 9JX', 51.5074, -0.1278, 100, 85, 'Prime location in West End', '["WiFi", "Cafeteria", "Event Space", "Reception"]'::jsonb)
      ON CONFLICT (location_id) DO NOTHING;
    `;
    await db.query(locationsQuery);
    console.log('✓ Locations seeded');

    // Seed spots
    const spotsQuery = `
      INSERT INTO spots 
      (spot_id, location_id, category, floor_number, zone_name, capacity, hourly_rate, daily_rate, monthly_rate, amenities)
      VALUES
      ('DESK-401', 'LOC-NY-001', 'Open Desk', 4, 'Zone A', 1, 15.00, 100.00, 400.00, ARRAY['Monitor', 'Chair', 'Desk']),
      ('DESK-402', 'LOC-NY-001', 'Open Desk', 4, 'Zone A', 1, 15.00, 100.00, 400.00, ARRAY['Monitor', 'Chair', 'Desk']),
      ('OFFICE-301', 'LOC-NY-001', 'Private Office', 3, 'Premium', 4, 40.00, 300.00, 1200.00, ARRAY['Private Door', 'Conference Table', 'Whiteboard']),
      ('EXEC-201', 'LOC-NY-001', 'Executive Suite', 2, 'VIP', 8, 60.00, 450.00, 1800.00, ARRAY['Full Setup', 'Premium Furniture', 'Dedicated Support']),
      ('DESK-501', 'LOC-SF-001', 'Open Desk', 5, 'Tech Zone', 1, 20.00, 120.00, 450.00, ARRAY['Monitor', 'Ergonomic Chair', 'Standing Desk']),
      ('DESK-601', 'LOC-LON-001', 'Open Desk', 6, 'Creative', 1, 18.00, 110.00, 420.00, ARRAY['Monitor', 'Chair', 'Desk'])
      ON CONFLICT (spot_id) DO NOTHING;
    `;
    await db.query(spotsQuery);
    console.log('✓ Workspace spots seeded');

    console.log('✅ Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error.message);
    process.exit(1);
  }
}

seedDatabase();
