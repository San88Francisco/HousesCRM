export type BuildingFeatureProperties = {
  height?: number;
  render_height?: number;
  min_height?: number;
  render_min_height?: number;
  [key: string]: string | number | boolean | null | undefined;
};

export type GeoJSONFeatureCollection = {
  type: 'FeatureCollection';
  features: Array<{
    type: 'Feature';
    properties: BuildingFeatureProperties;
    geometry: {
      type: 'Polygon';
      coordinates: number[][][];
    };
  }>;
};

export interface MapActionsRef {
  highlightHouse: (houseId: string, lng: number, lat: number) => void;
  highlightAndFlyToHouse: (houseId: string, lng: number, lat: number) => void;
  clearHighlight: () => void;
}
