import { Module } from '@nestjs/common';
import { AreasModule } from './areas/areas.module';
import { LocationsModule } from './locations/locations.module';
import { LogsModule } from './logs/logs.module';
import { AppController } from './app.controller';

@Module({
  imports: [AreasModule, LocationsModule, LogsModule],
  controllers: [AppController],
})
export class AppModule {}
