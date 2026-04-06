const db = require('../config/database');
const { v4: uuidv4 } = require('uuid');

// Create booking
const createBooking = async (bookingData) => {
  const reservationId = `RES-${Date.now()}`;
  const query = `
    INSERT INTO bookings (
      reservation_id, customer_id, spot_id, location_id, 
      start_time, end_time, number_of_guests, notes, total_cost, status
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'Pending')
    RETURNING *;
  `;
  
  const result = await db.query(query, [
    reservationId,
    bookingData.customer_id,
    bookingData.spot_id,
    bookingData.location_id,
    bookingData.start_time,
    bookingData.end_time,
    bookingData.number_of_guests || 1,
    bookingData.notes,
    bookingData.total_cost,
  ]);
  
  return result.rows[0];
};

// Get booking by ID
const getBookingById = async (reservationId) => {
  const query = 'SELECT * FROM bookings WHERE reservation_id = $1';
  const result = await db.query(query, [reservationId]);
  return result.rows[0];
};

// Get user's bookings
const getUserBookings = async (customerId, limit = 50, offset = 0) => {
  const query = `
    SELECT * FROM bookings 
    WHERE customer_id = $1
    ORDER BY start_time DESC 
    LIMIT $2 OFFSET $3;
  `;
  const result = await db.query(query, [customerId, limit, offset]);
  return result.rows;
};

// Get upcoming bookings
const getUpcomingBookings = async (customerId) => {
  const query = `
    SELECT * FROM bookings 
    WHERE customer_id = $1 
    AND start_time > CURRENT_TIMESTAMP
    AND status IN ('Confirmed', 'Pending')
    ORDER BY start_time ASC;
  `;
  const result = await db.query(query, [customerId]);
  return result.rows;
};

// Update booking status
const updateBookingStatus = async (reservationId, status) => {
  const query = `
    UPDATE bookings 
    SET status = $1, updated_at = CURRENT_TIMESTAMP
    WHERE reservation_id = $2
    RETURNING *;
  `;
  const result = await db.query(query, [status, reservationId]);
  return result.rows[0];
};

// Cancel booking
const cancelBooking = async (reservationId) => {
  return updateBookingStatus(reservationId, 'Cancelled');
};

module.exports = {
  createBooking,
  getBookingById,
  getUserBookings,
  getUpcomingBookings,
  updateBookingStatus,
  cancelBooking,
};
