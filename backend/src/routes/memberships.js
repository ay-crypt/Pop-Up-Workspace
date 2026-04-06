const express = require('express');
const Membership = require('../models/Membership');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Get all membership tiers
router.get('/tiers', async (req, res) => {
  try {
    const tiers = await Membership.getAllTiers();

    res.status(200).json({
      success: true,
      data: tiers,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error fetching membership tiers',
    });
  }
});

// Get user membership details
router.get('/user/details', authMiddleware, async (req, res) => {
  try {
    const customer_id = req.user.customer_id;

    const entitlements = await Membership.getUserEntitlements(customer_id);
    const financials = await Membership.getFinancials(customer_id);

    res.status(200).json({
      success: true,
      data: {
        entitlements,
        financials,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error fetching membership details',
    });
  }
});

// Get payment history
router.get('/user/payments', authMiddleware, async (req, res) => {
  try {
    const customer_id = req.user.customer_id;
    const { limit = 50, offset = 0 } = req.query;

    const transactions = await Membership.getPaymentTransactions(
      customer_id,
      parseInt(limit),
      parseInt(offset)
    );

    res.status(200).json({
      success: true,
      data: transactions,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error fetching payment history',
    });
  }
});

module.exports = router;
