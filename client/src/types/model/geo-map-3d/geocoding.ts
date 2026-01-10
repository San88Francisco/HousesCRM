export type AddressGeocoding = {
  house_number?: string;
  road?: string;
  city?: string;
  country?: string;
};

export type GeocodingResult = {
  lat: number;
  lng: number;
  displayName: string;
  address?: AddressGeocoding;
};
