import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model } from 'mongoose';

// export type UserDocument = HydratedDocument<User>;
export type UserDocument = User & Document; 

@Schema()
export class User extends Model{
  @Prop({ column: true })
  name: string;

  @Prop()
  password: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
