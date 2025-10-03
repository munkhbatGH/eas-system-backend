import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { BaseSchema } from './_base.schema';
import { ObjectId } from 'mongodb';

export type SetMenuDocument = SetMenu & Document;

@Schema()
export class SetMenu extends BaseSchema {

  @Prop({ column: true, label: 'Parent', sortable: false, filterable: true, filterType: 'text'  })
  parent: string;

  @Prop({ column: true, label: 'Код', sortable: false, filterable: true, filterType: 'text'  })
  code: string;

  @Prop({ column: true, label: 'Нэр', sortable: false, filterable: true, filterType: 'text'  })
  name: string;

  @Prop({ column: true, label: 'Тайлбар', sortable: false, filterable: true, filterType: 'text' })
  desc: string;

  @Prop({ label: 'Модуль', type: 'ObjectID', ref: 'SetModule', short: true, column: true, lookup: true, lookupProject: ['name'], sortable: false, filterable: false, filterType: 'ObjectId' })
  moduleId: ObjectId;

  constructor(item: Partial<SetMenu>) {
    super()
    Object.assign(this, item)
  }
}

export const SetMenuSchema = SchemaFactory.createForClass(SetMenu);
