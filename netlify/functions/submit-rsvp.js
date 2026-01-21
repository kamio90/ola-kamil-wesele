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
    const {
      token,
      status,
      companion,
      accommodation,
      transport,
      dietary,
      email,
      phone,
      additionalInfo
    } = await req.json();

    if (!token) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Token is required'
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

    // Find guest by token
    const guestIndex = guestsData.guests.findIndex(g => g.token === token.toUpperCase());

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

    // Update guest data
    guestsData.guests[guestIndex] = {
      ...guestsData.guests[guestIndex],
      status: status || guestsData.guests[guestIndex].status,
      companion: companion !== undefined ? companion : guestsData.guests[guestIndex].companion,
      accommodation: accommodation !== undefined ? accommodation : guestsData.guests[guestIndex].accommodation,
      transport: transport !== undefined ? transport : guestsData.guests[guestIndex].transport,
      dietary: dietary !== undefined ? dietary : guestsData.guests[guestIndex].dietary,
      email: email || guestsData.guests[guestIndex].email,
      phone: phone || guestsData.guests[guestIndex].phone,
      additionalInfo: additionalInfo !== undefined ? additionalInfo : guestsData.guests[guestIndex].additionalInfo,
      updatedAt: new Date().toISOString(),
    };

    // Update lastUpdated timestamp
    guestsData.lastUpdated = new Date().toISOString();

    // Save back to Blobs
    await store.set('wedding-guests', JSON.stringify(guestsData));

    return new Response(JSON.stringify({
      success: true,
      message: 'Dziękujemy! Twoje potwierdzenie zostało zapisane.'
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });

  } catch (error) {
    console.error('Error in submit-rsvp:', error);
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
  path: '/api/submit-rsvp'
};
