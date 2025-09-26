import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

@Injectable()
export class DynamicModelService {
  constructor(
    @InjectConnection() private readonly connection: Connection,
  ) {}

  get<T>(modelName: string) {
    const model = this.connection.model<T>(modelName);
    return model;
  }

  async save<T>(modelName: string, data: any): Promise<T | undefined> {
    try {
      const model = this.connection.model<T>(modelName);
      const doc = new model(data);
      await doc.save();
      return doc;
    } catch (error) {
      console.error('-DynamicModelService--error---', error);
      return undefined;
    }
  }

}
