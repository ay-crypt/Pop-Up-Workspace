const MEMBERSHIP_TIERS = {
  SILVER: {
    name: 'Silver',
    access_rank: 1,
    description: 'Basic access & single city',
  },
  GOLD: {
    name: 'Gold',
    access_rank: 2,
    description: 'Premium spots & multi-city access',
  },
  PLATINUM: {
    name: 'Platinum',
    access_rank: 3,
    description: 'VIP access & unlimited cities',
  },
};

const SPOT_CATEGORIES = [
  'Open Desk',
  'Private Office',
  'Executive Suite',
  'Meeting Room',
  'Phone Booth',
];

const USER_STATUS = {
  ACTIVE: 'Active',
  INACTIVE: 'Inactive',
  SUSPENDED: 'Suspended',
  PENDING: 'Pending',
};

const BOOKING_STATUS = {
  PENDING: 'Pending',
  CONFIRMED: 'Confirmed',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
};

module.exports = {
  MEMBERSHIP_TIERS,
  SPOT_CATEGORIES,
  USER_STATUS,
  BOOKING_STATUS,
};
