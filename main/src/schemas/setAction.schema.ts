import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { BaseSchema } from './_base.schema';

export type SetActionDocument = SetAction & Document;

@Schema()
export class SetAction extends BaseSchema {
  @Prop({ column: true, label: 'Код', sortable: false, filterable: true, filterType: 'text' })
  code: string;

  @Prop({ column: true, label: 'Нэр', sortable: false, filterable: true, filterType: 'text', short: true })
  name: string;

  @Prop({ column: true, label: 'Тайлбар', sortable: false, filterable: true, filterType: 'text' })
  desc: string;

  constructor(item: Partial<SetAction>) {
    super()
    Object.assign(this, item)
  }
}

export const SetActionSchema = SchemaFactory.createForClass(SetAction);
