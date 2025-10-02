import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';
import { Connection } from 'mongoose';

@Injectable()
export class DynamicModelService {
  constructor(
    @InjectConnection() private readonly connection: Connection,
  ) {}

  getModel<T>(modelName: string) {
    const model = this.connection.model<T>(modelName);
    return model;
  }

  async findOne<T>(modelName: string, filter: any): Promise<any> {
    const model = await this.getModel(modelName)
    return await model.findOne(filter)
  }

  async findAll<T>(modelName: string, filter: any): Promise<any> {
    const model = await this.getModel(modelName)
    return await model.find(filter)
  }

  async save<T>(modelName: string, data: any, user): Promise<T | undefined> {
    try {
      data.createdUserId = user && user._id ? user._id : null;
      const model = this.connection.model<T>(modelName);
      const doc = new model(data);
      await doc.save();
      return doc;
    } catch (error) {
      return undefined;
    }
  }

  async updateOne<T>(modelName: string, data: any, user): Promise<any> {
    try {
      const model = this.connection.model<T>(modelName);

      const updatedFields = { updatedUserId: user._id, updatedDate: new Date() }
      const result = await model.updateOne({ _id: new ObjectId(data._id) }, { $set: Object.assign(updatedFields, data) });
      return { success: result.modifiedCount > 0, data };
    } catch (error) {
      console.error('-error -> DynamicModelService-updateOne---', error);
      return error;
    }
  }

  async deleteOne<T>(modelName: string, data: any): Promise<any> {
    try {
      const model = this.connection.model<T>(modelName);
      const result = await model.updateOne({ _id: new ObjectId(data._id) }, { $set: { active: false, deleted: true, deletedDate: new Date() } });
      return { success: result.modifiedCount > 0 };
    } catch (error) {
      console.error('-error -> DynamicModelService-updateOne---', error);
      return error;
    }
  }

}
