const db = require('../config/database');

// User queries
const createUser = async (email, passwordHash, fullName, membershipType = 'Silver') => {
  const query = `
    INSERT INTO users (email, password_hash, full_name, membership_type, status)
    VALUES ($1, $2, $3, $4, 'Pending')
    RETURNING *;
  `;
  const result = await db.query(query, [email, passwordHash, fullName, membershipType]);
  return result.rows[0];
};

const getUserById = async (customerId) => {
  const query = 'SELECT * FROM users WHERE customer_id = $1';
  const result = await db.query(query, [customerId]);
  return result.rows[0];
};

const getUserByEmail = async (email) => {
  const query = 'SELECT * FROM users WHERE email = $1';
  const result = await db.query(query, [email]);
  return result.rows[0];
};

const updateUser = async (customerId, updates) => {
  const fields = Object.keys(updates);
  const values = Object.values(updates);
  
  if (fields.length === 0) return null;
  
  const setClause = fields.map((field, index) => `${field} = $${index + 1}`).join(', ');
  const query = `
    UPDATE users 
    SET ${setClause}, updated_at = CURRENT_TIMESTAMP
    WHERE customer_id = $${fields.length + 1}
    RETURNING *;
  `;
  
  const result = await db.query(query, [...values, customerId]);
  return result.rows[0];
};

const getAllUsers = async (limit = 50, offset = 0) => {
  const query = `
    SELECT * FROM users 
    ORDER BY created_at DESC 
    LIMIT $1 OFFSET $2;
  `;
  const result = await db.query(query, [limit, offset]);
  return result.rows;
};

// User Profile queries
const createUserProfile = async (customerId, profileData) => {
  const query = `
    INSERT INTO user_profiles (customer_id, primary_location_id, company_name, job_title, bio)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *;
  `;
  const result = await db.query(query, [
    customerId,
    profileData.primary_location_id,
    profileData.company_name,
    profileData.job_title,
    profileData.bio,
  ]);
  return result.rows[0];
};

const getUserProfile = async (customerId) => {
  const query = 'SELECT * FROM user_profiles WHERE customer_id = $1';
  const result = await db.query(query, [customerId]);
  return result.rows[0];
};

const updateUserProfile = async (customerId, updates) => {
  const fields = Object.keys(updates);
  const values = Object.values(updates);
  
  if (fields.length === 0) return null;
  
  const setClause = fields.map((field, index) => `${field} = $${index + 1}`).join(', ');
  const query = `
    UPDATE user_profiles 
    SET ${setClause}, updated_at = CURRENT_TIMESTAMP
    WHERE customer_id = $${fields.length + 1}
    RETURNING *;
  `;
  
  const result = await db.query(query, [...values, customerId]);
  return result.rows[0];
};

module.exports = {
  createUser,
  getUserById,
  getUserByEmail,
  updateUser,
  getAllUsers,
  createUserProfile,
  getUserProfile,
  updateUserProfile,
};
