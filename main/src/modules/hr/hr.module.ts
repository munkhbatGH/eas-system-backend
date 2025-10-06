import { Global, Module } from '@nestjs/common';
import { HrController } from './hr.controller';
import { HrService } from './hr.service';

@Global()
@Module({
  controllers: [HrController],
  exports: [HrService],
  providers: [HrService]
})
export class HrModule {}
