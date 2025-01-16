import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Item } from './item.schema';
import { Model } from 'mongoose';
import { UserService } from 'src/user/user.service';
import { CreateItemDto } from './dto/createItem.dto';
import { User } from 'src/user/user.schema';

@Injectable()
export class ItemService {
  constructor(
    @InjectModel(Item.name) private itemModel: Model<Item>,
    @InjectModel(User.name) private userModel: Model<User>,
    private userService: UserService,
  ) {}

  async create(item: CreateItemDto): Promise<Item> {
    try {
      const isItem = await this.itemModel.findOne({ name: item.name });

      if (isItem) {
        throw new Error(`Item with this name already exists`);
      }

      const seller = await this.userModel.findById(item.seller.toString());
      if (!seller) {
        throw new Error(`User does not exist`);
      }

      const createdItem = await this.itemModel.create(item);
      if (!createdItem) {
        throw new Error('Error creating item');
      }

      seller.items.push(createdItem);
      seller.save();

      return createdItem;
    } catch (error) {
      console.log(error);
      throw new Error('Error creating item');
    }
  }

  async findAll(): Promise<Item[]> {
    return this.itemModel.find().exec();
  }

  async findByCategory(category: string): Promise<Item[]> {
    return this.itemModel.find({ category }).exec();
  }

  async findBySeller(sellerId: string): Promise<Item[]> {
    try {
      const isUser = await this.userService.findById(sellerId);

      if (!isUser) {
        throw new Error(`User does not exist`);
      }

      return this.itemModel.find({ seller: sellerId }).exec();
    } catch (error) {
      console.log(error);
      throw new Error(`Error finding item for this seller`);
    }
  }

  async delete(itemId: string): Promise<Item> {
    return this.itemModel.findByIdAndDelete(itemId).exec();
  }
}
