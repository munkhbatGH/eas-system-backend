import { Module } from '@nestjs/common';
import { SchemaController } from './schema.controller';
import { SchemaService } from './schema.service';
import { SchemaAccessService } from './schema.access.service';

@Module({
  controllers: [SchemaController],
  providers: [SchemaService, SchemaAccessService],
})
export class SchemaModule {}
