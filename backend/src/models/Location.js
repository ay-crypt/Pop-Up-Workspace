const db = require('../config/database');

// Get location by ID
const getLocationById = async (locationId) => {
  const query = 'SELECT * FROM locations WHERE location_id = $1';
  const result = await db.query(query, [locationId]);
  return result.rows[0];
};

// Get all locations
const getAllLocations = async (limit = 50, offset = 0) => {
  const query = `
    SELECT * FROM locations 
    WHERE is_active = true
    ORDER BY name ASC 
    LIMIT $1 OFFSET $2;
  `;
  const result = await db.query(query, [limit, offset]);
  return result.rows;
};

// Get locations by city
const getLocationsByCity = async (city, limit = 50, offset = 0) => {
  const query = `
    SELECT * FROM locations 
    WHERE city = $1 AND is_active = true
    ORDER BY name ASC 
    LIMIT $2 OFFSET $3;
  `;
  const result = await db.query(query, [city, limit, offset]);
  return result.rows;
};

// Get available cities
const getAvailableCities = async () => {
  const query = `
    SELECT DISTINCT city FROM locations 
    WHERE is_active = true
    ORDER BY city ASC;
  `;
  const result = await db.query(query);
  return result.rows.map(row => row.city);
};

// Get spots by location
const getLocationSpots = async (locationId) => {
  const query = `
    SELECT * FROM spots 
    WHERE location_id = $1 AND is_available = true
    ORDER BY category, zone_name ASC;
  `;
  const result = await db.query(query, [locationId]);
  return result.rows;
};

// Get spot by ID
const getSpotById = async (spotId) => {
  const query = 'SELECT * FROM spots WHERE spot_id = $1';
  const result = await db.query(query, [spotId]);
  return result.rows[0];
};

// Check spot availability
const isSpotAvailable = async (spotId, startTime, endTime) => {
  const query = `
    SELECT COUNT(*) as count FROM bookings 
    WHERE spot_id = $1 
    AND status IN ('Confirmed', 'Pending')
    AND (
      (start_time <= $2 AND end_time > $2) OR
      (start_time < $3 AND end_time >= $3) OR
      (start_time >= $2 AND end_time <= $3)
    );
  `;
  const result = await db.query(query, [spotId, startTime, endTime]);
  return parseInt(result.rows[0].count) === 0;
};

module.exports = {
  getLocationById,
  getAllLocations,
  getLocationsByCity,
  getAvailableCities,
  getLocationSpots,
  getSpotById,
  isSpotAvailable,
};
