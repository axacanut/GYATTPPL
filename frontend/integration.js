/**
 * GYATT PPL - Frontend Integration Script
 * This file provides helper functions to integrate the original HTML with the backend API
 */

// API Base URL - automatically detects if running locally or in production
const API_BASE_URL = window.location.origin + '/api';

// Helper function to get token from localStorage
function getToken() {
    return localStorage.getItem('gyatt_token');
}

// Helper function to set token in localStorage
function setToken(token) {
    localStorage.setItem('gyatt_token');
}

// Helper function to clear token
function clearToken() {
    localStorage.removeItem('gyatt_token');
}

// Helper function to make API requests
async function apiRequest(endpoint, options = {}) {
    const token = getToken();
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            ...options,
            headers
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Request failed');
        }

        return data;
    } catch (error) {
        console.error('API Request failed:', error);
        throw error;
    }
}

// ==================== INTEGRATION FUNCTIONS ====================

/**
 * Replace the localStorage-based functions in the original HTML with these API-based versions
 */

// AUTH FUNCTIONS
async function handleLoginAPI(email, password) {
    try {
        const data = await apiRequest('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password })
        });
        
        setToken(data.token);
        return data.user;
    } catch (error) {
        throw error;
    }
}

// USER FUNCTIONS
async function getCurrentUserAPI() {
    try {
        return await apiRequest('/user/profile');
    } catch (error) {
        console.error('Failed to get user:', error);
        return null;
    }
}

async function getUsersAPI() {
    try {
        return await apiRequest('/users');
    } catch (error) {
        console.error('Failed to get users:', error);
        return [];
    }
}

async function createUserAPI(userData) {
    try {
        return await apiRequest('/users', {
            method: 'POST',
            body: JSON.stringify(userData)
        });
    } catch (error) {
        console.error('Failed to create user:', error);
        throw error;
    }
}

async function updateUserAPI(id, userData) {
    try {
        return await apiRequest(`/users/${id}`, {
            method: 'PUT',
            body: JSON.stringify(userData)
        });
    } catch (error) {
        console.error('Failed to update user:', error);
        throw error;
    }
}

async function deleteUserAPI(id) {
    try {
        await apiRequest(`/users/${id}`, {
            method: 'DELETE'
        });
    } catch (error) {
        console.error('Failed to delete user:', error);
        throw error;
    }
}

// MISSION FUNCTIONS
async function getMissionsAPI() {
    try {
        return await apiRequest('/missions');
    } catch (error) {
        console.error('Failed to get missions:', error);
        return [];
    }
}

async function createMissionAPI(missionData) {
    try {
        return await apiRequest('/missions', {
            method: 'POST',
            body: JSON.stringify(missionData)
        });
    } catch (error) {
        console.error('Failed to create mission:', error);
        throw error;
    }
}

async function updateMissionAPI(id, missionData) {
    try {
        return await apiRequest(`/missions/${id}`, {
            method: 'PUT',
            body: JSON.stringify(missionData)
        });
    } catch (error) {
        console.error('Failed to update mission:', error);
        throw error;
    }
}

async function deleteMissionAPI(id) {
    try {
        await apiRequest(`/missions/${id}`, {
            method: 'DELETE'
        });
    } catch (error) {
        console.error('Failed to delete mission:', error);
        throw error;
    }
}

// SUGGESTION FUNCTIONS
async function getSuggestionsAPI() {
    try {
        return await apiRequest('/suggestions');
    } catch (error) {
        console.error('Failed to get suggestions:', error);
        return [];
    }
}

async function createSuggestionAPI(text) {
    try {
        return await apiRequest('/suggestions', {
            method: 'POST',
            body: JSON.stringify({ text })
        });
    } catch (error) {
        console.error('Failed to create suggestion:', error);
        throw error;
    }
}

async function deleteSuggestionAPI(id) {
    try {
        await apiRequest(`/suggestions/${id}`, {
            method: 'DELETE'
        });
    } catch (error) {
        console.error('Failed to delete suggestion:', error);
        throw error;
    }
}

/**
 * INTEGRATION NOTES:
 * 
 * In your original index.html, replace the localStorage functions with API calls:
 * 
 * OLD CODE (localStorage):
 * ----------------------
 * function handleLogin(e) {
 *     e.preventDefault();
 *     const email = document.getElementById('loginEmail').value;
 *     const password = document.getElementById('loginPassword').value;
 *     const users = getUsers(); // localStorage
 *     let user = users.find(u => u.email === email);
 *     // ... rest of code
 * }
 * 
 * NEW CODE (API):
 * ----------------------
 * async function handleLogin(e) {
 *     e.preventDefault();
 *     const email = document.getElementById('loginEmail').value;
 *     const password = document.getElementById('loginPassword').value;
 *     
 *     try {
 *         const user = await handleLoginAPI(email, password);
 *         // Success - proceed to load app
 *         loadApp();
 *     } catch (error) {
 *         // Show error message
 *         document.getElementById('loginError').textContent = error.message;
 *         document.getElementById('loginError').classList.remove('hidden');
 *     }
 * }
 * 
 * Apply similar changes to all other functions that interact with localStorage.
 */
