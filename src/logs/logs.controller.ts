import { Controller, Get, Query } from '@nestjs/common';
import { LogsService } from './logs.service';

/**
 * Controller for listing location entry logs.
 * Provides paginated log listing.
 */
@Controller('logs')
export class LogsController {
  constructor(private readonly logsService: LogsService) {}

  /**
   * List logs with pagination, ordered by most recent first.
   * @param page Page number (default: 1)
   * @param limit Number of items per page (default: 100)
   * @returns Paginated list of logs
   */
  @Get()
  findAll(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '100',
  ) {
    return this.logsService.findAll({
      page: parseInt(page, 10) || 1,
      limit: parseInt(limit, 10) || 100,
    });
  }
} 