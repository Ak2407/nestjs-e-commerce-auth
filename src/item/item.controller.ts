import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ItemService } from './item.service';
import { CreateItemDto } from './dto/createItem.dto';
import { Item } from './item.schema';

enum Category {
  Electronics = 'Electronics',
  Clothes = 'Clothes',
  Food = 'Food',
  Shoes = 'Shoes',
  Cosmetic = 'Cosmetic',
}

@Controller('item')
export class ItemController {
  constructor(private readonly itemService: ItemService) {}

  // Creating a new Item
  @Post()
  async create(@Body() item: CreateItemDto): Promise<Item> {
    return this.itemService.create(item);
  }

  // Finding all Items
  @Get()
  async findAll(): Promise<Item[]> {
    return this.itemService.findAll();
  }

  // Finding Items by category
  @Get('category/:category')
  async findByCategory(@Param('category') category: Category): Promise<Item[]> {
    return this.itemService.findByCategory(category);
  }

  // Finding Items by seller
  @Get('seller/:seller')
  async findBySeller(@Param('seller') seller: string): Promise<Item[]> {
    return this.itemService.findBySeller(seller);
  }

  // Deleting an Item
  @Delete(':itemId')
  async delete(@Param('itemId') itemId: string): Promise<Item> {
    return this.itemService.delete(itemId);
  }
}
