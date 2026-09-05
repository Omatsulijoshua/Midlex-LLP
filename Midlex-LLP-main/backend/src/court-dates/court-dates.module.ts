import { Module } from '@nestjs/common';
import { CourtDatesService } from './court-dates.service';
import { CourtDatesController } from './court-dates.controller';

@Module({
  providers: [CourtDatesService],
  controllers: [CourtDatesController],
})
export class CourtDatesModule {}
