// API Configuration
const API_BASE_URL = window.location.origin + '/api';

class APIClient {
  constructor() {
    this.token = localStorage.getItem('gyatt_token');
  }

  setToken(token) {
    this.token = token;
    localStorage.setItem('gyatt_token', token);
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('gyatt_token');
  }

  async request(endpoint, options = {}) {
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Request failed');
    }

    return data;
  }

  // Auth
  async login(email, password) {
    const data = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    this.setToken(data.token);
    return data.user;
  }

  // User
  async getProfile() {
    return this.request('/user/profile');
  }

  async getUsers() {
    return this.request('/users');
  }

  async createUser(userData) {
    return this.request('/users', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  }

  async updateUser(id, userData) {
    return this.request(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData)
    });
  }

  async deleteUser(id) {
    return this.request(`/users/${id}`, {
      method: 'DELETE'
    });
  }

  // Missions
  async getMissions() {
    return this.request('/missions');
  }

  async createMission(missionData) {
    return this.request('/missions', {
      method: 'POST',
      body: JSON.stringify(missionData)
    });
  }

  async updateMission(id, missionData) {
    return this.request(`/missions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(missionData)
    });
  }

  async deleteMission(id) {
    return this.request(`/missions/${id}`, {
      method: 'DELETE'
    });
  }

  // Suggestions
  async getSuggestions() {
    return this.request('/suggestions');
  }

  async createSuggestion(text) {
    return this.request('/suggestions', {
      method: 'POST',
      body: JSON.stringify({ text })
    });
  }

  async deleteSuggestion(id) {
    return this.request(`/suggestions/${id}`, {
      method: 'DELETE'
    });
  }
}
