import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ObjectId } from 'mongodb';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ column: true, short: true, label: 'Хэрэглэгч', sortable: false, filterable: true, filterType: 'text' })
  name: string;

  @Prop()
  password: string;

  @Prop({ label: 'Дүр', type: 'ObjectID', ref: 'SetRole', short: true, column: true, lookup: true, lookupProject: ['name'], sortable: false, filterable: false, filterType: 'ObjectId' })
  roleId: ObjectId;

}

export const UserSchema = SchemaFactory.createForClass(User);