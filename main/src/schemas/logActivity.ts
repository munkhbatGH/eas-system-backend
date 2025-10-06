import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';
import { Document } from 'mongoose';

export type LogActivityDocument = LogActivity & Document;

@Schema()
export class LogActivity {

  @Prop({})
  method: string;

  @Prop({})
  url: string;

  @Prop({})
  fromUrl: string;

  @Prop({})
  body: string;

  @Prop({ default: new Date() })
  createdDate: Date;

  @Prop({})
  createdUserId: ObjectId;
}

export const LogActivitySchema = SchemaFactory.createForClass(LogActivity);
