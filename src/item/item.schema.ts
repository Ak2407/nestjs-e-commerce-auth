import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { User } from 'src/user/user.schema';

@Schema()
export class Item {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop()
  description: string;

  @Prop({ required: true })
  price: number;

  @Prop({
    required: true,
    enum: ['electronics', 'clothes', 'food', 'shoes', 'cosmetic'],
  })
  category: string;

  // Seller
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  seller: User;
}

export const ItemSchema = SchemaFactory.createForClass(Item);
