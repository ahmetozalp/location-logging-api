import { Controller, Post, Body } from '@nestjs/common';
import { LocationsService } from './locations.service';
import { CreateLocationDto } from './dto/create-location.dto';

/**
 * Controller for handling user location submissions and area entry logging.
 */
@Controller('locations')
export class LocationsController {
  constructor(private readonly locationsService: LocationsService) {}

  /**
   * Submit a user location. Checks if the location is inside any area and logs the entry.
   * @param createLocationDto { userId: string, latitude: number, longitude: number }
   * @returns Object with enteredAreas (array of area IDs) and logs (array of log entries)
   */
  @Post()
  create(@Body() createLocationDto: CreateLocationDto) {
    return this.locationsService.createLocation(createLocationDto);
  }
} 