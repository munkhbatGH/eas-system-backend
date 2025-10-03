import { BadRequestException, Injectable } from '@nestjs/common';
import { SchemaAccessService, SchemaObjectConfig } from './schema.access.service';
import { SetModule } from 'src/schemas/setModule.schema';
import { DynamicModelService } from 'src/dynamic-model/dynamic-model.service';
import { ObjectId } from 'mongodb';

const ModelObjects = {
  'User': {
    fields: ['name']
  },
  'SetModule': {
    fields: ['code', 'name', 'description']
  },
  'SetMenu': {
    fields: ['parent', 'code', 'name', 'description', 'createdDate', 'createdUserId']
  },
  'SetAction': {
    fields: ['menuId', 'code', 'name', 'createdDate', 'createdUserId']
  },
  'SetRole': {
    fields: ['code', 'name', 'description', 'menuList']
  }
}

@Injectable()
export class SchemaService {
  constructor(
    private readonly schemaAccessService: SchemaAccessService,
    private dynamicModelService: DynamicModelService,
  ) {}

  checkSchema(modelName: string) {
    if (!modelName || (modelName && !ModelObjects[modelName])) {
      throw new BadRequestException('Bad request!')
    }
    if (modelName && ModelObjects[modelName] && !ModelObjects[modelName].fields) {
      throw new BadRequestException('Bad request!')
    }
    return ModelObjects[modelName]
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

  async findAll(req): Promise<any> {
    try {
      const modelObject = await this.checkSchema(req.params.name)
      const query = req.query || {}
      const collection = req.params.name
      const dddd = await this.schemaAccessService.findAll(collection, modelObject.fields, { active: true }, query)
      return dddd
    } catch (error) {
      console.error('Error in schema -> findAll:', error);
      throw error;
    }
  }

  async findAllById(req): Promise<any> {
    try {
      const modelObject = await this.checkSchema(req.params.name)
      const query = req.query || {}
      const collection = req.params.name
      const filter = { active: true, menuId: new ObjectId(req.params.id) }
      const dddd = await this.schemaAccessService.findAll(collection, modelObject.fields, filter, query)
      return dddd
    } catch (error) {
      console.error('Error in schema -> findAll:', error);
      throw error;
    }
  }

  async save(modelName, data, user): Promise<SetModule | undefined> {
    try {
      await this.checkSchema(modelName)
      const found = await this.dynamicModelService.findOne(modelName, { name: data.name, active: true })
      if (found) {
        throw new BadRequestException('Өмнө бүртгэгдсэн байна.');
      }
      return await this.dynamicModelService.save(modelName, data, user)
    } catch (error) {
      console.error('Error in schema -> save:', error);
      throw error;
    }
  }

  async put(modelName, data, user): Promise<any> {
    try {
      await this.checkSchema(modelName)
      const found = await this.dynamicModelService.findOne(modelName, { _id: data._id })
      if (!found) {
        throw new BadRequestException('Бүртгэл олдсонгүй.');
      }
      const ddd = await this.dynamicModelService.updateOne(modelName, data, user)
      return { success: true }
    } catch (error) {
      console.error('Error in schema -> save:', error);
      throw error;
    }
  }

  async delete(modelName, data): Promise<any> {
    try {
      await this.checkSchema(modelName)
      const found = await this.dynamicModelService.findOne(modelName, { _id: new ObjectId(data.id) })
      if (!found) {
        throw new BadRequestException('Бүртгэл олдсонгүй.');
      }
      const ddd = await this.dynamicModelService.deleteOne(modelName, found)
      console.log('ddd:', ddd);
      return ddd
    } catch (error) {
      console.error('Error in schema -> delete:', error);
      throw error;
    }
  }
}
