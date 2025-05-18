import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { AreasService } from './areas.service';
import { CreateAreaDto } from './dto/create-area.dto';

/**
 * Controller for managing geographic areas (polygons).
 * Provides endpoints to create and list areas with pagination.
 */
@Controller('areas')
export class AreasController {
  constructor(private readonly areasService: AreasService) {}

  /**
   * Create a new area (polygon).
   * @param createAreaDto { name: string, polygon: GeoJSON Polygon }
   * @returns The created area object
   */
  @Post()
  create(@Body() createAreaDto: CreateAreaDto) {
    return this.areasService.create(createAreaDto);
  }

  /**
   * List areas with pagination.
   * @param page Page number (default: 1)
   * @param limit Number of items per page (default: 100)
   * @returns Paginated list of areas
   */
  @Get()
  findAll(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '100',
  ) {
    return this.areasService.findAll({
      page: parseInt(page, 10) || 1,
      limit: parseInt(limit, 10) || 100,
    });
  }
} 