import { PrismaClient } from '@prisma/client';
import { getDistance } from 'geolib';
import { CreateTruckStopInput, SearchTruckStopsInput } from '../types/truckStop';

const prisma = new PrismaClient();
const DEFAULT_RADIUS_KM = 0.1;

export class TruckStopService {
  async createTruckStop(input: CreateTruckStopInput, userId: number) {
    // Check for existing stops within 100M
    const nearbyStops = await this.searchTruckStops({
      latitude: input.latitude,
      longitude: input.longitude,
      radius: 0.1 // Update radius to 0.1KM (100M)
    });

    if (nearbyStops.length > 0) {
      throw new Error('A truck stop already exists within 100M of this location');
    }

    return prisma.truckStop.create({
      data: {
        ...input,
        userId
      }
    });
  }

  async searchTruckStops(input: SearchTruckStopsInput) {
    const radiusKm = input.radius || DEFAULT_RADIUS_KM;
    
    // Convert radius to rough lat/lon bounds for initial DB filter
    // 1 degree of latitude ≈ 111km
    const latDelta = radiusKm / 111;
    const lonDelta = radiusKm / (111 * Math.cos(input.latitude * Math.PI / 180));

    const stops = await prisma.truckStop.findMany({
      where: {
        latitude: {
          gte: input.latitude - latDelta,
          lte: input.latitude + latDelta
        },
        longitude: {
          gte: input.longitude - lonDelta,
          lte: input.longitude + lonDelta
        },
        ...(input.hasFood !== undefined && { hasFood: input.hasFood }),
        ...(input.hasShower !== undefined && { hasShower: input.hasShower }),
        ...(input.hasParking !== undefined && { hasParking: input.hasParking })
      },
      include: {
        reviews: true,
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    // Filter by exact distance and calculate average rating
    return stops
      .filter(stop => {
        const distance = getDistance(
          { latitude: input.latitude, longitude: input.longitude },
          { latitude: stop.latitude, longitude: stop.longitude }
        );
        return distance <= radiusKm * 1000; // Convert km to meters
      })
      .map(stop => ({
        ...stop,
        averageRating: stop.reviews.length > 0
          ? stop.reviews.reduce((sum, review) => sum + review.rating, 0) / stop.reviews.length
          : null
      }));
  }

  async getTruckStop(id: number) {
    return prisma.truckStop.findUnique({
      where: { id },
      include: {
        reviews: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        },
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });
  }

  async updateTruckStop(id: number, userId: number, input: Partial<CreateTruckStopInput>) {
    const stop = await prisma.truckStop.findUnique({
      where: { id }
    });

    if (!stop) {
      throw new Error('Truck stop not found');
    }

    if (stop.userId !== userId) {
      throw new Error('Unauthorized to update this truck stop');
    }

    return prisma.truckStop.update({
      where: { id },
      data: input
    });
  }

  async deleteTruckStop(id: number, userId: number) {
    const stop = await prisma.truckStop.findUnique({
      where: { id }
    });

    if (!stop) {
      throw new Error('Truck stop not found');
    }

    if (stop.userId !== userId) {
      throw new Error('Unauthorized to delete this truck stop');
    }

    return prisma.truckStop.delete({
      where: { id }
    });
  }
}
