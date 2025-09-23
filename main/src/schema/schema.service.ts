import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { SchemaAccessService } from './schema.access.service';
const schemaHelper = require('../utils/schema.helper')

@Injectable()
export class SchemaService {
  constructor(
    @InjectConnection() private connection: Connection,
    private readonly schemaAccessService: SchemaAccessService
  ) {}

  async findAll(req): Promise<any[]> {
    try {
      const collection = 'User';
      // const schema = await this.schemaAccessService.getSchema(collection)
      // console.log('----schema----', JSON.parse(JSON.stringify(schema)))
      const dddd = await this.schemaAccessService.findAll(collection, ['name', 'Password'], {})
      console.log('----dddd----', dddd)
      return await this.connection.collection('users').find().toArray();
    } catch (error) {
      console.error('Error in findAll:', error);
      throw error;
    }
  }
}
