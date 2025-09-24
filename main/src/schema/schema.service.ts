import { BadRequestException, Injectable } from '@nestjs/common';
import { SchemaAccessService, SchemaObjectConfig } from './schema.access.service';

@Injectable()
export class SchemaService {
  constructor(
    private readonly schemaAccessService: SchemaAccessService
  ) {}

  checkSchema(modelName: string) {
    const checkModels = ['User', 'SetModule']
    if (!modelName || (checkModels.indexOf(modelName) === -1)) {
      throw new BadRequestException('Bad request!')
    }
  }

  async findAll(req): Promise<any[]> {
    try {
      await this.checkSchema(req.params.name)
      const collection = req.params.name
      const dddd = await this.schemaAccessService.findAll(collection, ['name', 'password'], {})
      return dddd
    } catch (error) {
      console.error('Error in findAll:', error);
      throw error;
    }
  }

  async getSchemaFields(req): Promise<any[]> {
    try {
      await this.checkSchema(req.params.name)

      const collection = req.params.name
      const { schema }: SchemaObjectConfig = this.schemaAccessService.getSchema(collection);
      const columns = await this.schemaAccessService.getColumnsProps(schema)
      return columns
    } catch (error) {
      console.error('Error in getSchemaFields:', error);
      throw error;
    }
  }
}
