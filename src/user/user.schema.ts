import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

@Schema()
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true, enum: ['admin', 'user'] })
  role: string;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Item' }] })
  items: mongoose.Schema.Types.ObjectId[];
}

export const UserSchema = SchemaFactory.createForClass(User);
