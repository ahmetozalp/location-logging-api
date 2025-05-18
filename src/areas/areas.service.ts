import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Area } from '@prisma/client';
import { CreateAreaDto } from './dto/create-area.dto';

/**
 * Calculates the bounding box (min/max lat/lng) for a GeoJSON polygon.
 * @param polygon GeoJSON Polygon object
 * @returns { minLat, maxLat, minLng, maxLng }
 */
function getBoundingBox(polygon: any) {
  // GeoJSON Polygon: coordinates[0] = outer ring
  const coords = polygon?.coordinates?.[0] || [];
  let minLat = Number.POSITIVE_INFINITY, maxLat = Number.NEGATIVE_INFINITY;
  let minLng = Number.POSITIVE_INFINITY, maxLng = Number.NEGATIVE_INFINITY;
  for (const [lng, lat] of coords) {
    if (lat < minLat) minLat = lat;
    if (lat > maxLat) maxLat = lat;
    if (lng < minLng) minLng = lng;
    if (lng > maxLng) maxLng = lng;
  }
  return { minLat, maxLat, minLng, maxLng };
}

@Injectable()
export class AreasService {
  constructor(private prisma: PrismaService) {}

  /**
   * Creates a new area (polygon) and calculates its bounding box.
   * @param data Area creation DTO (name, polygon)
   * @returns The created area object
   */
  async create(data: CreateAreaDto): Promise<Area> {
    const bbox = getBoundingBox(data.polygon);
    return this.prisma.area.create({
      data: {
        ...data,
        ...bbox,
      },
    });
  }

  /**
   * Lists areas with pagination.
   * @param page Page number (default: 1)
   * @param limit Number of items per page (default: 100)
   * @returns Paginated list of areas
   */
  async findAll({ page = 1, limit = 100 }: { page?: number; limit?: number }) {
    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      this.prisma.area.findMany({ skip, take: limit }),
      this.prisma.area.count(),
    ]);
    return {
      items,
      total,
      page,
      limit,
      pageCount: Math.ceil(total / limit),
    };
  }
} 