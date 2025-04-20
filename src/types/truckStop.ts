export interface CreateTruckStopInput {
  name: string;
  description: string;
  latitude: number;
  longitude: number;
  hasFood: boolean;
  hasShower: boolean;
  hasParking: boolean;
  photos?: string[];
}

export interface TruckStopResponse {
  id: number;
  name: string;
  description: string;
  latitude: number;
  longitude: number;
  hasFood: boolean;
  hasShower: boolean;
  hasParking: boolean;
  photos: string[];
  createdAt: Date;
  updatedAt: Date;
  userId: number;
}

export interface SearchTruckStopsInput {
  latitude: number;
  longitude: number;
  radius?: number; // in kilometers, defaults to 1
  hasFood?: boolean;
  hasShower?: boolean;
  hasParking?: boolean;
}
