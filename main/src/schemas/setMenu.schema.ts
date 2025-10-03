import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { BaseSchema } from './_base.schema';
import { ObjectId } from 'mongodb';

export type SetMenuDocument = SetMenu & Document;

@Schema()
export class SetMenu extends BaseSchema {

  @Prop({ label: 'Parent', type: 'ObjectID', ref: 'SetMenu', short: true, column: true, lookup: true, lookupProject: ['name'], sortable: false, filterable: false, filterType: 'ObjectId' })
  parentId: ObjectId;

  @Prop({ column: true, label: 'Код', sortable: false, filterable: true, filterType: 'text' })
  code: string;

  @Prop({ column: true, label: 'Нэр', sortable: false, filterable: true, filterType: 'text', short: true })
  name: string;

  @Prop({ column: true, label: 'Дараалал', sortable: false, filterable: false, filterType: 'text' })
  order: number;

  @Prop({ label: 'Модуль', type: 'ObjectID', ref: 'SetModule', short: true, column: true, lookup: true, lookupProject: ['name'], sortable: false, filterable: false, filterType: 'ObjectId' })
  moduleId: ObjectId;

  constructor(item: Partial<SetMenu>) {
    super()
    Object.assign(this, item)
  }
}

export const SetMenuSchema = SchemaFactory.createForClass(SetMenu);
