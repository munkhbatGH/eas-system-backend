import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ObjectId } from 'mongodb';

export type SetMenuDocument = SetRole & Document;

@Schema()
export class SetRole {

  @Prop({ column: true, label: 'Бүлэг', sortable: false, filterable: true, filterType: 'text' })
  group: string;

  @Prop({ column: true, label: 'Код', sortable: false, filterable: true, filterType: 'text' })
  code: string;

  @Prop({ column: true, label: 'Нэр', sortable: false, filterable: true, filterType: 'text', short: true })
  name: string;

  @Prop({ column: true, label: 'Тайлбар', sortable: false, filterable: true, filterType: 'text' })
  desc: string;

  @Prop({ column: true, type: [{ type: ObjectId }], label: 'Цэс', sortable: false, filterable: false, filterType: 'array', allowed: true })
  menuList: Array<any>;

  @Prop({ default: true })
  active: boolean;
  
}

export const SetRoleSchema = SchemaFactory.createForClass(SetRole);
