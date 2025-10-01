import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { BaseSchema } from './_base.schema';

export type SetModuleDocument = SetModule & Document;

@Schema()
export class SetModule extends BaseSchema {
  @Prop({ column: true, label: 'Код', sortable: false, filterable: true, filterType: 'text'  })
  code: string;

  @Prop({ column: true, label: 'Нэр', sortable: false, filterable: true, filterType: 'text'  })
  name: string;

  @Prop({ column: true, label: 'Тайлбар', sortable: false, filterable: true, filterType: 'text' })
  desc: string;

  constructor(item: Partial<SetModule>) {
    super()
    Object.assign(this, item)
  }
}

export const SetModuleSchema = SchemaFactory.createForClass(SetModule);
