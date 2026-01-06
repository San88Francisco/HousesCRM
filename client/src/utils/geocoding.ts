import { GeocodingResult } from '@/types/model/GeoMap3D/geocoding';

export async function geocodeAddress(
  address: string,
  city: string = 'Рівне',
): Promise<GeocodingResult | null> {
  try {
    const response = await fetch(
      `/api/houses/geocode?address=${encodeURIComponent(address)}&city=${encodeURIComponent(city)}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    if (!response.ok) {
      console.error('Помилка геокодінгу:', response.statusText);
      return null;
    }

    const data = await response.json();

    if (!data) {
      console.warn(`Адресу не знайдено: ${address}`);
      return null;
    }

    return {
      lat: data.lat,
      lng: data.lng,
      displayName: data.displayName,
    };
  } catch (error) {
    console.error('Помилка при геокодуванні адреси:', error);
    return null;
  }
}

export async function geocodeStreet(
  street: string,
  houseNumber?: string,
  city: string = 'Рівне',
): Promise<GeocodingResult | null> {
  const address = houseNumber ? `${street}, ${houseNumber}` : street;
  return geocodeAddress(address, city);
}
