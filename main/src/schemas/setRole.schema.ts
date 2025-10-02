import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { BaseSchema } from './_base.schema';

export type SetMenuDocument = SetRole & Document;

@Schema()
export class SetRole extends BaseSchema {

  @Prop({ column: true, label: 'Код', sortable: false, filterable: true, filterType: 'text' })
  code: string;

  @Prop({ column: true, label: 'Нэр', sortable: false, filterable: true, filterType: 'text', short: true })
  name: string;

  @Prop({ column: true, label: 'Тайлбар', sortable: false, filterable: true, filterType: 'text' })
  desc: string;

  @Prop({ column: true, type: [{ type: Object }], label: 'Цэс', sortable: false, filterable: false, filterType: 'array', allowed: true })
  menuList: Array<any>;

  constructor(item: Partial<SetRole>) {
    super()
    Object.assign(this, item)
  }
}

export const SetRoleSchema = SchemaFactory.createForClass(SetRole);
