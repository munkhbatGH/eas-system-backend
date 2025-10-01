import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class BaseSchema {

  @Prop({ default: new Date() })
  createdDate: Date;

  @Prop({})
  updatedDate: Date;

  @Prop({})
  active: boolean;

  @Prop({})
  deleted: boolean;

  @Prop({})
  deletedDate: Date;
}
