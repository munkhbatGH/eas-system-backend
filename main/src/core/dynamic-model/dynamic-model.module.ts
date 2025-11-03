import { Global, Module } from '@nestjs/common';
import { DynamicModelController } from './dynamic-model.controller';
import { DynamicModelService } from './dynamic-model.service';

@Global()
@Module({
  providers: [DynamicModelService],
  exports: [DynamicModelService],
  controllers: [DynamicModelController]
})
export class DynamicModelModule {}
