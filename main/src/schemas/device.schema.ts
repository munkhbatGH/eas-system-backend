import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type DeviceDocument = Device & Document;

@Schema({ timestamps: true })
export class Device {
  @Prop({ type: Types.ObjectId, ref: 'User' })
  userId: Types.ObjectId;

  @Prop()
  deviceToken: string; // uuid

  @Prop()
  fingerprint: string; // sha256 of UA+screen+tz etc.

  @Prop()
  userAgent: string;

  @Prop()
  ip: string;

  @Prop()
  lastSeen: Date;

  @Prop()
  lastUsername: string; // өгөх боломжтой мэдээлэл
}

export const DeviceSchema = SchemaFactory.createForClass(Device);
