const express = require('express');
const { body } = require('express-validator');
const Booking = require('../models/Booking');
const Location = require('../models/Location');
const authMiddleware = require('../middleware/auth');
const validateRequest = require('../middleware/validator');

const router = express.Router();

// Create booking
router.post(
  '/',
  authMiddleware,
  [
    body('spot_id').notEmpty(),
    body('location_id').notEmpty(),
    body('start_time').isISO8601(),
    body('end_time').isISO8601(),
  ],
  validateRequest,
  async (req, res) => {
    try {
      const { spot_id, location_id, start_time, end_time, number_of_guests, notes } = req.body;
      const customer_id = req.user.customer_id;

      // Check if spot exists
      const spot = await Location.getSpotById(spot_id);
      if (!spot) {
        return res.status(404).json({
          success: false,
          message: 'Spot not found',
        });
      }

      // Check spot availability
      const isAvailable = await Location.isSpotAvailable(spot_id, start_time, end_time);
      if (!isAvailable) {
        return res.status(400).json({
          success: false,
          message: 'Spot not available for selected time',
        });
      }

      // Calculate total cost
      const startDate = new Date(start_time);
      const endDate = new Date(end_time);
      const hours = (endDate - startDate) / (1000 * 60 * 60);
      const totalCost = spot.hourly_rate ? hours * spot.hourly_rate : 0;

      const booking = await Booking.createBooking({
        customer_id,
        spot_id,
        location_id,
        start_time,
        end_time,
        number_of_guests,
        notes,
        total_cost: totalCost,
      });

      res.status(201).json({
        success: true,
        message: 'Booking created successfully',
        data: booking,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: 'Error creating booking',
      });
    }
  }
);

// Get user bookings
router.get('/', authMiddleware, async (req, res) => {
  try {
    const customer_id = req.user.customer_id;
    const { limit = 50, offset = 0 } = req.query;

    const bookings = await Booking.getUserBookings(
      customer_id,
      parseInt(limit),
      parseInt(offset)
    );

    res.status(200).json({
      success: true,
      data: bookings,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error fetching bookings',
    });
  }
});

// Get upcoming bookings
router.get('/upcoming', authMiddleware, async (req, res) => {
  try {
    const customer_id = req.user.customer_id;

    const bookings = await Booking.getUpcomingBookings(customer_id);

    res.status(200).json({
      success: true,
      data: bookings,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error fetching upcoming bookings',
    });
  }
});

// Get booking details
router.get('/:reservation_id', authMiddleware, async (req, res) => {
  try {
    const { reservation_id } = req.params;

    const booking = await Booking.getBookingById(reservation_id);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    // Check authorization
    if (booking.customer_id !== req.user.customer_id) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized',
      });
    }

    res.status(200).json({
      success: true,
      data: booking,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error fetching booking',
    });
  }
});

// Cancel booking
router.put('/:reservation_id/cancel', authMiddleware, async (req, res) => {
  try {
    const { reservation_id } = req.params;

    const booking = await Booking.getBookingById(reservation_id);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    // Check authorization
    if (booking.customer_id !== req.user.customer_id) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized',
      });
    }

    const updatedBooking = await Booking.cancelBooking(reservation_id);

    res.status(200).json({
      success: true,
      message: 'Booking cancelled successfully',
      data: updatedBooking,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error cancelling booking',
    });
  }
});

module.exports = router;
