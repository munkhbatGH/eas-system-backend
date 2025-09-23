import { Controller, Get, UseGuards, Request, BadRequestException } from '@nestjs/common';
import { SchemaService } from './schema.service';
import { AuthGuard } from '../auth/auth.guard';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

@Controller('schema')
export class SchemaController {
  constructor(
    @InjectConnection() private connection: Connection,
    private readonly schemaService: SchemaService
) {}

  @UseGuards(AuthGuard)
  @Get('/list/:name')
  async getList(@Request() req): Promise<any[]> {
    // return await this.connection.collection('users').find().toArray();
    return await this.schemaService.findAll(req)
  }
}
