const express = require('express');
const { body } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Quota = require('../models/Quota');
const Membership = require('../models/Membership');
const authMiddleware = require('../middleware/auth');
const validateRequest = require('../middleware/validator');

const router = express.Router();

// Signup
router.post(
  '/signup',
  [
    body('email').isEmail(),
    body('password').isLength({ min: 6 }),
    body('full_name').notEmpty(),
  ],
  validateRequest,
  async (req, res) => {
    try {
      const { email, password, full_name, membership_type } = req.body;

      // Check if user exists
      const existingUser = await User.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'User already exists',
        });
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt);

      // Create user
      const user = await User.createUser(email, passwordHash, full_name, membership_type || 'Silver');

      // Create user profile
      await User.createUserProfile(user.customer_id, {});

      // Create usage quota
      const quotaTier = membership_type === 'Gold' ? 20 : 10;
      await Quota.createUserQuota(user.customer_id, quotaTier);

      // Create financials
      const tier = await Membership.getEntitlementsByTier(membership_type || 'Silver');
      const monthlyFee = membership_type === 'Gold' ? 299 : 99;
      await Membership.createFinancials(user.customer_id, monthlyFee);

      // Generate token
      const token = jwt.sign(
        { customer_id: user.customer_id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRE || '7d' }
      );

      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: {
          customer_id: user.customer_id,
          email: user.email,
          full_name: user.full_name,
          membership_type: user.membership_type,
        },
        token,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: 'Error registering user',
      });
    }
  }
);

// Login
router.post(
  '/login',
  [
    body('email').isEmail(),
    body('password').notEmpty(),
  ],
  validateRequest,
  async (req, res) => {
    try {
      const { email, password } = req.body;

      const user = await User.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials',
        });
      }

      const passwordMatch = await bcrypt.compare(password, user.password_hash);
      if (!passwordMatch) {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials',
        });
      }

      const token = jwt.sign(
        { customer_id: user.customer_id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRE || '7d' }
      );

      res.status(200).json({
        success: true,
        message: 'Login successful',
        data: {
          customer_id: user.customer_id,
          email: user.email,
          full_name: user.full_name,
          membership_type: user.membership_type,
          status: user.status,
        },
        token,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: 'Error logging in',
      });
    }
  }
);

// Get user profile
router.get('/:customer_id', authMiddleware, async (req, res) => {
  try {
    const { customer_id } = req.params;

    // Check authorization
    if (req.user.customer_id !== customer_id) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized',
      });
    }

    const user = await User.getUserById(customer_id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const profile = await User.getUserProfile(customer_id);
    const quota = await Quota.getUserQuota(customer_id);
    const entitlements = await Membership.getUserEntitlements(customer_id);
    const financials = await Membership.getFinancials(customer_id);

    res.status(200).json({
      success: true,
      data: {
        user: {
          customer_id: user.customer_id,
          email: user.email,
          full_name: user.full_name,
          membership_type: user.membership_type,
          status: user.status,
          created_at: user.created_at,
        },
        profile,
        quota,
        entitlements,
        financials,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user profile',
    });
  }
});

// Update user profile
router.put('/:customer_id', authMiddleware, async (req, res) => {
  try {
    const { customer_id } = req.params;

    // Check authorization
    if (req.user.customer_id !== customer_id) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized',
      });
    }

    const { full_name, company_name, job_title, bio, primary_location_id } = req.body;

    const userUpdates = {};
    if (full_name) userUpdates.full_name = full_name;

    if (Object.keys(userUpdates).length > 0) {
      await User.updateUser(customer_id, userUpdates);
    }

    const profileUpdates = {};
    if (company_name) profileUpdates.company_name = company_name;
    if (job_title) profileUpdates.job_title = job_title;
    if (bio) profileUpdates.bio = bio;
    if (primary_location_id) profileUpdates.primary_location_id = primary_location_id;

    let updatedProfile = null;
    if (Object.keys(profileUpdates).length > 0) {
      updatedProfile = await User.updateUserProfile(customer_id, profileUpdates);
    }

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: updatedProfile,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error updating profile',
    });
  }
});

module.exports = router;
