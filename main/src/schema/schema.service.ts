import { BadRequestException, Injectable } from '@nestjs/common';
import { SchemaAccessService } from './schema.access.service';

@Injectable()
export class SchemaService {
  constructor(
    private readonly schemaAccessService: SchemaAccessService
  ) {}

  async findAll(req): Promise<any[]> {
    try {
      console.log('--schema--list-----', req.params)
      const checkModels = ['User']
      if (!req.params.name || (checkModels.indexOf(req.params.name) === -1)) {
        throw new BadRequestException('Bad request!')
      }
      const collection = req.params.name
      const dddd = await this.schemaAccessService.findAll(collection, ['name', 'password'], {})
      return dddd
    } catch (error) {
      console.error('Error in findAll:', error);
      throw error;
    }
  }
}
