import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { RealtyController } from './realty.controller';
import { RealtyService } from './realty.service';

@Module({
  imports: [PrismaModule],
  controllers: [RealtyController],
  providers: [RealtyService],
})
export class RealtyModule {}
