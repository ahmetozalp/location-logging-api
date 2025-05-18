import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLocationDto } from './dto/create-location.dto';

/**
 * Checks if a point is inside a polygon using the ray-casting algorithm.
 * @param point [lng, lat] array
 * @param polygon Array of [lng, lat] arrays (GeoJSON outer ring)
 * @returns true if point is inside polygon, false otherwise
 */
function pointInPolygon(point: [number, number], polygon: [number, number][]): boolean {
  // Ray-casting algorithm
  let x = point[0], y = point[1];
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    let xi = polygon[i][0], yi = polygon[i][1];
    let xj = polygon[j][0], yj = polygon[j][1];
    let intersect = ((yi > y) !== (yj > y)) &&
      (x < (xj - xi) * (y - yi) / (yj - yi + 0.0000001) + xi);
    if (intersect) inside = !inside;
  }
  return inside;
}

@Injectable()
export class LocationsService {
  constructor(private prisma: PrismaService) {}

  /**
   * Handles a user location submission. Checks if the location is inside any area (using bounding box and polygon),
   * and logs the entry if so.
   * @param data { userId: string, latitude: number, longitude: number }
   * @returns Object with enteredAreas (array of area IDs) and logs (array of log entries)
   */
  async createLocation(data: CreateLocationDto) {
    // First, filter areas by bounding box
    const areas = await this.prisma.area.findMany({
      where: {
        minLat: { lte: data.latitude },
        maxLat: { gte: data.latitude },
        minLng: { lte: data.longitude },
        maxLng: { gte: data.longitude },
      },
    });
    const enteredAreas = areas.filter(area => {
      if (!area.polygon || typeof area.polygon !== 'object') return false;
      const coordinates = (area.polygon as any).coordinates?.[0];
      if (!Array.isArray(coordinates)) return false;
      return pointInPolygon([data.longitude, data.latitude], coordinates);
    });
    const logs: any[] = [];
    for (const area of enteredAreas) {
      const log = await this.prisma.locationLog.create({
        data: {
          userId: data.userId,
          areaId: area.id,
        },
      });
      logs.push(log);
    }
    return { enteredAreas: enteredAreas.map(a => a.id), logs };
  }
} 