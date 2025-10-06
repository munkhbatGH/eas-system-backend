import {
    PipeTransform,
    Injectable,
    ArgumentMetadata,
    BadRequestException,
  } from '@nestjs/common';
  import * as zod from 'zod';
  
  @Injectable()
  export class ZodValidationPipe implements PipeTransform {
    constructor(private schema: zod.ZodSchema) {}
  
    transform(value: any, metadata: ArgumentMetadata) {
      const result = this.schema.safeParse(value);
      if (!result.success) {
        throw new BadRequestException(result.error.format());
      }
      return result.data;
    }
  }
  