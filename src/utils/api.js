// API Base URL - will work in both development and production
const API_BASE = '/api';

/**
 * Check if a token is valid and get guest information
 * @param {string} token - The guest token
 * @returns {Promise<{success: boolean, guest?: object, error?: string}>}
 */
export const checkToken = async (token) => {
  try {
    const response = await fetch(`${API_BASE}/check-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token: token.toUpperCase() }),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error checking token:', error);
    return {
      success: false,
      error: 'Błąd połączenia. Spróbuj ponownie.',
    };
  }
};

/**
 * Submit RSVP form data
 * @param {object} formData - The RSVP form data
 * @returns {Promise<{success: boolean, message?: string, error?: string}>}
 */
export const submitRSVP = async (formData) => {
  try {
    const response = await fetch(`${API_BASE}/submit-rsvp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error submitting RSVP:', error);
    return {
      success: false,
      error: 'Błąd zapisu. Spróbuj ponownie.',
    };
  }
};

/**
 * Get all guests (admin only)
 * @param {string} adminToken - The admin token
 * @returns {Promise<{success: boolean, guests?: array, metadata?: object, error?: string}>}
 */
export const getGuests = async (adminToken) => {
  try {
    const response = await fetch(`${API_BASE}/admin-view`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ adminToken }),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error getting guests:', error);
    return {
      success: false,
      error: 'Błąd połączenia. Spróbuj ponownie.',
    };
  }
};

/**
 * Update guest data (admin only)
 * @param {string} adminToken - The admin token
 * @param {number} guestId - The guest ID
 * @param {object} updates - The fields to update
 * @returns {Promise<{success: boolean, message?: string, error?: string}>}
 */
export const updateGuest = async (adminToken, guestId, updates) => {
  try {
    const response = await fetch(`${API_BASE}/admin-update`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ adminToken, guestId, updates }),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error updating guest:', error);
    return {
      success: false,
      error: 'Błąd aktualizacji. Spróbuj ponownie.',
    };
  }
};

/**
 * Initialize data in Netlify Blobs (one-time setup)
 * @returns {Promise<{success: boolean, message?: string, error?: string}>}
 */
export const initData = async () => {
  try {
    const response = await fetch(`${API_BASE}/init-data`, {
      method: 'GET',
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error initializing data:', error);
    return {
      success: false,
      error: 'Błąd inicjalizacji danych.',
    };
  }
};
