import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ column: true, short: true, label: 'Хэрэглэгч' })
  name: string;

  @Prop()
  password: string;
}

export const UserSchema = SchemaFactory.createForClass(User);