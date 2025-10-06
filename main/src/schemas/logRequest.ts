import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';
import { Document } from 'mongoose';

export type LogRequestDocument = LogRequest & Document;

@Schema()
export class LogRequest {

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

export const LogRequestSchema = SchemaFactory.createForClass(LogRequest);
