# Frontend Integration Guide

This guide explains how to connect your Stitch frontend to the Pop-Up Workspace backend API.

## Setup

### 1. Environment Configuration

Create a `.env` file in your frontend project:

```env
VITE_API_URL=http://localhost:3000/api
```

### 2. API Client Setup

Copy `api-client.js` from the backend directory to your frontend:

```bash
# Copy the API client to your frontend
cp backend/api-client.js frontend/src/services/api.js
```

### 3. Update Vite Configuration

Ensure your `vite.config.js` includes CORS setup:

```javascript
export default {
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
}
```

## Usage Examples

### Authentication

```javascript
import api from './services/api';

// Signup
async function handleSignup(email, password, fullName) {
  try {
    const result = await api.signup(email, password, fullName, 'Gold');
    console.log('User created:', result.data);
    // Redirect to dashboard
  } catch (error) {
    console.error('Signup failed:', error);
  }
}

// Login
async function handleLogin(email, password) {
  try {
    const result = await api.login(email, password);
    console.log('Logged in:', result.data);
    // Redirect to dashboard
  } catch (error) {
    console.error('Login failed:', error);
  }
}

// Logout
function handleLogout() {
  api.logout();
  // Redirect to login page
}
```

### User Profile

```javascript
// Get profile
async function loadUserProfile(customerId) {
  try {
    const result = await api.getUserProfile(customerId);
    return result.data;
  } catch (error) {
    console.error('Failed to load profile:', error);
  }
}

// Update profile
async function updateProfile(customerId, updates) {
  try {
    const result = await api.updateUserProfile(customerId, {
      full_name: 'New Name',
      company_name: 'My Company',
      job_title: 'Developer',
      bio: 'I am a developer',
      primary_location_id: 'LOC-NY-001',
    });
    console.log('Profile updated:', result.data);
  } catch (error) {
    console.error('Update failed:', error);
  }
}
```

### Locations & Availability

```javascript
// Get all locations
async function loadLocations() {
  try {
    const result = await api.getLocations();
    return result.data;
  } catch (error) {
    console.error('Failed to load locations:', error);
  }
}

// Get locations by city
async function loadCityLocations(city) {
  try {
    const result = await api.getLocationsByCity(city);
    return result.data;
  } catch (error) {
    console.error('Failed to load locations:', error);
  }
}

// Get available cities
async function loadAvailableCities() {
  try {
    const result = await api.getAvailableCities();
    return result.data;
  } catch (error) {
    console.error('Failed to load cities:', error);
  }
}

// Get location details with spots
async function loadLocationDetails(locationId) {
  try {
    const result = await api.getLocationDetails(locationId);
    return result.data;
  } catch (error) {
    console.error('Failed to load location:', error);
  }
}
```

### Bookings

```javascript
// Create booking
async function createBooking(spotId, locationId, startTime, endTime) {
  try {
    const result = await api.createBooking({
      spot_id: spotId,
      location_id: locationId,
      start_time: startTime, // ISO 8601 format
      end_time: endTime,     // ISO 8601 format
      number_of_guests: 1,
      notes: 'Regular booking',
    });
    console.log('Booking created:', result.data);
    return result.data;
  } catch (error) {
    console.error('Booking failed:', error);
  }
}

// Get user bookings
async function loadUserBookings() {
  try {
    const result = await api.getUserBookings();
    return result.data;
  } catch (error) {
    console.error('Failed to load bookings:', error);
  }
}

// Get upcoming bookings
async function loadUpcomingBookings() {
  try {
    const result = await api.getUpcomingBookings();
    return result.data;
  } catch (error) {
    console.error('Failed to load upcoming bookings:', error);
  }
}

// Cancel booking
async function cancelUserBooking(reservationId) {
  try {
    const result = await api.cancelBooking(reservationId);
    console.log('Booking cancelled:', result.data);
  } catch (error) {
    console.error('Cancellation failed:', error);
  }
}
```

### Membership & Financials

```javascript
// Get membership tiers
async function loadMembershipTiers() {
  try {
    const result = await api.getMembershipTiers();
    return result.data;
  } catch (error) {
    console.error('Failed to load tiers:', error);
  }
}

// Get user membership details
async function loadMembershipDetails() {
  try {
    const result = await api.getUserMembershipDetails();
    return result.data;
  } catch (error) {
    console.error('Failed to load membership details:', error);
  }
}

// Get payment history
async function loadPaymentHistory() {
  try {
    const result = await api.getPaymentHistory();
    return result.data;
  } catch (error) {
    console.error('Failed to load payment history:', error);
  }
}
```

## React Example Component

```jsx
import { useState, useEffect } from 'react';
import api from './services/api';

function Dashboard() {
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const customerId = localStorage.getItem('customer_id');
    if (customerId) {
      loadDashboard(customerId);
    }
  }, []);

  async function loadDashboard(customerId) {
    try {
      const [userResult, bookingsResult] = await Promise.all([
        api.getUserProfile(customerId),
        api.getUpcomingBookings(),
      ]);
      
      setUser(userResult.data.user);
      setBookings(bookingsResult.data);
    } catch (error) {
      console.error('Failed to load dashboard:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <div>Loading...</div>;

  return (
    <div className="dashboard">
      <h1>Welcome, {user?.full_name}</h1>
      <h2>Upcoming Bookings ({bookings.length})</h2>
      {bookings.map(booking => (
        <div key={booking.reservation_id} className="booking-card">
          <p>Location: {booking.location_id}</p>
          <p>Date: {new Date(booking.start_time).toLocaleDateString()}</p>
          <p>Status: {booking.status}</p>
        </div>
      ))}
    </div>
  );
}

export default Dashboard;
```

## Deployment

### Frontend
```bash
npm run build
# Deploy dist folder to your hosting
```

### Backend
```bash
# Production environment
NODE_ENV=production npm start
```

Update `VITE_API_URL` in production environment to your deployed backend URL:
```
VITE_API_URL=https://api.yourproduct.com/api
```

## Troubleshooting

### CORS Errors
- Ensure backend is running: `npm run dev` in backend folder
- Check CORS_ORIGIN in backend `.env`
- Verify frontend API URL matches backend address

### Authentication Issues
- Token not persisting: Check localStorage permissions
- 401 Unauthorized: Token may have expired, re-login
- Invalid credentials: Verify signup/login endpoint working

### Data Not Loading
- Check Network tab in browser DevTools
- Verify backend database is populated with seed data
- Check backend logs for errors
