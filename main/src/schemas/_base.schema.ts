import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';

@Schema()
export class BaseSchema {

  @Prop({ default: new Date() })
  createdDate: Date;

  @Prop({ label: 'Бүртгэсэн', type: 'ObjectID', ref: 'User', short: true, column: true, lookup: true, lookupProject: ['name'], sortable: false, filterable: false, filterType: 'object' })
  createdUserId: ObjectId;

  @Prop({})
  updatedDate: Date;

  @Prop({})
  updatedUserId: ObjectId;

  @Prop({ default: true })
  active: boolean;

  @Prop({})
  deleted: boolean;

  @Prop({})
  deletedDate: Date;

  @Prop({})
  deletedUserId: ObjectId;
}
