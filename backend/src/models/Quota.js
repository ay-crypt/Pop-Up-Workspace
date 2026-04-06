const db = require('../config/database');

// Get usage quota
const getUserQuota = async (customerId) => {
  const query = 'SELECT * FROM usage_and_quotas WHERE customer_id = $1';
  const result = await db.query(query, [customerId]);
  return result.rows[0];
};

// Create usage quota
const createUserQuota = async (customerId, meetingHours = 20) => {
  const query = `
    INSERT INTO usage_and_quotas (customer_id, meeting_room_hours_per_month, printing_credits_remaining)
    VALUES ($1, $2, 100)
    RETURNING *;
  `;
  const result = await db.query(query, [customerId, meetingHours]);
  return result.rows[0];
};

// Update quota usage
const updateQuotaUsage = async (customerId, hoursConsumed, printingCreditsUsed = 0) => {
  const query = `
    UPDATE usage_and_quotas 
    SET 
      hours_consumed_current_month = hours_consumed_current_month + $1,
      printing_credits_remaining = CASE 
        WHEN printing_credits_remaining - $2 < 0 THEN 0 
        ELSE printing_credits_remaining - $2 
      END,
      last_check_in_timestamp = CURRENT_TIMESTAMP,
      updated_at = CURRENT_TIMESTAMP
    WHERE customer_id = $3
    RETURNING *;
  `;
  const result = await db.query(query, [hoursConsumed, printingCreditsUsed, customerId]);
  return result.rows[0];
};

// Reset monthly quota
const resetMonthlyQuota = async (customerId) => {
  const query = `
    UPDATE usage_and_quotas 
    SET 
      hours_consumed_current_month = 0,
      printing_credits_remaining = 100,
      updated_at = CURRENT_TIMESTAMP
    WHERE customer_id = $1
    RETURNING *;
  `;
  const result = await db.query(query, [customerId]);
  return result.rows[0];
};

module.exports = {
  getUserQuota,
  createUserQuota,
  updateQuotaUsage,
  resetMonthlyQuota,
};
