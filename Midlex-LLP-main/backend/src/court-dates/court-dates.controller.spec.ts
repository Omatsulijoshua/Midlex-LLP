import { Test, TestingModule } from '@nestjs/testing';
import { CourtDatesController } from './court-dates.controller';

describe('CourtDatesController', () => {
  let controller: CourtDatesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CourtDatesController],
    }).compile();

    controller = module.get<CourtDatesController>(CourtDatesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
