/**
 * Bulk Area Seeder Script
 *
 * This script inserts 1,000,000 unique area (polygon) records into the database in batches.
 * Each area is a small square polygon with a unique center and bounding box.
 *
 * Usage:
 *   pnpm exec ts-node scripts/bulk-seed.ts
 *
 * Note: This is intended for performance/load testing and large dataset simulation.
 */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Generates a square GeoJSON polygon centered at (centerLat, centerLng) with the given size.
 * @param centerLat Latitude of the center
 * @param centerLng Longitude of the center
 * @param size Half-length of the square's side (in degrees)
 * @returns GeoJSON Polygon object
 */
function generatePolygon(centerLat: number, centerLng: number, size: number) {
  return {
    type: 'Polygon',
    coordinates: [[
      [centerLng - size, centerLat - size],
      [centerLng - size, centerLat + size],
      [centerLng + size, centerLat + size],
      [centerLng + size, centerLat - size],
      [centerLng - size, centerLat - size],
    ]],
  };
}

/**
 * Calculates the bounding box (min/max lat/lng) for a GeoJSON polygon.
 * @param polygon GeoJSON Polygon object
 * @returns { minLat, maxLat, minLng, maxLng }
 */
function getBoundingBox(polygon: any) {
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

/**
 * Main function: Inserts 1,000,000 areas in batches of 1,000.
 * Each area has a unique id, name, polygon, and bounding box.
 */
async function main() {
  const batchSize = 1000;
  const total = 1_000_000;
  let created = 0;

  for (let i = 0; i < total / batchSize; i++) {
    const data = Array.from({ length: batchSize }).map((_, idx) => {
      const n = i * batchSize + idx;
      const polygon = generatePolygon(40 + (n % 1000) * 0.0001, 30 + Math.floor(n / 1000) * 0.0001, 0.001);
      const bbox = getBoundingBox(polygon);
      return {
        id: `bulk-area-${n}`,
        name: `Area ${n}`,
        polygon,
        ...bbox,
      };
    });
    await prisma.area.createMany({ data, skipDuplicates: true });
    created += batchSize;
    if (created % 10000 === 0) console.log(`${created} area inserted`);
  }
  console.log('Total area:', created);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect()); 