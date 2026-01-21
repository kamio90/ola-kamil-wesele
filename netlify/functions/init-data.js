import { getStore } from '@netlify/blobs';
import { readFileSync } from 'fs';
import { join } from 'path';

export default async (req, context) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  }

  try {
    const store = getStore('wedding');

    // Check if data already exists
    const existing = await store.get('wedding-guests');
    if (existing) {
      return new Response(JSON.stringify({
        success: false,
        message: 'Data already initialized. Use force=true to reinitialize.'
      }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }

    // Load guests data from file
    // In production, this will need to be handled differently
    // For now, we'll try to load it or return an error
    let guestsData;
    try {
      // Try to load from the repository root
      const dataPath = join(process.cwd(), 'guests_data.json');
      const fileContent = readFileSync(dataPath, 'utf-8');
      guestsData = JSON.parse(fileContent);
    } catch (fileError) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Could not load guests_data.json',
        message: 'Please ensure guests_data.json exists in the project root',
        details: fileError.message
      }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }

    // Set initial data
    await store.set('wedding-guests', JSON.stringify(guestsData));

    return new Response(JSON.stringify({
      success: true,
      message: 'Data initialized successfully',
      guestCount: guestsData.guests.length
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });

  } catch (error) {
    console.error('Error in init-data:', error);
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
  path: '/api/init-data'
};
