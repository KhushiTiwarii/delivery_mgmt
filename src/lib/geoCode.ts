// utils/geocodeORS.ts
import axios from 'axios';

export async function geocodeAddressORS(area: string): Promise<{ lat: number; lng: number } | null> {
  const fullAddress = `${area},Mumbai`;

  try {
    const response = await axios.get('https://api.openrouteservice.org/geocode/search', {
      params: {
        api_key: process.env.NEXT_PUBLIC_ORS_API_KEY, // Ensure this API key is set in your environment variables
        text: fullAddress,
        boundary_country: 'India', // Adjust the country code if you are using a specific location
      },
    });

    const coords = response.data.features[0]?.geometry.coordinates;
    return coords ? { lat: coords[1], lng: coords[0] } : null;
  } catch (error) {
    console.error('Geocoding error with ORS:', error);
    return null;
  }
}
