import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class LogsService {
  constructor(private prisma: PrismaService) {}

  /**
   * Lists location entry logs with pagination, ordered by most recent first.
   * @param page Page number (default: 1)
   * @param limit Number of items per page (default: 100)
   * @returns Paginated list of logs
   */
  async findAll({ page = 1, limit = 100 }: { page?: number; limit?: number }) {
    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      this.prisma.locationLog.findMany({
        include: {
          user: true,
          area: true,
        },
        orderBy: { timestamp: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.locationLog.count(),
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