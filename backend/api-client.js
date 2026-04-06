// API Client for Pop-Up Workspace Frontend
// Place this in your frontend project (e.g., src/services/api.js)

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

class ApiClient {
  constructor() {
    this.token = localStorage.getItem('auth_token');
  }

  setToken(token) {
    this.token = token;
    localStorage.setItem('auth_token', token);
  }

  getToken() {
    return this.token;
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('auth_token');
  }

  async request(endpoint, options = {}) {
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      if (response.status === 401) {
        this.clearToken();
        // Redirect to login if needed
      }
      throw new Error(`API Error: ${response.status}`);
    }

    return response.json();
  }

  // Auth Endpoints
  async signup(email, password, fullName, membershipType = 'Silver') {
    const data = await this.request('/users/signup', {
      method: 'POST',
      body: JSON.stringify({
        email,
        password,
        full_name: fullName,
        membership_type: membershipType,
      }),
    });
    if (data.token) {
      this.setToken(data.token);
    }
    return data;
  }

  async login(email, password) {
    const data = await this.request('/users/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    if (data.token) {
      this.setToken(data.token);
    }
    return data;
  }

  async logout() {
    this.clearToken();
  }

  // User Endpoints
  async getUserProfile(customerId) {
    return this.request(`/users/${customerId}`);
  }

  async updateUserProfile(customerId, updates) {
    return this.request(`/users/${customerId}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  // Booking Endpoints
  async createBooking(bookingData) {
    return this.request('/bookings', {
      method: 'POST',
      body: JSON.stringify(bookingData),
    });
  }

  async getUserBookings(limit = 50, offset = 0) {
    return this.request(`/bookings?limit=${limit}&offset=${offset}`);
  }

  async getUpcomingBookings() {
    return this.request('/bookings/upcoming');
  }

  async getBookingDetails(reservationId) {
    return this.request(`/bookings/${reservationId}`);
  }

  async cancelBooking(reservationId) {
    return this.request(`/bookings/${reservationId}/cancel`, {
      method: 'PUT',
    });
  }

  // Location Endpoints
  async getLocations(limit = 50, offset = 0) {
    return this.request(`/locations?limit=${limit}&offset=${offset}`);
  }

  async getLocationsByCity(city, limit = 50, offset = 0) {
    return this.request(`/locations/city/${city}?limit=${limit}&offset=${offset}`);
  }

  async getAvailableCities() {
    return this.request('/locations/available/cities');
  }

  async getLocationDetails(locationId) {
    return this.request(`/locations/${locationId}`);
  }

  async getLocationSpots(locationId) {
    return this.request(`/locations/${locationId}/spots`);
  }

  // Membership Endpoints
  async getMembershipTiers() {
    return this.request('/memberships/tiers');
  }

  async getUserMembershipDetails() {
    return this.request('/memberships/user/details');
  }

  async getPaymentHistory(limit = 50, offset = 0) {
    return this.request(`/memberships/user/payments?limit=${limit}&offset=${offset}`);
  }
}

export default new ApiClient();
