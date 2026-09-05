import { Test, TestingModule } from '@nestjs/testing';
import { CourtDatesService } from './court-dates.service';

describe('CourtDatesService', () => {
  let service: CourtDatesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CourtDatesService],
    }).compile();

    service = module.get<CourtDatesService>(CourtDatesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
