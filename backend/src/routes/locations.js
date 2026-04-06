const express = require('express');
const Location = require('../models/Location');

const router = express.Router();

// Get all locations
router.get('/', async (req, res) => {
  try {
    const { limit = 50, offset = 0 } = req.query;

    const locations = await Location.getAllLocations(parseInt(limit), parseInt(offset));

    res.status(200).json({
      success: true,
      data: locations,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error fetching locations',
    });
  }
});

// Get locations by city
router.get('/city/:city', async (req, res) => {
  try {
    const { city } = req.params;
    const { limit = 50, offset = 0 } = req.query;

    const locations = await Location.getLocationsByCity(
      city,
      parseInt(limit),
      parseInt(offset)
    );

    res.status(200).json({
      success: true,
      data: locations,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error fetching locations',
    });
  }
});

// Get available cities
router.get('/available/cities', async (req, res) => {
  try {
    const cities = await Location.getAvailableCities();

    res.status(200).json({
      success: true,
      data: cities,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error fetching cities',
    });
  }
});

// Get location details
router.get('/:location_id', async (req, res) => {
  try {
    const { location_id } = req.params;

    const location = await Location.getLocationById(location_id);
    if (!location) {
      return res.status(404).json({
        success: false,
        message: 'Location not found',
      });
    }

    const spots = await Location.getLocationSpots(location_id);

    res.status(200).json({
      success: true,
      data: {
        location,
        spots,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error fetching location details',
    });
  }
});

// Get available spots in a location
router.get('/:location_id/spots', async (req, res) => {
  try {
    const { location_id } = req.params;

    const spots = await Location.getLocationSpots(location_id);

    res.status(200).json({
      success: true,
      data: spots,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error fetching spots',
    });
  }
});

module.exports = router;
