import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { SchemaService } from './schema.service';
import { AuthGuard } from '../auth/auth.guard';

@Controller('schema')
export class SchemaController {
  constructor(
    private readonly schemaService: SchemaService
) {}

  @UseGuards(AuthGuard)
  @Get('/list/:name')
  async getList(@Request() req): Promise<any[]> {
    return await this.schemaService.findAll(req)
  }

  @UseGuards(AuthGuard)
  @Get('/config/:name')
  async getConfig(@Request() req): Promise<any[]> {
    return await this.schemaService.getSchemaFields(req)
  }
}
