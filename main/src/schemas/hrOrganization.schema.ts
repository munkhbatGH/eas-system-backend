import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { BaseSchema } from './_base.schema';

export type HrOrganizationDocument = HrOrganization & Document;

@Schema()
export class HrOrganization extends BaseSchema {
  @Prop({ column: true, label: 'Код', sortable: false, filterable: true, filterType: 'text' })
  code: string;

  @Prop({ column: true, label: 'Нэр', sortable: false, filterable: true, filterType: 'text', short: true })
  name: string;

  @Prop({ column: true, label: 'Нэр', sortable: false, filterable: true, filterType: 'text', short: true })
  phone: string;

  @Prop({ column: true, type: [{ type: Object }], label: 'Хаяг', sortable: false, filterable: false, filterType: 'array', allowed: true })
  addressList: Array<any>;

  @Prop({ default: true })
  permitted: boolean;

  constructor(item: Partial<HrOrganization>) {
    super()
    Object.assign(this, item)
  }
}

export const HrOrganizationSchema = SchemaFactory.createForClass(HrOrganization);
