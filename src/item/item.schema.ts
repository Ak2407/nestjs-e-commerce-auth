import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { User } from 'src/user/user.schema';

@Schema()
export class Item {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  price: number;

  @Prop({
    required: true,
    enum: ['Electronics', 'Clothes', 'Food', 'Shoes', 'Cosmetic'],
  })
  category: string;

  // Seller
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  seller: User;
}

export const ItemSchema = SchemaFactory.createForClass(Item);
