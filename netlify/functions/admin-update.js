import { getStore } from '@netlify/blobs';

export default async (req, context) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({
      success: false,
      error: 'Method not allowed'
    }), {
      status: 405,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }

  try {
    const { adminToken, guestId, updates } = await req.json();

    // Verify admin token
    if (adminToken !== 'admin_kamil_ola_2026') {
      return new Response(JSON.stringify({
        success: false,
        error: 'Unauthorized'
      }), {
        status: 403,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }

    if (!guestId || !updates) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Guest ID and updates are required'
      }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }

    // Get data from Blobs
    const store = getStore('wedding');
    const data = await store.get('wedding-guests');

    if (!data) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Data not found'
      }), {
        status: 404,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }

    const guestsData = JSON.parse(data);

    // Find guest by ID
    const guestIndex = guestsData.guests.findIndex(g => g.id === guestId);

    if (guestIndex === -1) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Guest not found'
      }), {
        status: 404,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }

    // Apply updates
    guestsData.guests[guestIndex] = {
      ...guestsData.guests[guestIndex],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    // Update lastUpdated timestamp
    guestsData.lastUpdated = new Date().toISOString();

    // Save back to Blobs
    await store.set('wedding-guests', JSON.stringify(guestsData));

    return new Response(JSON.stringify({
      success: true,
      message: 'Guest updated successfully'
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });

  } catch (error) {
    console.error('Error in admin-update:', error);
    return new Response(JSON.stringify({
      success: false,
      error: 'Internal server error',
      message: error.message
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }
};

export const config = {
  path: '/api/admin-update'
};
