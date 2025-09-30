import { BadRequestException, Injectable } from '@nestjs/common';
import { SchemaAccessService, SchemaObjectConfig } from './schema.access.service';
import { SetModule } from 'src/schemas/setModule.schema';
import { DynamicModelService } from 'src/dynamic-model/dynamic-model.service';

@Injectable()
export class SchemaService {
  constructor(
    private readonly schemaAccessService: SchemaAccessService,
    private dynamicModelService: DynamicModelService,
  ) {}

  checkSchema(modelName: string) {
    const checkModels = ['User', 'SetModule']
    if (!modelName || (checkModels.indexOf(modelName) === -1)) {
      throw new BadRequestException('Bad request!')
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
      console.error('Error in schema -> getSchemaFields:', error);
      throw error;
    }
  }

  async findAll(req): Promise<any[]> {
    try {
      await this.checkSchema(req.params.name)
      const collection = req.params.name
      const dddd = await this.schemaAccessService.findAll(collection, ['code', 'name', 'description'], {})
      return dddd
    } catch (error) {
      console.error('Error in schema -> findAll:', error);
      throw error;
    }
  }

  async save(modelName, data): Promise<SetModule | undefined> {
    try {
      await this.checkSchema(modelName)
      const found = await this.dynamicModelService.findOne(modelName, { name: data.name })
      if (found) {
        throw new BadRequestException('Өмнө бүртгэгдсэн байна.');
      }
      return await this.dynamicModelService.save(modelName, data)
    } catch (error) {
      console.error('Error in schema -> save:', error);
      return error;
    }
  }

  async put(modelName, data): Promise<any> {
    try {
      await this.checkSchema(modelName)
      const found = await this.dynamicModelService.findOne(modelName, { _id: data._id })
      if (!found) {
        throw new BadRequestException('Бүртгэл олдсонгүй.');
      }
      const ddd = await this.dynamicModelService.updateOne(modelName, data)
      return { success: true }
    } catch (error) {
      console.error('Error in schema -> save:', error);
      return error;
    }
  }
}
