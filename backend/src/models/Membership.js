const db = require('../config/database');

// Get membership entitlements by tier
const getEntitlementsByTier = async (tier) => {
  const query = 'SELECT * FROM membership_entitlements WHERE tier_level = $1';
  const result = await db.query(query, [tier]);
  return result.rows[0];
};

// Get all membership tiers
const getAllTiers = async () => {
  const query = `
    SELECT * FROM membership_entitlements 
    ORDER BY access_rank ASC;
  `;
  const result = await db.query(query);
  return result.rows;
};

// Get user entitlements
const getUserEntitlements = async (customerId) => {
  const query = `
    SELECT me.* FROM membership_entitlements me
    INNER JOIN users u ON u.membership_type = me.tier_level
    WHERE u.customer_id = $1;
  `;
  const result = await db.query(query, [customerId]);
  return result.rows[0];
};

// Get financials
const getFinancials = async (customerId) => {
  const query = 'SELECT * FROM financials WHERE customer_id = $1';
  const result = await db.query(query, [customerId]);
  return result.rows[0];
};

// Create financials record
const createFinancials = async (customerId, monthlyFee = 299.00) => {
  const query = `
    INSERT INTO financials (customer_id, monthly_subscription_fee)
    VALUES ($1, $2)
    RETURNING *;
  `;
  const result = await db.query(query, [customerId, monthlyFee]);
  return result.rows[0];
};

// Update balance
const updateBalance = async (customerId, amount) => {
  const query = `
    UPDATE financials 
    SET outstanding_balance = outstanding_balance + $1,
        updated_at = CURRENT_TIMESTAMP
    WHERE customer_id = $2
    RETURNING *;
  `;
  const result = await db.query(query, [amount, customerId]);
  return result.rows[0];
};

// Get payment transactions
const getPaymentTransactions = async (customerId, limit = 50, offset = 0) => {
  const query = `
    SELECT * FROM payment_transactions 
    WHERE customer_id = $1
    ORDER BY created_at DESC 
    LIMIT $2 OFFSET $3;
  `;
  const result = await db.query(query, [customerId, limit, offset]);
  return result.rows;
};

module.exports = {
  getEntitlementsByTier,
  getAllTiers,
  getUserEntitlements,
  getFinancials,
  createFinancials,
  updateBalance,
  getPaymentTransactions,
};
