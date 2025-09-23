import { Controller, Get, UseGuards, Request } from '@nestjs/common';
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
  @Get('list')
  async getList(@Request() req): Promise<any[]> {
    console.log('--schema--list-----')
    // return await this.connection.collection('users').find().toArray();
    return await this.schemaService.findAll(req)
  }
}
